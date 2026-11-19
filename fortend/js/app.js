const locationSearchForm = document.getElementById("locationSearchForm");
const locationSearchInput = document.getElementById("locationSearch");
const locationSearchButton = document.getElementById("locationSearchButton");
const locationCandidates = document.getElementById("locationCandidates");
const farmLocationInput = document.getElementById("farmLocation");
const locationFeedback = document.getElementById("locationFeedback");
const farmForm = document.getElementById("farmForm");
const farmFeedback = document.getElementById("farmFeedback");
const soilMoistureInput = document.getElementById("soilMoisture");
const farmMapElement = document.getElementById("farmMap");
const selectedLocationSummary = document.getElementById("selectedLocationSummary");
const selectedLocationCoordinates = document.getElementById("selectedLocationCoordinates");
const farmMapLocation = document.getElementById("farmMapLocation");
const farmMapCoordinates = document.getElementById("farmMapCoordinates");
const farmMapFeedback = document.getElementById("farmMapFeedback");
const confirmedFarmLocation = document.getElementById("confirmedFarmLocation");
const confirmFarmLocationButton = document.getElementById("confirmFarmLocation");
const reportLanguage = document.getElementById("reportLanguage");
const climateReportText = document.getElementById("climateReportText");
const reportVoiceStatus = document.getElementById("reportVoiceStatus");
const playReportButton = document.getElementById("playReport");
const pauseReportButton = document.getElementById("pauseReport");
const stopReportButton = document.getElementById("stopReport");

const CROP_FACTORS = {
    Rice: { depletionBeforeStress: 0.20, kcMid: 1.20 },
    Wheat: { depletionBeforeStress: 0.55, kcMid: 1.15 },
    Maize: { depletionBeforeStress: 0.55, kcMid: 1.20 },
    Cotton: { depletionBeforeStress: 0.65, kcMid: 1.175 },
    Groundnut: { depletionBeforeStress: 0.50, kcMid: 1.15 },
    Sugarcane: { depletionBeforeStress: 0.65, kcMid: 1.25 },
    Tomato: { depletionBeforeStress: 0.40, kcMid: 1.15 }
};

const SOIL_FACTORS = {
    Sandy: { waterRetentionRatio: 0.60, depletionAdjustment: 0.10, drainageFactor: 0.90, drainageLabel: "rapid" },
    Clay: { waterRetentionRatio: 0.80, depletionAdjustment: -0.10, drainageFactor: 0.30, drainageLabel: "slow" },
    Loamy: { waterRetentionRatio: 1.00, depletionAdjustment: 0, drainageFactor: 0.70, drainageLabel: "moderate to good" },
    Silty: { waterRetentionRatio: 1.13, depletionAdjustment: -0.05, drainageFactor: 0.50, drainageLabel: "moderate to slow" },
    "Black soil": { waterRetentionRatio: 0.80, depletionAdjustment: -0.10, drainageFactor: 0.25, drainageLabel: "very slow (clay-rich proxy)" },
    "Red soil": { waterRetentionRatio: 0.60, depletionAdjustment: 0.05, drainageFactor: 0.80, drainageLabel: "good (red-loam proxy)" }
};

