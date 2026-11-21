const express = require("express");

const router = express.Router();
const weatherCache = new Map();
const weatherInFlight = new Map();
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;

function roundedCoordinate(value) {
    return Math.round(value * 100) / 100;
}

function weatherCacheKey(latitude, longitude) {
    return `${roundedCoordinate(latitude)},${roundedCoordinate(longitude)}`;
}

const WEATHER_DESCRIPTIONS = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers"
};

function describeWeather(code) {
    if (code === 95) return "Thunderstorm";
    if (code === 96) return "Thunderstorm with slight hail";
    if (code === 99) return "Thunderstorm with heavy hail";
    return WEATHER_DESCRIPTIONS[code] || "Unknown weather";
}

async function fetchOpenMeteo(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Open-Meteo returned HTTP ${response.status}`);
    }

    return response.json();
}

router.get("/geocode", async (req, res) => {
    const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
    if (!name) {
        return res.status(400).json({ success: false, error: "Enter a location name." });
    }

    try {
        const query = new URLSearchParams({
            name,
            count: "10",
            language: "en",
            format: "json"
        });
        const data = await fetchOpenMeteo(
            `https://geocoding-api.open-meteo.com/v1/search?${query.toString()}`
        );

        const locations = (Array.isArray(data.results) ? data.results : [])
            .filter((place) =>
                typeof place.name === "string" &&
                typeof place.country === "string" &&
                Number.isFinite(place.latitude) &&
                Number.isFinite(place.longitude)
            )
            .map((place) => ({
                name: place.name,
                country: place.country,
                admin1: place.admin1 || "",
                latitude: place.latitude,
                longitude: place.longitude
            }));

        if (!locations.length) {
            return res.status(404).json({
                success: false,
                error: `No matching locations found for "${name}".`
            });
        }

        return res.json({ success: true, locations });
    } catch (error) {
        console.error("Open-Meteo geocoding request failed:", error);
        return res.status(502).json({
            success: false,
            error: "Location search is temporarily unavailable. Please try again."
        });
    }
});


router.get("/weather", async (req, res) => {
    const latitudeValue = typeof req.query.latitude === "string" ? req.query.latitude.trim() : "";
    const longitudeValue = typeof req.query.longitude === "string" ? req.query.longitude.trim() : "";
    const latitude = Number(latitudeValue);
    const longitude = Number(longitudeValue);
    if (
        !latitudeValue ||
        !longitudeValue ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        return res.status(400).json({
            success: false,
            error: "Provide a valid latitude and longitude."
        });
    }

    const cacheKey = weatherCacheKey(latitude, longitude);
    const cached = weatherCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        res.set("X-Weather-Cache", "HIT");
        return res.json({ ...cached.data, cached: true });
    }
    if (cached) weatherCache.delete(cacheKey);

    if (weatherInFlight.has(cacheKey)) {
        try {
            const data = await weatherInFlight.get(cacheKey);
            return res.json({ ...data, cached: true });
        } catch (error) {
            console.error("Deduplicated weather request failed:", error);
            return res.status(error.statusCode || 502).json({
                success: false,
                error: error.statusCode === 429
                    ? "Weather provider is busy. Please wait a moment and try again."
                    : "Weather data is temporarily unavailable. Please try again."
            });
        }
    }

    const requestPromise = (async () => {
        const query = new URLSearchParams({
            latitude: String(latitude),
            longitude: String(longitude),
            current: "temperature_2m,relative_humidity_2m,precipitation,weather_code",
            daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
            forecast_days: "7",
            timezone: "auto"
        });
        const url = `https://api.open-meteo.com/v1/forecast?${query.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            const error = new Error(`Open-Meteo returned HTTP ${response.status}`);
            error.statusCode = response.status;
            error.retryAfter = response.headers.get("retry-after");
            throw error;
        }
        const data = await response.json();

        if (
            !data.current ||
            !data.daily ||
            !Array.isArray(data.daily.time) ||
            data.daily.time.length < 7 ||
            !Array.isArray(data.daily.temperature_2m_max) ||
            data.daily.temperature_2m_max.length < 7 ||
            !Array.isArray(data.daily.temperature_2m_min) ||
            data.daily.temperature_2m_min.length < 7 ||
            !Array.isArray(data.daily.precipitation_sum) ||
            data.daily.precipitation_sum.length < 7
        ) {
            throw new Error("Open-Meteo returned an incomplete forecast.");
        }

        const current = data.current;
        const forecast = data.daily.time.slice(0, 7).map((date, index) => ({
            date,
            temperatureMaxC: data.daily.temperature_2m_max[index],
            temperatureMinC: data.daily.temperature_2m_min[index],
            precipitationMm: data.daily.precipitation_sum[index]
        }));

        const result = {
            success: true,
            current: {
                temperatureC: current.temperature_2m,
                relativeHumidityPercent: current.relative_humidity_2m,
                precipitationMm: current.precipitation,
                weatherCode: current.weather_code,
                weatherDescription: describeWeather(current.weather_code)
            },
            forecast
        };
        weatherCache.set(cacheKey, { data: result, expiresAt: Date.now() + WEATHER_CACHE_TTL_MS });
        return result;
    })();

    weatherInFlight.set(cacheKey, requestPromise);
    try {
        const data = await requestPromise;
        return res.json(data);
    } catch (error) {
        console.error("Open-Meteo weather request failed:", error);
        const status = error.statusCode === 429 ? 429 : 502;
        if (error.retryAfter) res.set("Retry-After", error.retryAfter);
        return res.status(status).json({
            success: false,
            error: status === 429
                ? "Weather provider is busy. Please wait a moment and try again."
                : "Weather data is temporarily unavailable. Please try again."
        });
    } finally {
        weatherInFlight.delete(cacheKey);
    }
});

module.exports = router;