const CLIMATE_REPORT_TEXT = {
    en: {
        locale: "en-US",
        title: "Climate report",
        language: "Report language",
        play: "Play report",
        pause: "Pause",
        resume: "Resume",
        stop: "Stop",
        pending: "Run climate risk analysis to prepare a climate report.",
        noVoice: "No speech voice is available for this language in your browser.",
        voiceUnsupported: "Speech playback is not supported in this browser.",
        voicePlaying: "Reading the climate report...",
        voicePaused: "Report paused.",
        voiceStopped: "Playback stopped.",
        voiceError: "Speech playback could not start. Check the browser's speech settings.",
        categories: { Low: "Low", Moderate: "Moderate", High: "High" },
        summary: (data) => `Selected location: ${data.location}. Crop: ${data.crop}. Soil: ${data.soil}. Entered soil moisture: ${data.moisture} percent. Current weather: ${data.weather}; ${data.temperature} degrees Celsius, ${data.humidity} percent relative humidity, and ${data.precipitation} millimeters precipitation. Drought risk: ${data.drought} (${data.droughtScore} out of 100). Heavy rainfall risk: ${data.rain} (${data.rainScore} out of 100). Overall climate risk: ${data.overall}. These are prototype climate-risk estimates, not a crop-yield prediction.`
    },
    te: {
        locale: "te-IN",
        title: "వాతావరణ నివేదిక",
        language: "నివేదిక భాష",
        play: "నివేదిక వినండి",
        pause: "విరామం",
        resume: "కొనసాగించండి",
        stop: "ఆపండి",
        pending: "వాతావరణ నివేదిక కోసం ముందుగా ప్రమాద విశ్లేషణ చేయండి.",
        noVoice: "ఈ భాషకు మీ బ్రౌజర్‌లో స్వరం అందుబాటులో లేదు.",
        voiceUnsupported: "ఈ బ్రౌజర్‌లో మాటల రూపంలో చదివే సౌకర్యం లేదు.",
        voicePlaying: "వాతావరణ నివేదిక చదువుతోంది...",
        voicePaused: "నివేదిక నిలిపివేయబడింది.",
        voiceStopped: "చదవడం ఆపబడింది.",
        voiceError: "నివేదికను చదవడం ప్రారంభం కాలేదు. బ్రౌజర్ మాటల సెట్టింగులను చూడండి.",
        categories: { Low: "తక్కువ", Moderate: "మధ్యస్థం", High: "ఎక్కువ" },
        summary: (data) => `ఎంచుకున్న ప్రదేశం: ${data.location}. పంట: ${data.crop}. నేల రకం: ${data.soil}. మీరు నమోదు చేసిన నేల తేమ ${data.moisture} శాతం. ప్రస్తుత వాతావరణం: ${data.weather}; ఉష్ణోగ్రత ${data.temperature} డిగ్రీల సెల్సియస్, సాపేక్ష ఆర్ద్రత ${data.humidity} శాతం, వర్షపాతం ${data.precipitation} మిల్లీమీటర్లు. కరువు ప్రమాదం ${data.drought}, ${data.droughtScore} లో 100. భారీ వర్షపాతం ప్రమాదం ${data.rain}, ${data.rainScore} లో 100. మొత్తం వాతావరణ ప్రమాదం ${data.overall}. ఇవి నమూనా వాతావరణ ప్రమాద అంచనాలు మాత్రమే; పంట దిగుబడి అంచనా కాదు.`
    },
    hi: {
        locale: "hi-IN",
        title: "जलवायु रिपोर्ट",
        language: "रिपोर्ट की भाषा",
        play: "रिपोर्ट सुनें",
        pause: "रोकें",
        resume: "जारी रखें",
        stop: "बंद करें",
        pending: "जलवायु रिपोर्ट बनाने के लिए पहले जोखिम विश्लेषण चलाएँ।",
        noVoice: "आपके ब्राउज़र में इस भाषा की आवाज़ उपलब्ध नहीं है।",
        voiceUnsupported: "इस ब्राउज़र में आवाज़ में पढ़ने की सुविधा उपलब्ध नहीं है।",
        voicePlaying: "जलवायु रिपोर्ट पढ़ी जा रही है...",
        voicePaused: "रिपोर्ट रोक दी गई है।",
        voiceStopped: "पढ़ना बंद कर दिया गया है।",
        voiceError: "रिपोर्ट पढ़ना शुरू नहीं हो सका। ब्राउज़र की आवाज़ सेटिंग जाँचें।",
        categories: { Low: "कम", Moderate: "मध्यम", High: "अधिक" },
        summary: (data) => `चुना गया स्थान: ${data.location}। फसल: ${data.crop}। मिट्टी का प्रकार: ${data.soil}। दर्ज मिट्टी की नमी ${data.moisture} प्रतिशत है। अभी का मौसम: ${data.weather}; तापमान ${data.temperature} डिग्री सेल्सियस, सापेक्ष आर्द्रता ${data.humidity} प्रतिशत और वर्षा ${data.precipitation} मिलीमीटर। सूखे का जोखिम ${data.drought}, 100 में से ${data.droughtScore}। भारी वर्षा का जोखिम ${data.rain}, 100 में से ${data.rainScore}। कुल जलवायु जोखिम ${data.overall}। ये प्रारूप जलवायु-जोखिम अनुमान हैं, फसल की उपज का अनुमान नहीं।`
    },
    kn: {
        locale: "kn-IN",
        title: "ಹವಾಮಾನ ವರದಿ",
        language: "ವರದಿ ಭಾಷೆ",
        play: "ವರದಿಯನ್ನು ಕೇಳಿ",
        pause: "ವಿರಾಮ",
        resume: "ಮುಂದುವರಿಸಿ",
        stop: "ನಿಲ್ಲಿಸಿ",
        pending: "ಹವಾಮಾನ ವರದಿಗಾಗಿ ಮೊದಲು ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ ಮಾಡಿ.",
        noVoice: "ಈ ಭಾಷೆಯ ಧ್ವನಿ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
        voiceUnsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಓದುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ.",
        voicePlaying: "ಹವಾಮಾನ ವರದಿಯನ್ನು ಓದಲಾಗುತ್ತಿದೆ...",
        voicePaused: "ವರದಿಯನ್ನು ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ.",
        voiceStopped: "ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ.",
        voiceError: "ವರದಿಯ ಓದು ಆರಂಭವಾಗಲಿಲ್ಲ. ಬ್ರೌಸರ್‌ನ ಧ್ವನಿ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
        categories: { Low: "ಕಡಿಮೆ", Moderate: "ಮಧ್ಯಮ", High: "ಹೆಚ್ಚು" },
        summary: (data) => `ಆಯ್ಕೆ ಮಾಡಿದ ಸ್ಥಳ: ${data.location}. ಬೆಳೆ: ${data.crop}. ಮಣ್ಣಿನ ವಿಧ: ${data.soil}. ನಮೂದಿಸಿದ ಮಣ್ಣಿನ ತೇವಾಂಶ ${data.moisture} ಶೇಕಡಾ. ಪ್ರಸ್ತುತ ಹವಾಮಾನ: ${data.weather}; ತಾಪಮಾನ ${data.temperature} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್, ಸಾಪೇಕ್ಷ ಆರ್ದ್ರತೆ ${data.humidity} ಶೇಕಡಾ ಮತ್ತು ಮಳೆ ${data.precipitation} ಮಿಲಿಮೀಟರ್. ಬರ ಅಪಾಯ ${data.drought}, 100ರಲ್ಲಿ ${data.droughtScore}. ಭಾರಿ ಮಳೆ ಅಪಾಯ ${data.rain}, 100ರಲ್ಲಿ ${data.rainScore}. ಒಟ್ಟಾರೆ ಹವಾಮಾನ ಅಪಾಯ ${data.overall}. ಇವು ಮಾದರಿ ಹವಾಮಾನ-ಅಪಾಯ ಅಂದಾಜುಗಳು ಮಾತ್ರ; ಬೆಳೆ ಇಳುವರಿ ಅಂದಾಜಲ್ಲ.`
    }
};

const CLIMATE_REPORT_CROP_NAMES = {
    en: { Rice: "Rice", Wheat: "Wheat", Maize: "Maize", Cotton: "Cotton", Groundnut: "Groundnut", Sugarcane: "Sugarcane", Tomato: "Tomato" },
    te: { Rice: "వరి", Wheat: "గోధుమ", Maize: "మొక్కజొన్న", Cotton: "పత్తి", Groundnut: "వేరుశనగ", Sugarcane: "చెరకు", Tomato: "టమాటా" },
    hi: { Rice: "धान", Wheat: "गेहूँ", Maize: "मक्का", Cotton: "कपास", Groundnut: "मूँगफली", Sugarcane: "गन्ना", Tomato: "टमाटर" },
    kn: { Rice: "ಭತ್ತ", Wheat: "ಗೋಧಿ", Maize: "ಮೆಕ್ಕೆಜೋಳ", Cotton: "ಹತ್ತಿ", Groundnut: "ಕಡಲೆಕಾಯಿ", Sugarcane: "ಕಬ್ಬು", Tomato: "ಟೊಮೇಟೊ" }
};

const CLIMATE_REPORT_SOIL_NAMES = {
    en: { Sandy: "Sandy", Clay: "Clay", Loamy: "Loamy", Silty: "Silty", "Black soil": "Black soil", "Red soil": "Red soil" },
    te: { Sandy: "ఇసుక", Clay: "బంకమట్టి", Loamy: "లోమీ", Silty: "సిల్ట్", "Black soil": "నల్ల నేల", "Red soil": "ఎర్ర నేల" },
    hi: { Sandy: "रेतीली", Clay: "चिकनी", Loamy: "दोमट", Silty: "गाद वाली", "Black soil": "काली मिट्टी", "Red soil": "लाल मिट्टी" },
    kn: { Sandy: "ಮರಳು", Clay: "ಜೇಡಿ", Loamy: "ಲೋಮಿ", Silty: "ಸಿಲ್ಟ್", "Black soil": "ಕಪ್ಪು ಮಣ್ಣು", "Red soil": "ಕೆಂಪು ಮಣ್ಣು" }
};

const CLIMATE_REPORT_WEATHER_TYPES = {
    en: { clear: "Clear sky", partlyCloudy: "Partly cloudy", cloudy: "Cloudy", fog: "Fog", drizzle: "Drizzle", rain: "Rain", snow: "Snow", showers: "Rain showers", snowShowers: "Snow showers", storm: "Thunderstorm", unknown: "Weather information unavailable" },
    te: { clear: "నిర్మలమైన ఆకాశం", partlyCloudy: "కొంత మేఘావృతం", cloudy: "మేఘావృతం", fog: "పొగమంచు", drizzle: "చిరుజల్లులు", rain: "వర్షం", snow: "మంచు", showers: "వర్షపు జల్లులు", snowShowers: "మంచు జల్లులు", storm: "ఉరుములతో కూడిన వర్షం", unknown: "వాతావరణ సమాచారం అందుబాటులో లేదు" },
    hi: { clear: "साफ़ आकाश", partlyCloudy: "आंशिक बादल", cloudy: "बादल छाए हुए", fog: "कोहरा", drizzle: "बूंदाबांदी", rain: "बारिश", snow: "बर्फ़", showers: "बारिश की बौछारें", snowShowers: "बर्फ़ की बौछारें", storm: "गरज के साथ बारिश", unknown: "मौसम की जानकारी उपलब्ध नहीं है" },
    kn: { clear: "ನಿರ್ಮಲ ಆಕಾಶ", partlyCloudy: "ಭಾಗಶಃ ಮೋಡ", cloudy: "ಮೋಡ ಕವಿದಿದೆ", fog: "ಮಂಜು", drizzle: "ತುಂತುರು ಮಳೆ", rain: "ಮಳೆ", snow: "ಹಿಮ", showers: "ಮಳೆಯ ತುಂತುರು", snowShowers: "ಹಿಮದ ತುಂತುರು", storm: "ಗುಡುಗು ಸಹಿತ ಮಳೆ", unknown: "ಹವಾಮಾನ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ" }
};

let matchingLocations = [];
let weatherRequestId = 0;
let locationSearchRequestId = 0;
let selectedWeatherData = null;
let climateReportData = null;
let farmMap = null;
let farmMarker = null;
let selectedFarmLocation = null;
let currentUtterance = null;
let reportIsPaused = false;
let speechRequestId = 0;

const FARM_LOCATION_STORAGE_KEY = "climateguardFarmLocation";

async function readApiResponse(response) {
    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
        throw new Error(data.error || `Request failed with HTTP ${response.status}.`);
    }
    return data;
}

function formatPlace(location) {
    return [location.name, location.admin1, location.country].filter(Boolean).join(", ");
}

function getClimateReportLanguage() {
    return Object.prototype.hasOwnProperty.call(CLIMATE_REPORT_TEXT, reportLanguage.value)
        ? reportLanguage.value
        : "en";
}

function getClimateReportWeather(weatherCode, language) {
    const code = Number(weatherCode);
    if (!Number.isFinite(code)) return CLIMATE_REPORT_WEATHER_TYPES[language].unknown;
    let type = "unknown";
    if (code === 0 || code === 1) type = "clear";
    else if (code === 2) type = "partlyCloudy";
    else if (code === 3) type = "cloudy";
    else if (code === 45 || code === 48) type = "fog";
    else if (code >= 51 && code <= 57) type = "drizzle";
    else if (code >= 61 && code <= 67) type = "rain";
    else if (code >= 71 && code <= 77) type = "snow";
    else if (code >= 80 && code <= 82) type = "showers";
    else if (code === 85 || code === 86) type = "snowShowers";
    else if (code === 95 || code === 96 || code === 99) type = "storm";
    return CLIMATE_REPORT_WEATHER_TYPES[language][type];
}

function renderClimateReport() {
    const language = getClimateReportLanguage();
    const text = CLIMATE_REPORT_TEXT[language];
    const canSpeak = "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
    const reportTitle = document.getElementById("climateReportTitle");
    const languageLabel = document.getElementById("reportLanguageLabel");

    reportTitle.textContent = text.title;
    languageLabel.textContent = text.language;
    playReportButton.textContent = text.play;
    pauseReportButton.textContent =
        reportIsPaused ? text.resume : text.pause;
    stopReportButton.textContent = text.stop;
    climateReportText.textContent = climateReportData
        ? text.summary({
            ...climateReportData,
            crop: CLIMATE_REPORT_CROP_NAMES[language][climateReportData.crop] || climateReportData.crop,
            soil: CLIMATE_REPORT_SOIL_NAMES[language][climateReportData.soil] || climateReportData.soil,
            weather: getClimateReportWeather(climateReportData.weatherCode, language),
            drought: text.categories[climateReportData.drought],
            rain: text.categories[climateReportData.rain],
            overall: text.categories[climateReportData.overall]
        })
        : text.pending;
    playReportButton.disabled = !canSpeak || !climateReportData;
    pauseReportButton.disabled = !canSpeak || !window.speechSynthesis || !window.speechSynthesis.speaking;
    stopReportButton.disabled = !canSpeak || !window.speechSynthesis || !window.speechSynthesis.speaking;

    if (!canSpeak) {
        reportVoiceStatus.textContent = text.voiceUnsupported;
    }
}

function findReportVoice(language) {
    const voices = window.speechSynthesis.getVoices();
    const locale = CLIMATE_REPORT_TEXT[language].locale.toLowerCase();
    return voices.find((voice) => voice.lang.toLowerCase() === locale) ||
        voices.find((voice) => voice.lang.toLowerCase().startsWith(`${language}-`)) ||
        (language === "en" ? voices.find((voice) => voice.default) || null : null);
}

function waitForReportVoice(language) {
    const synthesis = window.speechSynthesis;
    const initialVoice = findReportVoice(language);
    if (initialVoice || language === "en" || synthesis.getVoices().length) {
        return Promise.resolve(initialVoice);
    }

    return new Promise((resolve) => {
        const finish = (voice) => {
            window.clearTimeout(timeout);
            synthesis.removeEventListener("voiceschanged", onVoicesChanged);
            resolve(voice);
        };
        const onVoicesChanged = () => {
            const voice = findReportVoice(language);
            if (voice) finish(voice);
        };
        const timeout = window.setTimeout(() => finish(findReportVoice(language)), 1500);
        synthesis.addEventListener("voiceschanged", onVoicesChanged);
    });
}

async function playClimateReport() {
    const language = getClimateReportLanguage();
    const text = CLIMATE_REPORT_TEXT[language];
    if (!climateReportData) return;
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        reportVoiceStatus.textContent = text.voiceUnsupported;
        return;
    }

    const requestId = ++speechRequestId;
    window.speechSynthesis.cancel();
    currentUtterance = null;
    reportIsPaused = false;
    const voice = await waitForReportVoice(language);
    if (requestId !== speechRequestId || language !== getClimateReportLanguage()) return;
    if (language !== "en" && !voice) {
        reportVoiceStatus.textContent = text.noVoice;
        return;
    }

    const utterance = new SpeechSynthesisUtterance(climateReportText.textContent);
    utterance.lang = text.locale;
    if (voice) utterance.voice = voice;
    currentUtterance = utterance;
    utterance.onstart = () => {
        if (currentUtterance !== utterance) return;
        reportVoiceStatus.textContent = text.voicePlaying;
        renderClimateReport();
    };
    utterance.onend = () => {
        if (currentUtterance !== utterance) return;
        currentUtterance = null;
        reportIsPaused = false;
        renderClimateReport();
        reportVoiceStatus.textContent = "";
    };
    utterance.onerror = (event) => {
        if (currentUtterance !== utterance) return;
        currentUtterance = null;
        reportIsPaused = false;
        renderClimateReport();
        reportVoiceStatus.textContent = event.error === "canceled" ? "" : text.voiceError;
    };

    try {
        window.speechSynthesis.speak(utterance);
        reportVoiceStatus.textContent = text.voicePlaying;
        renderClimateReport();
    } catch (error) {
        currentUtterance = null;
        renderClimateReport();
        reportVoiceStatus.textContent = text.voiceError;
    }
}

function stopClimateReport(showStatus = true) {
    speechRequestId += 1;
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    reportIsPaused = false;
    renderClimateReport();
    if (showStatus && climateReportData) {
        reportVoiceStatus.textContent = CLIMATE_REPORT_TEXT[getClimateReportLanguage()].voiceStopped;
    }
}

function formatCoordinates(latitude, longitude) {
    return `Latitude ${latitude.toFixed(5)} · Longitude ${longitude.toFixed(5)}`;
}

function persistFarmLocation() {
    try {
        localStorage.setItem(FARM_LOCATION_STORAGE_KEY, JSON.stringify(selectedFarmLocation));
        return true;
    } catch (error) {
        console.error("Could not save the selected farm location:", error);
        farmMapFeedback.textContent = "The farm location is selected, but this browser could not save it. Check its storage settings.";
        return false;
    }
}

function readSavedFarmLocation() {
    try {
        const savedLocation = localStorage.getItem(FARM_LOCATION_STORAGE_KEY);
        if (!savedLocation) return null;

        const location = JSON.parse(savedLocation);
        if (!location || typeof location !== "object" || Array.isArray(location)) {
            throw new Error("The saved farm location is not a valid object.");
        }
        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);
        if (
            !location ||
            typeof location.name !== "string" ||
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90 ||
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            throw new Error("The saved coordinates are invalid.");
        }

        return { ...location, latitude, longitude };
    } catch (error) {
        console.error("Could not load the saved farm location:", error);
        farmMapFeedback.textContent = `A saved farm location could not be loaded: ${error.message}`;
        return null;
    }
}

function updateFarmLocation(location, options = {}) {
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        farmMapFeedback.textContent = "The selected location has invalid coordinates.";
        return false;
    }

    selectedFarmLocation = {
        name: location.name || "Selected farm location",
        admin1: location.admin1 || "",
        country: location.country || "",
        latitude,
        longitude,
        confirmed: options.confirmed === true
    };
    if (!farmMap) {
        initializeFarmMap(selectedFarmLocation);
    }

    locationSearchInput.value = formatPlace(selectedFarmLocation);
    farmLocationInput.value = formatPlace(selectedFarmLocation);
    selectedLocationSummary.textContent = formatPlace(selectedFarmLocation);
    selectedLocationCoordinates.textContent = formatCoordinates(latitude, longitude);
    farmMapLocation.textContent = formatPlace(selectedFarmLocation);
    farmMapCoordinates.textContent = formatCoordinates(latitude, longitude);
    confirmFarmLocationButton.disabled = false;

    if (farmMap) {
        const markerPosition = [latitude, longitude];
        if (farmMarker) {
            farmMarker.setLatLng(markerPosition);
        } else {
            farmMarker = L.marker(markerPosition, {
                draggable: true,
                title: "Drag to select the exact farm location"
            }).addTo(farmMap);
            farmMarker.on("dragend", handleFarmMarkerDrag);
        }

        if (Number.isFinite(options.zoom)) {
            farmMap.setView(markerPosition, options.zoom);
        }
    } else {
        farmMapFeedback.textContent = "The map library is unavailable. The searched coordinates are shown but cannot be adjusted on a map.";
    }

    if (selectedFarmLocation.confirmed) {
        confirmedFarmLocation.textContent = `Confirmed farm location: ${formatPlace(selectedFarmLocation)} · ${formatCoordinates(latitude, longitude)}`;
        confirmedFarmLocation.hidden = false;
        farmMapFeedback.textContent = "Farm location confirmed.";
    } else {
        confirmedFarmLocation.textContent = "";
        confirmedFarmLocation.hidden = true;
        if (farmMap) {
            farmMapFeedback.textContent = "Drag the marker to refine the farm location, then confirm it.";
        }
    }

    return options.persist === false || persistFarmLocation();
}

function handleFarmMarkerDrag() {
    if (!farmMarker || !selectedFarmLocation) return;

    const position = farmMarker.getLatLng();
    const saved = updateFarmLocation(
        { ...selectedFarmLocation, latitude: position.lat, longitude: position.lng },
        { persist: true }
    );
    if (saved) {
        farmMapFeedback.textContent = "Farm coordinates updated and saved. Refreshing weather for the selected farm location.";
    }
    void loadWeather(selectedFarmLocation);
}

function initializeFarmMap(location) {
    if (typeof L === "undefined") {
        farmMapElement.textContent = "The map is unavailable.";
        farmMapFeedback.textContent = "The map could not load. Location search and weather features remain available.";
        return false;
    }

    if (!location) {
        farmMapElement.textContent = "Search for a location to show its map.";
        farmMapFeedback.textContent = "Search for a location to place the farm marker.";
        return false;
    }

    farmMapElement.replaceChildren();
    farmMap = L.map(farmMapElement, { zoomControl: true }).setView(
        [location.latitude, location.longitude],
        13
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(farmMap);

    return true;
}

function clearCurrentFarmLocation() {
    selectedFarmLocation = null;
    farmMarker = null;
    if (farmMap) {
        farmMap.stop();
        farmMap.remove();
        farmMap = null;
    }
    farmMapElement.textContent = "Search for a location to show its map.";
    farmMapLocation.textContent = "No farm location selected";
    farmMapCoordinates.textContent = "Latitude — · Longitude —";
    farmMapFeedback.textContent = "Search for a location to place the farm marker.";
    confirmedFarmLocation.textContent = "";
    confirmedFarmLocation.hidden = true;
    confirmFarmLocationButton.disabled = true;
    selectedLocationSummary.textContent = "No location selected";
    selectedLocationCoordinates.textContent = "Latitude — · Longitude —";
    farmLocationInput.value = "";
}

function resetRiskResults(message) {
    climateReportData = null;
    speechRequestId += 1;
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    reportIsPaused = false;
    reportVoiceStatus.textContent = "";
    renderClimateReport();
    document.getElementById("droughtScore").textContent = "—";
    document.getElementById("droughtCategory").textContent = "Not analysed";
    document.getElementById("droughtCategory").className = "risk-badge";
    document.getElementById("droughtBar").style.width = "0%";
    document.getElementById("droughtFactors").textContent = message;
    document.getElementById("rainfallScore").textContent = "—";
    document.getElementById("rainfallCategory").textContent = "Not analysed";
    document.getElementById("rainfallCategory").className = "risk-badge";
    document.getElementById("rainfallBar").style.width = "0%";
    document.getElementById("rainfallFactors").textContent = message;
    document.getElementById("overallCategory").textContent = "—";
    document.getElementById("farmSummary").textContent = "Selected crop, soil and soil moisture will be shown after analysis.";
    document.getElementById("cropInfluence").textContent = "Crop-specific water and heat-demand factors will be explained after analysis.";
    document.getElementById("soilInfluence").textContent = "Soil retention and drainage factors will be explained after analysis.";
    document.getElementById("weatherInfluence").textContent = "Weather factors use only the selected location's loaded forecast.";
    document.getElementById("overallFactors").textContent = "Overall risk is the higher of the drought and heavy-rainfall scores.";
    document.getElementById("riskFeedback").textContent = "";
}

function formatWeatherValue(value) {
    return Number.isFinite(value) ? value.toFixed(1) : "—";
}

function renderWeatherSnapshot(weatherData, status) {
    const temperature = document.getElementById("currentTemperature");
    const humidity = document.getElementById("currentHumidity");
    const precipitation = document.getElementById("currentPrecipitation");
    const description = document.getElementById("currentWeatherDescription");

    document.getElementById("weatherSummaryStatus").textContent = status;

    if (!weatherData || !weatherData.current) {
        temperature.textContent = "—";
        humidity.textContent = "—";
        precipitation.textContent = "—";
        description.textContent = "Current conditions";
        return;
    }

    temperature.textContent = formatWeatherValue(weatherData.current.temperatureC);
    humidity.textContent = formatWeatherValue(weatherData.current.relativeHumidityPercent);
    precipitation.textContent = formatWeatherValue(weatherData.current.precipitationMm);
    description.textContent = weatherData.current.weatherDescription || "Current conditions";
}

function clearWeather() {
    selectedWeatherData = null;
    renderWeatherSnapshot(null, "Search for a location to load its weather.");
    resetRiskResults("Choose a location with an available forecast, then run an analysis.");
}

async function loadWeather(location) {
    const requestId = ++weatherRequestId;
    selectedWeatherData = null;
    resetRiskResults("Waiting for the selected location's weather forecast.");
    const placeName = formatPlace(location);
    locationSearchInput.value = placeName;
    farmLocationInput.value = placeName;
    locationFeedback.textContent = `Loading weather for ${placeName}...`;
    renderWeatherSnapshot(null, `Loading weather for ${placeName}...`);

    try {
        const params = new URLSearchParams({
            latitude: String(location.latitude),
            longitude: String(location.longitude)
        });
        const response = await fetch(`/api/weather?${params.toString()}`);
        const data = await readApiResponse(response);
        if (requestId !== weatherRequestId) return;

        selectedWeatherData = data;
        renderWeatherSnapshot(data, `Weather loaded for ${placeName}.`);
        locationFeedback.textContent = `Weather loaded for ${placeName}.`;
    } catch (error) {
        if (requestId !== weatherRequestId) return;
        selectedWeatherData = null;
        renderWeatherSnapshot(null, error.message);
        resetRiskResults("Weather data is unavailable, so a climate-risk estimate cannot be calculated.");
        locationFeedback.textContent = error.message;
    }
}

locationSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = locationSearchInput.value.trim();

    if (!name) {
        locationFeedback.textContent = "Enter a village, district or city to continue.";
        locationSearchInput.focus();
        return;
    }

    locationSearchButton.disabled = true;
    locationCandidates.hidden = true;
    matchingLocations = [];
    locationFeedback.textContent = "Searching for matching locations...";
    weatherRequestId += 1;
    clearWeather();
    clearCurrentFarmLocation();
    const requestId = ++locationSearchRequestId;

    try {
        const params = new URLSearchParams({ name });
        const response = await fetch(`/api/geocode?${params.toString()}`);
        const data = await readApiResponse(response);
        if (requestId !== locationSearchRequestId) return;
        matchingLocations = (Array.isArray(data.locations) ? data.locations : []).filter((location) =>
            typeof location.name === "string" &&
            typeof location.country === "string" &&
            Number.isFinite(location.latitude) &&
            Number.isFinite(location.longitude)
        );
        if (!matchingLocations.length) {
            throw new Error(`No matching locations found for "${name}".`);
        }

        locationCandidates.replaceChildren();
        matchingLocations.forEach((location, index) => {
            const option = document.createElement("option");
            option.value = String(index);
            option.textContent = formatPlace(location);
            locationCandidates.append(option);
        });
        locationCandidates.hidden = matchingLocations.length < 2;
        farmFeedback.textContent = "";
        await selectLocation(0);
    } catch (error) {
        if (requestId !== locationSearchRequestId) return;
        locationFeedback.textContent = error.message;
        clearWeather();
    } finally {
        if (requestId === locationSearchRequestId) {
            locationSearchButton.disabled = false;
        }
    }
});

async function selectLocation(index) {
    const location = matchingLocations[index];
    if (!location) return;

    const placeName = formatPlace(location);
    farmLocationInput.value = placeName;
    updateFarmLocation(location, { zoom: 13 });
    await loadWeather(location);
}

locationCandidates.addEventListener("change", () => {
    selectLocation(Number(locationCandidates.value));
});

confirmFarmLocationButton.addEventListener("click", () => {
    if (!selectedFarmLocation) {
        farmMapFeedback.textContent = "Search for a location before confirming the farm location.";
        return;
    }

    const saved = updateFarmLocation(selectedFarmLocation, { confirmed: true, persist: true });
    if (saved && selectedFarmLocation.confirmed) {
        farmMapFeedback.textContent = "Farm location confirmed and saved for future use.";
    } else if (selectedFarmLocation.confirmed) {
        farmMapFeedback.textContent = "Farm location confirmed for this session, but could not be saved in this browser.";
    }
});

function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}

function getRiskCategory(score) {
    if (score <= 33) return "Low";
    if (score <= 66) return "Moderate";
    return "High";
}

function displayRisk(scoreId, categoryId, barId, score, category) {
    document.getElementById(scoreId).textContent = `${score}/100`;
    const categoryElement = document.getElementById(categoryId);
    categoryElement.textContent = category;
    categoryElement.className = `risk-badge badge-${category.toLowerCase()}`;
    const bar = document.getElementById(barId);
    bar.style.width = `${score}%`;
    bar.style.backgroundColor = category === "High" ? "#d77d75" : category === "Moderate" ? "#e9bd73" : "#8ba6bd";
}

function calculateClimateScores(crop, soil, soilMoisture, forecast) {
    // Preserve the existing FAO-56 crop factors and prototype soil/weather risk rules.
    const rainfallTotalMm = forecast.reduce((total, day) => total + day.precipitationMm, 0);
    const highestDailyRainMm = Math.max(...forecast.map((day) => day.precipitationMm));
    const averageDailyHighC = forecast.reduce((total, day) => total + day.temperatureMaxC, 0) / forecast.length;

    const depletionFraction = clamp((1 - soilMoisture / 100) / soil.waterRetentionRatio, 0, 1);
    const allowableDepletion = clamp(
        crop.depletionBeforeStress + soil.depletionAdjustment,
        0.1,
        0.8
    );
    const soilMoistureStress = clamp(
        ((depletionFraction - allowableDepletion) / (1 - allowableDepletion)) * 100,
        0,
        100
    );

    const forecastRainfallDeficit = clamp(((20 - rainfallTotalMm) / 20) * 100, 0, 100);
    const baseTemperatureStress = clamp(((averageDailyHighC - 30) / 10) * 100, 0, 100);
    const cropDemandFactor = crop.kcMid / 1.15;
    const cropAdjustedRainfallDeficit = clamp(forecastRainfallDeficit * cropDemandFactor, 0, 100);
    const cropAdjustedTemperatureStress = clamp(baseTemperatureStress * cropDemandFactor, 0, 100);
    const droughtScore = Math.round(clamp(
        soilMoistureStress * 0.4 +
        cropAdjustedRainfallDeficit * 0.3 +
        cropAdjustedTemperatureStress * 0.3,
        0,
        100
    ));

    const rainfallIntensity = clamp(((highestDailyRainMm - 20) / 30) * 100, 0, 100);
    const soilSaturation = clamp(((soilMoisture - 60) / 40) * 100, 0, 100);
    const soilDrainageRisk = (1 - soil.drainageFactor) * rainfallIntensity;
    const soilResponse = soilSaturation * 0.5 + soilDrainageRisk * 0.5;
    const heavyRainfallScore = Math.round(clamp(
        rainfallIntensity * 0.7 + soilResponse * 0.3,
        0,
        100
    ));

    return {
        rainfallTotalMm,
        highestDailyRainMm,
        averageDailyHighC,
        depletionFraction,
        allowableDepletion,
        soilMoistureStress,
        cropDemandFactor,
        cropAdjustedRainfallDeficit,
        cropAdjustedTemperatureStress,
        rainfallIntensity,
        soilSaturation,
        soilDrainageRisk,
        droughtScore,
        heavyRainfallScore,
        droughtCategory: getRiskCategory(droughtScore),
        heavyRainfallCategory: getRiskCategory(heavyRainfallScore),
        overallCategory: getRiskCategory(Math.max(droughtScore, heavyRainfallScore))
    };
}

function analyzeClimateRisk() {
    if (!selectedWeatherData || !Array.isArray(selectedWeatherData.forecast) || selectedWeatherData.forecast.length !== 7) {
        throw new Error("Load weather for a location with a complete 7-day forecast before analysing climate risk.");
    }

    const forecast = selectedWeatherData.forecast;
    const validForecast = forecast.every((day) =>
        day &&
        Number.isFinite(day.precipitationMm) &&
        day.precipitationMm >= 0 &&
        Number.isFinite(day.temperatureMaxC)
    );
    if (!validForecast) {
        throw new Error("The selected location's forecast is missing rainfall or temperature data required for this analysis.");
    }

    const soilMoisture = Number(soilMoistureInput.value);
    if (!Number.isFinite(soilMoisture) || soilMoisture < 0 || soilMoisture > 100) {
        throw new Error("Enter soil moisture as a number from 0 to 100 percent.");
    }
    if (
        !selectedFarmLocation ||
        !selectedWeatherData.current ||
        !Number.isFinite(selectedWeatherData.current.temperatureC) ||
        !Number.isFinite(selectedWeatherData.current.relativeHumidityPercent) ||
        !Number.isFinite(selectedWeatherData.current.precipitationMm) ||
        !Number.isFinite(selectedWeatherData.current.weatherCode)
    ) {
        throw new Error("Current location weather is incomplete. Search for the location again before analysing.");
    }

    const cropName = document.getElementById("cropType").value;
    const soilName = document.getElementById("soilType").value;
    const crop = CROP_FACTORS[cropName];
    const soil = SOIL_FACTORS[soilName];
    if (!crop || !soil) {
        throw new Error("Select a supported crop and soil type before analysing climate risk.");
    }

    const risk = calculateClimateScores(crop, soil, soilMoisture, forecast);
    const {
        rainfallTotalMm,
        highestDailyRainMm,
        averageDailyHighC,
        depletionFraction,
        allowableDepletion,
        soilMoistureStress,
        cropDemandFactor,
        cropAdjustedRainfallDeficit,
        cropAdjustedTemperatureStress,
        rainfallIntensity,
        soilSaturation,
        soilDrainageRisk,
        droughtScore,
        droughtCategory,
        heavyRainfallScore,
        heavyRainfallCategory,
        overallCategory
    } = risk;

    displayRisk("droughtScore", "droughtCategory", "droughtBar", droughtScore, droughtCategory);
    displayRisk("rainfallScore", "rainfallCategory", "rainfallBar", heavyRainfallScore, heavyRainfallCategory);
    document.getElementById("overallCategory").textContent = overallCategory;
    document.getElementById("farmSummary").textContent =
        `Location: ${formatPlace(selectedFarmLocation)} · Crop: ${cropName} · Soil: ${soilName} · Entered soil moisture: ${soilMoisture}%`;
    document.getElementById("droughtFactors").textContent =
        `40% crop/soil-adjusted moisture stress (${Math.round(soilMoistureStress)}%; effective depletion ${Math.round(depletionFraction * 100)}%, stress threshold ${(allowableDepletion * 100).toFixed(0)}%), 30% crop-adjusted rainfall deficit (${Math.round(cropAdjustedRainfallDeficit)}%), and 30% crop-adjusted heat stress (${Math.round(cropAdjustedTemperatureStress)}%).`;
    document.getElementById("rainfallFactors").textContent =
        `70% forecast intensity (${Math.round(rainfallIntensity)}%; highest day ${highestDailyRainMm.toFixed(1)} mm, scaled from 20–50 mm/day), 15% soil saturation (${Math.round(soilSaturation)}%), and 15% drainage risk under forecast rain (${Math.round(soilDrainageRisk)}%).`;
    document.getElementById("cropInfluence").textContent =
        `${cropName}: FAO-56 p=${crop.depletionBeforeStress.toFixed(2)} allowable depletion before stress; Kc mid=${crop.kcMid.toFixed(3)} gives a ${cropDemandFactor.toFixed(2)}x water/heat-demand factor versus Kc 1.15. Lower p raises drought sensitivity; Kc scales forecast-rain and heat-driven demand.`;
    document.getElementById("soilInfluence").textContent =
        `${soilName}: relative water-retention ratio ${soil.waterRetentionRatio.toFixed(2)}; texture shifts allowable depletion by ${(soil.depletionAdjustment * 100).toFixed(0)} percentage points; ${soil.drainageLabel} drainage factor ${soil.drainageFactor.toFixed(2)} affects heavy-rain risk.`;
    document.getElementById("weatherInfluence").textContent =
        `Actual 7-day forecast: ${rainfallTotalMm.toFixed(1)} mm total rain, ${highestDailyRainMm.toFixed(1)} mm highest daily rain, and ${averageDailyHighC.toFixed(1)} °C average daily high. Entered moisture is ${soilMoisture}%.`;
    document.getElementById("overallFactors").textContent =
        `${overallCategory} reflects the higher of the drought and heavy-rainfall scores. All crop and soil factors are prototype inputs, not locally calibrated measurements or yield predictions.`;
    document.getElementById("riskFeedback").textContent =
        "Prototype estimate only; not a scientifically validated agricultural prediction or a crop-yield forecast.";
    climateReportData = {
        location: formatPlace(selectedFarmLocation),
        crop: cropName,
        soil: soilName,
        moisture: formatWeatherValue(soilMoisture),
        weatherCode: selectedWeatherData.current.weatherCode,
        temperature: formatWeatherValue(selectedWeatherData.current.temperatureC),
        humidity: formatWeatherValue(selectedWeatherData.current.relativeHumidityPercent),
        precipitation: formatWeatherValue(selectedWeatherData.current.precipitationMm),
        drought: droughtCategory,
        droughtScore,
        rain: heavyRainfallCategory,
        rainScore: heavyRainfallScore,
        overall: overallCategory
    };
    reportVoiceStatus.textContent = "";
    renderClimateReport();
}

farmForm.addEventListener("submit", (event) => {
    event.preventDefault();
    farmFeedback.textContent = "";
    locationFeedback.textContent = "";
    try {
        analyzeClimateRisk();
    } catch (error) {
        resetRiskResults(error.message);
        document.getElementById("riskFeedback").textContent = error.message;
    }
});

farmForm.addEventListener("input", () => {
    resetRiskResults("Farm inputs changed. Run the analysis again to update the estimates.");
});

farmForm.addEventListener("change", () => {
    resetRiskResults("Farm inputs changed. Run the analysis again to update the estimates.");
});

reportLanguage.addEventListener("change", () => {
    speechRequestId += 1;
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    reportIsPaused = false;
    reportVoiceStatus.textContent = "";
    renderClimateReport();
});

playReportButton.addEventListener("click", () => {
    void playClimateReport();
});

pauseReportButton.addEventListener("click", () => {
    if (!("speechSynthesis" in window) || !window.speechSynthesis.speaking) return;
    const text = CLIMATE_REPORT_TEXT[getClimateReportLanguage()];
    if (reportIsPaused) {
        window.speechSynthesis.resume();
        reportIsPaused = false;
        reportVoiceStatus.textContent = text.voicePlaying;
    } else {
        window.speechSynthesis.pause();
        reportIsPaused = true;
        reportVoiceStatus.textContent = text.voicePaused;
    }
    renderClimateReport();
});

stopReportButton.addEventListener("click", () => {
    stopClimateReport();
});

const savedFarmLocation = readSavedFarmLocation();
if (savedFarmLocation && initializeFarmMap(savedFarmLocation)) {
    updateFarmLocation(savedFarmLocation, {
        confirmed: savedFarmLocation.confirmed === true,
        persist: false,
        zoom: 12
    });
    void loadWeather(savedFarmLocation);
} else {
    initializeFarmMap(null);
}
renderClimateReport();


async function connectBackend() {
    const button = document.getElementById("connectionButton");
    const label = document.getElementById("connectionLabel");

    button.disabled = true;
    button.classList.remove("is-connected", "is-error");
    label.textContent = "Connecting...";

    try {
        const response = await fetch("/api/health");
        if (!response.ok) {
            throw new Error(`Health check failed with HTTP ${response.status}`);
        }

        const data = await response.json();
        if (typeof data.message !== "string" || !data.message) {
            throw new Error("Health check response did not include a message.");
        }

        button.classList.add("is-connected");
        label.textContent = "Backend connected";
        console.info(data.message);
    } catch (error) {
        button.classList.add("is-error");
        label.textContent = "Connection failed";
        console.error("Backend health check failed:", error);
    } finally {
        button.disabled = false;
    }
}
