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
const farmMapLocation = document.getElementById("farmMapLocation");
const farmMapFeedback = document.getElementById("farmMapFeedback");
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
        noVoice: "Voice playback for this language is unavailable on this device. You can still read the translated report.",
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
        noVoice: "Voice playback for this language is unavailable on this device. You can still read the translated report.",
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

const SUITABILITY_REPORT_TEXT = {
    en: {
        Suitable: "Suitable", Moderately: "Moderately Suitable", Unsuitable: "Not Suitable",
        heading: "Crop and soil suitability",
        advisory: "Advisory estimate; not a substitute for soil testing or professional agricultural advice.",
        details: (data) => `Crop: ${data.crop}. Soil: ${data.soil}. Soil moisture: ${data.moisture} percent. The crop result is ${data.category}. Forecast: ${data.rainTotal} millimetres across seven days, average maximum temperature ${data.avgMax} degrees Celsius. ${data.recommendation}`
    },
    te: {
        Suitable: "అనుకూలం", Moderately: "మధ్యస్థంగా అనుకూలం", Unsuitable: "అనుకూలం కాదు",
        heading: "పంట మరియు నేల అనుకూలత",
        advisory: "ఇది సూచనాత్మక అంచనా మాత్రమే; ప్రొఫెషనల్ సలహా లేదా ల్యాబ్ నేల పరీక్షలకు ప్రత్యామ్నాయం కాదు.",
        details: (data) => `పంట: ${data.crop}. నేల: ${data.soil}. నేల తేమ: ${data.moisture} శాతం. పంట ఫలితం ${data.category}. ఏడురోజుల సూచన: మొత్తం వర్షపాతం ${data.rainTotal} మిల్లీమీటర్లు, సగటు గరిష్ట ఉష్ణోగ్రత ${data.avgMax} డిగ్రీల సెల్సియస్. ${data.recommendation}`
    },
    hi: {
        Suitable: "उपयुक्त", Moderately: "मध्यम रूप से उपयुक्त", Unsuitable: "उपयुक्त नहीं",
        heading: "फसल और मिट्टी की उपयुक्तता",
        advisory: "यह सलाहकारी अनुमान है; मिट्टी परीक्षण या पेशेवर कृषि सलाह का विकल्प नहीं है।",
        details: (data) => `फसल: ${data.crop}। मिट्टी: ${data.soil}। मिट्टी की नमी: ${data.moisture} प्रतिशत। फसल का परिणाम ${data.category} है। सात दिवसीय पूर्वानुमान: कुल वर्षा ${data.rainTotal} मिलीमीटर, औसत अधिकतम तापमान ${data.avgMax} डिग्री सेल्सियस। ${data.recommendation}`
    },
    kn: {
        Suitable: "ಅನುಕೂಲ", Moderately: "ಮಧ್ಯಮ ಅನುಕೂಲ", Unsuitable: "ಅನುಕೂಲವಲ್ಲ",
        heading: "ಬೆಳೆ ಮತ್ತು ಮಣ್ಣಿನ ಅನುಕೂಲತೆ",
        advisory: "ಇದು ಸಲಹಾತ್ಮಕ ಅಂದಾಜು ಮಾತ್ರ; ಮಣ್ಣು ಪರೀಕ್ಷೆ ಅಥವಾ ವೃತ್ತಿಪರ ಕೃಷಿ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.",
        details: (data) => `ಬೆಳೆ: ${data.crop}. ಮಣ್ಣು: ${data.soil}. ಮಣ್ಣಿನ ತೇವಾಂಶ: ${data.moisture} ಶೇಕಡಾ. ಬೆಳೆ ಫಲಿತಾಂಶ ${data.category}. ಏಳು ದಿನಗಳ ಮುನ್ಸೂಚನೆ: ಒಟ್ಟು ಮಳೆ ${data.rainTotal} ಮಿಲಿಮೀಟರ್, ಸರಾಸರಿ ಗರಿಷ್ಠ ತಾಪಮಾನ ${data.avgMax} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್. ${data.recommendation}`
    }
};

const REPORT_FULL_TEXT = {
    en: {
        noVoice: "No compatible English speech voice is installed. Enable or install an English text-to-speech voice in your operating system's language or speech settings, then reload this page. The translated report remains visible.",
        voicePlaying: (name) => `Reading the report with ${name}...`,
        summary: (d) => `Selected location: ${d.location}. Crop: ${d.crop}. Soil: ${d.soil}. Entered soil moisture: ${d.moisture} percent. Current weather: ${d.weather}; ${d.temperature} degrees Celsius, ${d.humidity} percent relative humidity, and ${d.precipitation} millimeters precipitation. Drought risk: ${d.drought}, ${d.droughtScore} out of 100. Heavy rainfall risk: ${d.rain}, ${d.rainScore} out of 100. Overall climate risk: ${d.overall}, ${d.overallScore} out of 100. These are prototype estimates, not a crop-yield prediction.`,
        soilHeading: "Soil suitability",
        moistureHeading: "Moisture suitability",
        weatherHeading: "Weather suitability",
        advisory: "Advisory estimate; not a substitute for soil testing or professional agricultural advice.",
        soil: {
            preferred: (d) => `${d.soil} is generally a preferred texture for ${d.crop}.`,
            acceptable: (d) => `${d.soil} may be acceptable for ${d.crop}, though drainage or water retention may need management.`,
            other: (d) => `${d.soil} is not among the usual preferred soil textures for ${d.crop}; extra drainage or water-retention management may be needed.`
        },
        moisture: {
            suitable: (d) => `The entered ${d.moisture}% moisture is in an approximate suitable range for ${d.crop}.`,
            moderate: (d) => `The entered ${d.moisture}% moisture is moderate and may become stressful without timely water management for ${d.crop}.`,
            low: (d) => `The entered ${d.moisture}% moisture is low for ${d.crop}; irrigation may be considered if the crop is established.`,
            excessive: (d) => `The entered ${d.moisture}% moisture is excessive for ${d.crop}; drainage and avoiding further irrigation should be considered.`
        },
        weather: {
            severe: (d) => `Actual seven-day forecast: ${d.rainTotal} mm rain, ${d.rainDays} rain days, highest daily rain ${d.maxDailyRain} mm, and average forecast high ${d.avgMax} °C. Excessive heat or rainfall creates a significant weather risk.`,
            mixed: (d) => `Actual seven-day forecast: ${d.rainTotal} mm rain, ${d.rainDays} rain days, highest daily rain ${d.maxDailyRain} mm, and average forecast high ${d.avgMax} °C. Weather is mixed and may require monitoring.`,
            compatible: (d) => `Actual seven-day forecast: ${d.rainTotal} mm rain, ${d.rainDays} rain days, highest daily rain ${d.maxDailyRain} mm, and average forecast high ${d.avgMax} °C. The upcoming weather is generally compatible with approximate crop requirements.`
        },
        recommendationsHeading: "Farmer recommendations",
        recommendations: {
            irrigation: "Consider irrigation based on crop stage and local evapotranspiration; verify moisture with an on-farm check.",
            drainage: "Avoid unnecessary irrigation and consider drainage to reduce waterlogging risk.",
            heavyRain: "Prepare field drainage and protect vulnerable seedlings or recently treated areas.",
            heat: "Consider mulching, timely watering and heat protection during the hottest part of the day.",
            lowRain: "A low-rainfall forecast suggests monitoring drought stress and planning available water.",
            slowSoil: "For slow-draining soil, avoid over-irrigation and maintain field drainage.",
            fastSoil: "Light, frequent irrigation may reduce rapid drainage losses; this is an approximate advisory.",
            routine: "Continue routine crop monitoring and adjust management to local field observations."
        }
    },
    te: {
        noVoice: "Voice playback for this language is unavailable on this device. You can still read the translated report.",
        voicePlaying: (name) => `${name} స్వరంతో నివేదిక చదువుతోంది...`,
        summary: (d) => `ఎంచుకున్న ప్రదేశం: ${d.location}. పంట: ${d.crop}. నేల రకం: ${d.soil}. నమోదు చేసిన నేల తేమ ${d.moisture} శాతం. ప్రస్తుత వాతావరణం: ${d.weather}; ఉష్ణోగ్రత ${d.temperature} డిగ్రీల సెల్సియస్, సాపేక్ష ఆర్ద్రత ${d.humidity} శాతం, వర్షపాతం ${d.precipitation} మిల్లీమీటర్లు. కరువు ప్రమాదం: ${d.drought}, 100లో ${d.droughtScore}. భారీ వర్షపాతం ప్రమాదం: ${d.rain}, 100లో ${d.rainScore}. మొత్తం వాతావరణ ప్రమాదం: ${d.overall}, 100లో ${d.overallScore}. ఇవి నమూనా అంచనాలు మాత్రమే; పంట దిగుబడి అంచనా కాదు.`,
        soilHeading: "నేల అనుకూలత",
        moistureHeading: "తేమ అనుకూలత",
        weatherHeading: "వాతావరణ అనుకూలత",
        recommendationsHeading: "రైతులకు సూచనలు",
        advisory: "ఇది సూచనాత్మక అంచనా మాత్రమే; నేల పరీక్ష లేదా వ్యవసాయ నిపుణుల సలహాకు ప్రత్యామ్నాయం కాదు.",
        soil: {
            preferred: (d) => `${d.crop} పంటకు ${d.soil} నేల సాధారణంగా అనుకూలమైనది.`,
            acceptable: (d) => `${d.crop} పంటకు ${d.soil} నేల సరిపోవచ్చు; అయితే నీటి పారుదల లేదా తేమ నిల్వను నిర్వహించాలి.`,
            other: (d) => `${d.crop} పంటకు సాధారణంగా ప్రాధాన్యత ఇచ్చే నేలల్లో ${d.soil} లేదు; అదనపు నీటి పారుదల లేదా తేమ నిల్వ నిర్వహణ అవసరమవవచ్చు.`
        },
        moisture: {
            suitable: (d) => `నమోదు చేసిన ${d.moisture}% తేమ ${d.crop} పంటకు సుమారుగా అనుకూలమైన పరిధిలో ఉంది.`,
            moderate: (d) => `నమోదు చేసిన ${d.moisture}% తేమ మధ్యస్థంగా ఉంది; సమయానికి నీటి నిర్వహణ లేకపోతే ${d.crop} పంటకు ఒత్తిడి కలగవచ్చు.`,
            low: (d) => `నమోదు చేసిన ${d.moisture}% తేమ ${d.crop} పంటకు తక్కువగా ఉంది; పంట స్థాపించబడినట్లయితే నీటిపారుదలను పరిశీలించండి.`,
            excessive: (d) => `నమోదు చేసిన ${d.moisture}% తేమ ${d.crop} పంటకు అధికంగా ఉంది; నీటి పారుదలను మెరుగుపరచి అదనపు నీటిపారుదలను నివారించండి.`
        },
        weather: {
            severe: (d) => `వాస్తవ ఏడు రోజుల అంచనా: మొత్తం వర్షం ${d.rainTotal} మి.మీ., వర్షపు రోజులు ${d.rainDays}, రోజులో గరిష్ఠ వర్షం ${d.maxDailyRain} మి.మీ., సగటు గరిష్ఠ ఉష్ణోగ్రత ${d.avgMax} °C. అధిక వేడి లేదా వర్షం గణనీయమైన వాతావరణ ప్రమాదాన్ని కలిగిస్తుంది.`,
            mixed: (d) => `వాస్తవ ఏడు రోజుల అంచనా: మొత్తం వర్షం ${d.rainTotal} మి.మీ., వర్షపు రోజులు ${d.rainDays}, రోజులో గరిష్ఠ వర్షం ${d.maxDailyRain} మి.మీ., సగటు గరిష్ఠ ఉష్ణోగ్రత ${d.avgMax} °C. వాతావరణ పరిస్థితులు మిశ్రమంగా ఉన్నాయి; పర్యవేక్షణ అవసరం.`,
            compatible: (d) => `వాస్తవ ఏడు రోజుల అంచనా: మొత్తం వర్షం ${d.rainTotal} మి.మీ., వర్షపు రోజులు ${d.rainDays}, రోజులో గరిష్ఠ వర్షం ${d.maxDailyRain} మి.మీ., సగటు గరిష్ఠ ఉష్ణోగ్రత ${d.avgMax} °C. రాబోయే వాతావరణం పంట అవసరాలకు సాధారణంగా సరిపోతుంది.`
        },
        recommendations: {
            irrigation: "పంట దశ మరియు స్థానిక ఆవిరి-విసర్జనను బట్టి నీటిపారుదలను పరిశీలించండి; పొలంలో తేమను తనిఖీ చేయండి.",
            drainage: "అవసరం లేని నీటిపారుదలను నివారించి, నీరు నిల్వ కాకుండా పారుదలను పరిశీలించండి.",
            heavyRain: "పొలంలో నీటి పారుదలను సిద్ధం చేసి, సున్నితమైన మొలకలను లేదా ఇటీవల మందు వేసిన ప్రాంతాలను రక్షించండి.",
            heat: "రోజులో అత్యధిక వేడి సమయంలో మల్చింగ్, సరైన సమయంలో నీరు మరియు వేడి రక్షణను పరిశీలించండి.",
            lowRain: "వర్షం తక్కువగా ఉండే అంచనా కరువు ఒత్తిడిని పర్యవేక్షించి, అందుబాటులోని నీటిని ప్రణాళిక చేయాలని సూచిస్తుంది.",
            slowSoil: "నెమ్మదిగా నీరు పీల్చే నేలలో అధిక నీటిపారుదలను నివారించి, పొలంలో పారుదలను నిర్వహించండి.",
            fastSoil: "తక్కువ పరిమాణంలో తరచుగా నీరు ఇవ్వడం వేగంగా నీరు బయటకు పోవడాన్ని తగ్గించవచ్చు; ఇది సుమారు సూచన మాత్రమే.",
            routine: "పంటను క్రమం తప్పకుండా పరిశీలించి, పొలంలోని పరిస్థితులకు అనుగుణంగా నిర్వహణను మార్చండి."
        }
    },
    hi: {
        noVoice: "इस ब्राउज़र में हिंदी (hi-IN) की आवाज़ उपलब्ध नहीं है। ऑपरेटिंग सिस्टम की भाषा या वाक् सेटिंग में हिंदी टेक्स्ट-टू-स्पीच आवाज़ स्थापित या सक्षम करें, फिर यह पृष्ठ दोबारा लोड करें। अनूदित रिपोर्ट दिखाई देती रहेगी।",
        voicePlaying: (name) => `${name} आवाज़ से रिपोर्ट पढ़ी जा रही है...`,
        summary: (d) => `चुना गया स्थान: ${d.location}। फसल: ${d.crop}। मिट्टी: ${d.soil}। दर्ज मिट्टी की नमी ${d.moisture} प्रतिशत है। वर्तमान मौसम: ${d.weather}; तापमान ${d.temperature} डिग्री सेल्सियस, सापेक्ष आर्द्रता ${d.humidity} प्रतिशत और वर्षा ${d.precipitation} मिलीमीटर। सूखे का जोखिम: ${d.drought}, 100 में से ${d.droughtScore}। भारी वर्षा का जोखिम: ${d.rain}, 100 में से ${d.rainScore}। कुल जलवायु जोखिम: ${d.overall}, 100 में से ${d.overallScore}। ये प्रारूप अनुमान हैं, फसल की उपज का अनुमान नहीं।`,
        soilHeading: "मिट्टी की उपयुक्तता",
        moistureHeading: "नमी की उपयुक्तता",
        weatherHeading: "मौसम की उपयुक्तता",
        recommendationsHeading: "किसानों के लिए सुझाव",
        advisory: "यह सलाहकारी अनुमान है; मिट्टी परीक्षण या कृषि विशेषज्ञ की सलाह का विकल्प नहीं है।",
        soil: {
            preferred: (d) => `${d.crop} के लिए ${d.soil} आम तौर पर पसंदीदा मिट्टी है।`,
            acceptable: (d) => `${d.crop} के लिए ${d.soil} स्वीकार्य हो सकती है, लेकिन जल-निकासी या नमी बनाए रखने का प्रबंधन आवश्यक हो सकता है।`,
            other: (d) => `${d.crop} के लिए आम तौर पर पसंदीदा मिट्टी में ${d.soil} शामिल नहीं है; अतिरिक्त जल-निकासी या नमी-संरक्षण प्रबंधन की जरूरत हो सकती है।`
        },
        moisture: {
            suitable: (d) => `दर्ज ${d.moisture}% नमी ${d.crop} के लिए अनुमानित उपयुक्त सीमा में है।`,
            moderate: (d) => `दर्ज ${d.moisture}% नमी मध्यम है; समय पर जल-प्रबंधन न होने पर ${d.crop} पर दबाव पड़ सकता है।`,
            low: (d) => `दर्ज ${d.moisture}% नमी ${d.crop} के लिए कम है; फसल स्थापित हो चुकी हो तो सिंचाई पर विचार करें।`,
            excessive: (d) => `दर्ज ${d.moisture}% नमी ${d.crop} के लिए अधिक है; जल-निकासी पर ध्यान दें और अतिरिक्त सिंचाई से बचें।`
        },
        weather: {
            severe: (d) => `वास्तविक सात-दिवसीय पूर्वानुमान: कुल वर्षा ${d.rainTotal} मिमी, वर्षा वाले दिन ${d.rainDays}, एक दिन की अधिकतम वर्षा ${d.maxDailyRain} मिमी और औसत अधिकतम तापमान ${d.avgMax} °C। अत्यधिक गर्मी या वर्षा से मौसम का गंभीर जोखिम है।`,
            mixed: (d) => `वास्तविक सात-दिवसीय पूर्वानुमान: कुल वर्षा ${d.rainTotal} मिमी, वर्षा वाले दिन ${d.rainDays}, एक दिन की अधिकतम वर्षा ${d.maxDailyRain} मिमी और औसत अधिकतम तापमान ${d.avgMax} °C। मौसम मिला-जुला है; निगरानी आवश्यक है।`,
            compatible: (d) => `वास्तविक सात-दिवसीय पूर्वानुमान: कुल वर्षा ${d.rainTotal} मिमी, वर्षा वाले दिन ${d.rainDays}, एक दिन की अधिकतम वर्षा ${d.maxDailyRain} मिमी और औसत अधिकतम तापमान ${d.avgMax} °C। आगामी मौसम फसल की अनुमानित जरूरतों के अनुकूल है।`
        },
        recommendations: {
            irrigation: "फसल की अवस्था और स्थानीय वाष्पोत्सर्जन के आधार पर सिंचाई पर विचार करें; खेत में नमी की जाँच करें।",
            drainage: "अनावश्यक सिंचाई से बचें और जलभराव कम करने के लिए जल-निकासी पर विचार करें।",
            heavyRain: "खेत की जल-निकासी तैयार रखें और संवेदनशील पौधों या हाल में उपचारित क्षेत्रों की रक्षा करें।",
            heat: "दिन के सबसे गर्म समय में मल्चिंग, समय पर पानी और गर्मी से बचाव पर विचार करें।",
            lowRain: "कम वर्षा का पूर्वानुमान सूखे के दबाव की निगरानी और उपलब्ध पानी की योजना बनाने का संकेत देता है।",
            slowSoil: "धीमी जल-निकासी वाली मिट्टी में अधिक सिंचाई से बचें और खेत की जल-निकासी बनाए रखें।",
            fastSoil: "कम मात्रा में बार-बार सिंचाई से पानी के तेजी से निकलने की हानि घट सकती है; यह अनुमानित सलाह है।",
            routine: "फसल की नियमित निगरानी करें और खेत की वास्तविक स्थिति के अनुसार प्रबंधन करें।"
        }
    },
    kn: {
        noVoice: "Voice playback for this language is unavailable on this device. You can still read the translated report.",
        voicePlaying: (name) => `${name} ಧ್ವನಿಯಲ್ಲಿ ವರದಿಯನ್ನು ಓದಲಾಗುತ್ತಿದೆ...`,
        summary: (d) => `ಆಯ್ಕೆ ಮಾಡಿದ ಸ್ಥಳ: ${d.location}. ಬೆಳೆ: ${d.crop}. ಮಣ್ಣಿನ ವಿಧ: ${d.soil}. ದಾಖಲಿಸಿದ ಮಣ್ಣಿನ ತೇವಾಂಶ ${d.moisture} ಶೇಕಡಾ. ಪ್ರಸ್ತುತ ಹವಾಮಾನ: ${d.weather}; ತಾಪಮಾನ ${d.temperature} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್, ಸಾಪೇಕ್ಷ ಆರ್ದ್ರತೆ ${d.humidity} ಶೇಕಡಾ ಮತ್ತು ಮಳೆ ${d.precipitation} ಮಿಲಿಮೀಟರ್. ಬರ ಅಪಾಯ: ${d.drought}, 100ರಲ್ಲಿ ${d.droughtScore}. ಭಾರಿ ಮಳೆ ಅಪಾಯ: ${d.rain}, 100ರಲ್ಲಿ ${d.rainScore}. ಒಟ್ಟಾರೆ ಹವಾಮಾನ ಅಪಾಯ: ${d.overall}, 100ರಲ್ಲಿ ${d.overallScore}. ಇವು ಮಾದರಿ ಅಂದಾಜುಗಳು ಮಾತ್ರ; ಬೆಳೆ ಇಳುವರಿ ಅಂದಾಜಲ್ಲ.`,
        soilHeading: "ಮಣ್ಣಿನ ಅನುಕೂಲತೆ",
        moistureHeading: "ತೇವಾಂಶದ ಅನುಕೂಲತೆ",
        weatherHeading: "ಹವಾಮಾನದ ಅನುಕೂಲತೆ",
        recommendationsHeading: "ರೈತರಿಗೆ ಸಲಹೆಗಳು",
        advisory: "ಇದು ಸಲಹಾತ್ಮಕ ಅಂದಾಜು ಮಾತ್ರ; ಮಣ್ಣು ಪರೀಕ್ಷೆ ಅಥವಾ ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.",
        soil: {
            preferred: (d) => `${d.crop} ಬೆಳೆಗೆ ${d.soil} ಮಣ್ಣು ಸಾಮಾನ್ಯವಾಗಿ ಸೂಕ್ತವಾಗಿದೆ.`,
            acceptable: (d) => `${d.crop} ಬೆಳೆಗೆ ${d.soil} ಮಣ್ಣು ಒಪ್ಪಿಗೆಯಾಗಬಹುದು; ಆದರೆ ನೀರು ಬಸಿದುಹೋಗುವಿಕೆ ಅಥವಾ ತೇವಾಂಶ ಉಳಿಸುವ ನಿರ್ವಹಣೆ ಬೇಕಾಗಬಹುದು.`,
            other: (d) => `${d.crop} ಬೆಳೆಗೆ ಸಾಮಾನ್ಯವಾಗಿ ಆದ್ಯತೆಯ ಮಣ್ಣಿನಲ್ಲಿ ${d.soil} ಇಲ್ಲ; ಹೆಚ್ಚುವರಿ ನೀರು ಬಸಿದುಹೋಗುವಿಕೆ ಅಥವಾ ತೇವಾಂಶ ಉಳಿಸುವ ನಿರ್ವಹಣೆ ಬೇಕಾಗಬಹುದು.`
        },
        moisture: {
            suitable: (d) => `ದಾಖಲಿಸಿದ ${d.moisture}% ತೇವಾಂಶ ${d.crop} ಬೆಳೆಗೆ ಅಂದಾಜು ಸೂಕ್ತ ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ.`,
            moderate: (d) => `ದಾಖಲಿಸಿದ ${d.moisture}% ತೇವಾಂಶ ಮಧ್ಯಮವಾಗಿದೆ; ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ನೀರಿನ ನಿರ್ವಹಣೆ ಇಲ್ಲದಿದ್ದರೆ ${d.crop} ಬೆಳೆಗೆ ಒತ್ತಡ ಉಂಟಾಗಬಹುದು.`,
            low: (d) => `ದಾಖಲಿಸಿದ ${d.moisture}% ತೇವಾಂಶ ${d.crop} ಬೆಳೆಗೆ ಕಡಿಮೆಯಾಗಿದೆ; ಬೆಳೆ ನೆಲೆಯೂರಿದ್ದರೆ ನೀರಾವರಿಯನ್ನು ಪರಿಗಣಿಸಿ.`,
            excessive: (d) => `ದಾಖಲಿಸಿದ ${d.moisture}% ತೇವಾಂಶ ${d.crop} ಬೆಳೆಗೆ ಹೆಚ್ಚಾಗಿದೆ; ನೀರು ಬಸಿದುಹೋಗುವಿಕೆಯನ್ನು ಸುಧಾರಿಸಿ ಮತ್ತು ಹೆಚ್ಚುವರಿ ನೀರಾವರಿ ತಪ್ಪಿಸಿ.`
        },
        weather: {
            severe: (d) => `ವಾಸ್ತವ ಏಳು ದಿನಗಳ ಮುನ್ಸೂಚನೆ: ಒಟ್ಟು ಮಳೆ ${d.rainTotal} ಮಿಮೀ, ಮಳೆಯ ದಿನಗಳು ${d.rainDays}, ಒಂದು ದಿನದ ಗರಿಷ್ಠ ಮಳೆ ${d.maxDailyRain} ಮಿಮೀ ಮತ್ತು ಸರಾಸರಿ ಗರಿಷ್ಠ ತಾಪಮಾನ ${d.avgMax} °C. ಅತಿಯಾದ ಬಿಸಿ ಅಥವಾ ಮಳೆ ಗಮನಾರ್ಹ ಹವಾಮಾನ ಅಪಾಯ ಉಂಟುಮಾಡುತ್ತದೆ.`,
            mixed: (d) => `ವಾಸ್ತವ ಏಳು ದಿನಗಳ ಮುನ್ಸೂಚನೆ: ಒಟ್ಟು ಮಳೆ ${d.rainTotal} ಮಿಮೀ, ಮಳೆಯ ದಿನಗಳು ${d.rainDays}, ಒಂದು ದಿನದ ಗರಿಷ್ಠ ಮಳೆ ${d.maxDailyRain} ಮಿಮೀ ಮತ್ತು ಸರಾಸರಿ ಗರಿಷ್ಠ ತಾಪಮಾನ ${d.avgMax} °C. ಹವಾಮಾನ ಮಿಶ್ರವಾಗಿದೆ; ಗಮನಿಸುವುದು ಅಗತ್ಯ.`,
            compatible: (d) => `ವಾಸ್ತವ ಏಳು ದಿನಗಳ ಮುನ್ಸೂಚನೆ: ಒಟ್ಟು ಮಳೆ ${d.rainTotal} ಮಿಮೀ, ಮಳೆಯ ದಿನಗಳು ${d.rainDays}, ಒಂದು ದಿನದ ಗರಿಷ್ಠ ಮಳೆ ${d.maxDailyRain} ಮಿಮೀ ಮತ್ತು ಸರಾಸರಿ ಗರಿಷ್ಠ ತಾಪಮಾನ ${d.avgMax} °C. ಮುಂದಿನ ಹವಾಮಾನವು ಬೆಳೆಯ ಅಂದಾಜು ಅಗತ್ಯಗಳಿಗೆ ಸಾಮಾನ್ಯವಾಗಿ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.`
        },
        recommendations: {
            irrigation: "ಬೆಳೆಯ ಹಂತ ಮತ್ತು ಸ್ಥಳೀಯ ಆವಿಶ್ವೇದನೆಯನ್ನು ಆಧರಿಸಿ ನೀರಾವರಿಯನ್ನು ಪರಿಗಣಿಸಿ; ಹೊಲದ ತೇವಾಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ.",
            drainage: "ಅನಗತ್ಯ ನೀರಾವರಿ ತಪ್ಪಿಸಿ ಮತ್ತು ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದುಹೋಗುವಿಕೆಯನ್ನು ಪರಿಗಣಿಸಿ.",
            heavyRain: "ಹೊಲದ ನೀರು ಬಸಿದುಹೋಗುವ ವ್ಯವಸ್ಥೆ ಸಿದ್ಧಪಡಿಸಿ; ಸೂಕ್ಷ್ಮ ಮೊಳಕೆಗಳು ಅಥವಾ ಇತ್ತೀಚೆಗೆ ಚಿಕಿತ್ಸೆ ನೀಡಿದ ಪ್ರದೇಶಗಳನ್ನು ರಕ್ಷಿಸಿ.",
            heat: "ದಿನದ ಅತ್ಯಂತ ಬಿಸಿಯಾದ ಸಮಯದಲ್ಲಿ ಮಲ್ಚಿಂಗ್, ಸಮಯೋಚಿತ ನೀರು ಮತ್ತು ಬಿಸಿಯಿಂದ ರಕ್ಷಣೆಯನ್ನು ಪರಿಗಣಿಸಿ.",
            lowRain: "ಕಡಿಮೆ ಮಳೆಯ ಮುನ್ಸೂಚನೆಯು ಬರದ ಒತ್ತಡವನ್ನು ಗಮನಿಸಿ ಲಭ್ಯವಿರುವ ನೀರನ್ನು ಯೋಜಿಸಲು ಸೂಚಿಸುತ್ತದೆ.",
            slowSoil: "ನಿಧಾನವಾಗಿ ನೀರು ಬಸಿಯುವ ಮಣ್ಣಿನಲ್ಲಿ ಅತಿಯಾದ ನೀರಾವರಿ ತಪ್ಪಿಸಿ ಮತ್ತು ಹೊಲದ ನೀರು ಬಸಿಯುವಿಕೆಯನ್ನು ಕಾಪಾಡಿ.",
            fastSoil: "ಕಡಿಮೆ ಪ್ರಮಾಣದಲ್ಲಿ ಆಗಾಗ್ಗೆ ನೀರು ಕೊಡುವುದರಿಂದ ವೇಗವಾಗಿ ನೀರು ಬಸಿದುಹೋಗುವ ನಷ್ಟ ಕಡಿಮೆಯಾಗಬಹುದು; ಇದು ಅಂದಾಜು ಸಲಹೆ.",
            routine: "ಬೆಳೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಗಮನಿಸಿ ಮತ್ತು ಹೊಲದ ವಾಸ್ತವ ಸ್ಥಿತಿಗೆ ತಕ್ಕಂತೆ ನಿರ್ವಹಣೆಯನ್ನು ಹೊಂದಿಸಿ."
        }
    }
};

let matchingLocations = [];
let weatherRequestId = 0;
let locationSearchRequestId = 0;
let selectedWeatherData = null;
let selectedWeatherCoordinates = null;
let climateReportData = null;
let farmMap = null;
let farmMarker = null;
let selectedFarmLocation = null;
let originalSearchedLocation = null;
let markerCoordinates = null;
let currentUtterance = null;
let reportIsPaused = false;
let reportPlaybackActive = false;
let reportVoices = [];
const reportVoiceWaiters = new Set();
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
        if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After");
            throw new Error(retryAfter
                ? `Weather provider is busy. Retry after ${retryAfter} seconds.`
                : "Weather provider is busy. Please wait a moment before trying again.");
        }
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
    const fullText = REPORT_FULL_TEXT[language];
    const hasNativeSpeech = "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
    const reportTitle = document.getElementById("climateReportTitle");
    const languageLabel = document.getElementById("reportLanguageLabel");

    reportTitle.textContent = text.title;
    languageLabel.textContent = text.language;
    playReportButton.textContent = text.play;
    pauseReportButton.textContent =
        reportIsPaused ? text.resume : text.pause;
    stopReportButton.textContent = text.stop;
    if (climateReportData) {
        const data = {
            ...climateReportData,
            crop: CLIMATE_REPORT_CROP_NAMES[language][climateReportData.crop] || climateReportData.crop,
            soil: CLIMATE_REPORT_SOIL_NAMES[language][climateReportData.soil] || climateReportData.soil,
            weather: getClimateReportWeather(climateReportData.weatherCode, language),
            drought: text.categories[climateReportData.drought],
            rain: text.categories[climateReportData.rain],
            overall: text.categories[climateReportData.overall],
            rainTotal: climateReportData.rainTotal.toFixed(1),
            maxDailyRain: climateReportData.maxDailyRain.toFixed(1),
            avgMax: climateReportData.avgMax.toFixed(1)
        };
        const baseText = fullText.summary(data);
        const suitabilityText = SUITABILITY_REPORT_TEXT[language];
        let suitabilityCategory = suitabilityText.Unsuitable;
        if (climateReportData.suitabilityCategory === "Suitable") suitabilityCategory = suitabilityText.Suitable;
        if (climateReportData.suitabilityCategory === "Moderately Suitable") suitabilityCategory = suitabilityText.Moderately;
        const moistureStatus = {
            "Suitable moisture": "suitable",
            "Moderate moisture": "moderate",
            "Low moisture": "low",
            "Excessive moisture": "excessive"
        };
        const soilDescription = fullText.soil[climateReportData.soilStatus](data);
        const moistureDescription = fullText.moisture[moistureStatus[climateReportData.moistureClass]](data);
        const weatherDescription = fullText.weather[climateReportData.weatherStatus](data);
        const recommendations = climateReportData.recommendationCodes
            .map((code) => fullText.recommendations[code])
            .filter(Boolean);
        climateReportText.textContent =
            `${baseText} ${suitabilityText.heading}: ${suitabilityCategory}. ` +
            `${fullText.soilHeading}: ${soilDescription} ` +
            `${fullText.moistureHeading}: ${moistureDescription} ` +
            `${fullText.weatherHeading}: ${weatherDescription} ` +
            `${fullText.recommendationsHeading}: ${recommendations.join(" ")} ${fullText.advisory}`;
    } else {
        climateReportText.textContent = text.pending;
    }
    playReportButton.disabled = !hasNativeSpeech || !climateReportData;
    pauseReportButton.disabled = !reportPlaybackActive;
    stopReportButton.disabled = !reportPlaybackActive;

    if (!hasNativeSpeech) {
        reportVoiceStatus.textContent = language === "te" || language === "kn"
            ? text.noVoice
            : text.voiceUnsupported;
    }
}

function refreshReportVoices() {
    if (!("speechSynthesis" in window)) return [];
    reportVoices = window.speechSynthesis.getVoices();
    Array.from(reportVoiceWaiters).forEach((checkVoices) => checkVoices(reportVoices));
    return reportVoices;
}

if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = refreshReportVoices;
    refreshReportVoices();
}

function findReportVoice(language, voices = reportVoices) {
    const locale = CLIMATE_REPORT_TEXT[language].locale.toLowerCase();
    const baseLanguage = locale.split("-")[0];
    return voices.find((voice) => voice.lang.toLowerCase() === locale) ||
        voices.find((voice) => voice.lang.toLowerCase().split("-")[0] === baseLanguage) ||
        null;
}

function waitForReportVoices(language) {
    const voices = refreshReportVoices();
    if (findReportVoice(language, voices)) return Promise.resolve(voices);

    return new Promise((resolve) => {
        let timeout;
        const finish = (loadedVoices) => {
            window.clearTimeout(timeout);
            reportVoiceWaiters.delete(checkVoices);
            reportVoices = loadedVoices;
            resolve(loadedVoices);
        };
        const checkVoices = (loadedVoices) => {
            if (findReportVoice(language, loadedVoices)) finish(loadedVoices);
        };
        reportVoiceWaiters.add(checkVoices);
        timeout = window.setTimeout(() => finish(window.speechSynthesis.getVoices()), 1500);
    });
}

function splitReportIntoChunks(report, maximumLength = 220) {
    const chunks = [];
    let remaining = report.trim();
    while (remaining.length > maximumLength) {
        let splitAt = remaining.lastIndexOf(" ", maximumLength);
        if (splitAt < maximumLength / 2) splitAt = maximumLength;
        chunks.push(remaining.slice(0, splitAt).trim());
        remaining = remaining.slice(splitAt).trim();
    }
    if (remaining) chunks.push(remaining);
    return chunks;
}

async function playClimateReport() {
    const language = getClimateReportLanguage();
    const text = CLIMATE_REPORT_TEXT[language];
    const fullText = REPORT_FULL_TEXT[language];
    if (!climateReportData) return;
    const hasNativeSpeech = "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
    if (!hasNativeSpeech) {
        reportVoiceStatus.textContent = language === "te" || language === "kn"
            ? text.noVoice
            : text.voiceUnsupported;
        renderClimateReport();
        return;
    }

    const requestId = ++speechRequestId;
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    currentUtterance = null;
    reportPlaybackActive = false;
    reportIsPaused = false;
    const voices = await waitForReportVoices(language);
    if (requestId !== speechRequestId || language !== getClimateReportLanguage()) return;
    const voice = findReportVoice(language, voices);
    if (!voice) {
        reportVoiceStatus.textContent = language === "te" || language === "kn"
            ? text.noVoice
            : fullText.noVoice;
        renderClimateReport();
        return;
    }

    const chunks = splitReportIntoChunks(climateReportText.textContent);
    reportPlaybackActive = chunks.length > 0;
    renderClimateReport();

    const speakChunk = (index) => {
        if (requestId !== speechRequestId || !reportPlaybackActive) return;
        if (index >= chunks.length) {
            currentUtterance = null;
            reportPlaybackActive = false;
            reportIsPaused = false;
            renderClimateReport();
            reportVoiceStatus.textContent = "";
            return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.lang = text.locale;
        utterance.voice = voice;
        currentUtterance = utterance;
        utterance.onstart = () => {
            if (requestId !== speechRequestId || currentUtterance !== utterance) return;
            reportVoiceStatus.textContent = fullText.voicePlaying(voice.name);
            renderClimateReport();
        };
        utterance.onend = () => {
            if (requestId !== speechRequestId || currentUtterance !== utterance) return;
            speakChunk(index + 1);
        };
        utterance.onerror = (event) => {
            if (requestId !== speechRequestId || currentUtterance !== utterance) return;
            currentUtterance = null;
            reportPlaybackActive = false;
            reportIsPaused = false;
            renderClimateReport();
            reportVoiceStatus.textContent = event.error === "canceled" ? "" : text.voiceError;
        };

        try {
            synthesis.speak(utterance);
            reportVoiceStatus.textContent = fullText.voicePlaying(voice.name);
            renderClimateReport();
        } catch (error) {
            console.error("Climate report speech failed.", error);
            currentUtterance = null;
            reportPlaybackActive = false;
            renderClimateReport();
            reportVoiceStatus.textContent = text.voiceError;
        }
    };

    speakChunk(0);
}

function stopClimateReport(showStatus = true) {
    speechRequestId += 1;
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    reportPlaybackActive = false;
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
        longitude
    };
    markerCoordinates = { latitude, longitude };
    if (!farmMap) {
        initializeFarmMap(selectedFarmLocation);
    }

    locationSearchInput.value = formatPlace(selectedFarmLocation);
    farmLocationInput.value = formatPlace(selectedFarmLocation);
    selectedLocationSummary.textContent = formatPlace(selectedFarmLocation);
    farmMapLocation.textContent = formatPlace(selectedFarmLocation);

    if (farmMap) {
        const markerPosition = [latitude, longitude];
        if (farmMarker) {
            farmMarker.setLatLng(markerPosition);
        } else {
            farmMarker = L.marker(markerPosition, {
                draggable: false,
                title: formatPlace(selectedFarmLocation)
            }).addTo(farmMap);
        }

        if (Number.isFinite(options.zoom)) {
            farmMap.setView(markerPosition, options.zoom);
        }
    } else {
        farmMapFeedback.textContent = "The map library is unavailable. The searched coordinates are shown but cannot be adjusted on a map.";
    }

    if (farmMap) {
        farmMapFeedback.textContent = "Selected location map.";
    }

    persistFarmLocation();
    return true;
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
    originalSearchedLocation = null;
    markerCoordinates = null;
    farmMarker = null;
    if (farmMap) {
        farmMap.stop();
        farmMap.remove();
        farmMap = null;
    }
    farmMapElement.textContent = "Search for a location to show its map.";
    farmMapLocation.textContent = "No farm location selected";
    farmMapFeedback.textContent = "Search for a location to place the map marker.";
    selectedLocationSummary.textContent = "No location selected";
    farmLocationInput.value = "";
}

function resetRiskResults(message) {
    climateReportData = null;
    speechRequestId += 1;
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    reportPlaybackActive = false;
    reportIsPaused = false;
    reportVoiceStatus.textContent = "";
    renderClimateReport();
    document.getElementById("droughtScore").textContent = "—";
    document.getElementById("droughtCategory").textContent = "Awaiting analysis";
    document.getElementById("droughtCategory").className = "risk-badge";
    document.getElementById("droughtBar").style.width = "0%";
    document.getElementById("droughtFactors").textContent = message;
    document.getElementById("rainfallScore").textContent = "—";
    document.getElementById("rainfallCategory").textContent = "Awaiting analysis";
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
    clearSuitabilityResults();
}

function clearSuitabilityResults(message) {
    document.getElementById("suitabilityCategory").textContent = "Awaiting analysis";
    document.getElementById("suitabilityCategory").className = "suitability-badge";
    document.getElementById("suitabilitySummary").textContent =
        message || "Select a crop, soil and moisture, then run the climate analysis.";
    document.getElementById("soilSuitabilityText").textContent = "Not analysed.";
    document.getElementById("moistureSuitabilityText").textContent = "Not analysed.";
    document.getElementById("weatherSuitabilityText").textContent = "Not analysed.";
    document.getElementById("suitabilityRecommendations").replaceChildren(
        Object.assign(document.createElement("li"), {
            textContent: "Run the analysis to receive conditional recommendations."
        })
    );
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

function renderWeatherForecast(weatherData) {
    const container = document.getElementById("weatherForecast");
    const status = document.getElementById("forecastStatus");
    container.replaceChildren();
    if (!weatherData || !Array.isArray(weatherData.forecast) || !weatherData.forecast.length) {
        status.textContent = "Seven-day forecast unavailable.";
        return;
    }
    status.textContent = `Seven-day forecast loaded for ${formatPlace(selectedFarmLocation || {})}.`;
    weatherData.forecast.forEach((day) => {
        const article = document.createElement("article");
        article.className = "forecast-day";
        const date = document.createElement("strong");
        const temperatures = document.createElement("span");
        const rain = document.createElement("span");
        date.textContent = day.date || "Day";
        temperatures.textContent = `${Number(day.temperatureMinC).toFixed(1)}–${Number(day.temperatureMaxC).toFixed(1)} °C`;
        rain.textContent = `${Number(day.precipitationMm).toFixed(1)} mm`;
        article.append(date, temperatures, rain);
        container.append(article);
    });
}

function clearWeather() {
    selectedWeatherData = null;
    selectedWeatherCoordinates = null;
    renderWeatherSnapshot(null, "Search for a location to load its weather.");
    document.getElementById("weatherForecast").replaceChildren();
    document.getElementById("forecastStatus").textContent = "Search for a location to load the forecast.";
    resetRiskResults("Choose a location with an available forecast, then run an analysis.");
}

async function loadWeather(location) {
    const requestId = ++weatherRequestId;
    selectedWeatherData = null;
    selectedWeatherCoordinates = null;
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
        selectedWeatherCoordinates = {
            latitude: Number(location.latitude),
            longitude: Number(location.longitude)
        };
        console.log("Weather API response received.", {
            location: formatPlace(location),
            current: data.current,
            forecastDays: Array.isArray(data.forecast) ? data.forecast.length : 0
        });
        renderWeatherSnapshot(data, `Weather loaded for ${placeName}.`);
        renderWeatherForecast(data);
        locationFeedback.textContent = `Weather loaded for ${placeName}.`;
        return data;
    } catch (error) {
        if (requestId !== weatherRequestId) return;
        selectedWeatherData = null;
        selectedWeatherCoordinates = null;
        console.error("Weather API response failed.", error);
        renderWeatherSnapshot(null, error.message);
        resetRiskResults("Weather data is unavailable, so a climate-risk estimate cannot be calculated.");
        locationFeedback.textContent = error.message;
        return null;
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
    originalSearchedLocation = { ...location };
    farmLocationInput.value = placeName;
    updateFarmLocation(location, { zoom: 13 });
    await loadWeather(location);
}

locationCandidates.addEventListener("change", () => {
    selectLocation(Number(locationCandidates.value));
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

function analyzeCropSuitability(cropName, soilName, soilMoisture, weatherData) {
    const cropSoilPreferences = {
        Rice: ["Clay", "Silty", "Loamy"],
        Wheat: ["Loamy", "Clay", "Silty"],
        Maize: ["Loamy", "Sandy", "Silty"],
        Cotton: ["Black soil", "Loamy", "Red soil"],
        Groundnut: ["Sandy", "Loamy", "Red soil"],
        Sugarcane: ["Loamy", "Clay", "Black soil"],
        Tomato: ["Loamy", "Sandy", "Silty"]
    };
    const moistureThresholds = {
        Rice: [25, 35, 75], Wheat: [20, 30, 70], Maize: [20, 30, 75],
        Cotton: [15, 25, 65], Groundnut: [15, 25, 65],
        Sugarcane: [25, 35, 80], Tomato: [20, 30, 70]
    };
    const preferred = cropSoilPreferences[cropName] || [];
    const soilIndex = preferred.indexOf(soilName);
    let soilScore = soilIndex === 0 ? 2 : soilIndex > 0 ? 1 : 0;
    if (soilName === "Sandy" || soilName === "Red soil") soilScore = Math.max(0, soilScore - 0);

    let moistureClass = "Suitable moisture";
    const [low, moderate, excessive] = moistureThresholds[cropName];
    if (soilMoisture < low) moistureClass = "Low moisture";
    else if (soilMoisture < moderate) moistureClass = "Moderate moisture";
    else if (soilMoisture > excessive) moistureClass = "Excessive moisture";

    let moistureScore = 2;
    if (moistureClass === "Moderate moisture") moistureScore = 1;
    if (moistureClass === "Low moisture" || moistureClass === "Excessive moisture") moistureScore = 0;

    const forecast = weatherData.forecast;
    const currentTemperature = weatherData.current.temperatureC;
    const forecastMax = forecast.map((day) => day.temperatureMaxC);
    const forecastMin = forecast.map((day) => day.temperatureMinC);
    const rainDays = forecast.filter((day) => day.precipitationMm >= 1).length;
    const rainTotal = forecast.reduce((total, day) => total + day.precipitationMm, 0);
    const maxDailyRain = Math.max(...forecast.map((day) => day.precipitationMm));
    const averageMax = forecastMax.reduce((sum, value) => sum + value, 0) / forecastMax.length;

    const heatSensitive = cropName === "Wheat" || cropName === "Tomato";
    let weatherScore = 2;
    if ((heatSensitive && averageMax > 32) || currentTemperature > 38 || maxDailyRain > 60) weatherScore = 0;
    else if (averageMax > 35 || rainTotal < 10 || rainTotal > 120 || rainDays === 0) weatherScore = 1;

    const soilText = soilIndex === 0
        ? `${soilName} is generally a preferred texture for ${cropName}.`
        : soilIndex > 0
            ? `${soilName} may be acceptable for ${cropName}, though drainage or water retention may need management.`
            : `${soilName} is not among the usual preferred soil textures for ${cropName}; extra drainage or water-retention management may be needed.`;

    const moistureText = moistureClass === "Suitable moisture"
        ? `The entered ${soilMoisture}% moisture is in an approximate suitable range for ${cropName}.`
        : moistureClass === "Low moisture"
            ? `The entered ${soilMoisture}% moisture is low for ${cropName}; irrigation may be considered if the crop is established.`
            : moistureClass === "Excessive moisture"
                ? `The entered ${soilMoisture}% moisture is excessive for ${cropName}; drainage and avoiding further irrigation should be considered.`
                : `The entered ${soilMoisture}% moisture is moderate and may become stressful without timely water management.`;

    let weatherText = `Actual forecast: ${rainTotal.toFixed(1)} mm rain, ${rainDays} rain days, and average forecast high ${averageMax.toFixed(1)} °C.`;
    if (weatherScore === 0) weatherText += " Excessive heat or rainfall creates a significant weather risk.";
    else if (weatherScore === 1) weatherText += " Weather is mixed and may require monitoring.";
    else weatherText += " The upcoming weather is generally compatible with approximate crop requirements.";

    const recommendations = [];
    const recommendationCodes = [];
    const addRecommendation = (code, message) => {
        recommendationCodes.push(code);
        recommendations.push(message);
    };
    if (moistureClass === "Low moisture") addRecommendation("irrigation", "Consider irrigation based on crop stage and local evapotranspiration; verify moisture with an on-farm check.");
    if (moistureClass === "Excessive moisture") addRecommendation("drainage", "Avoid unnecessary irrigation and consider drainage to reduce waterlogging risk.");
    if (maxDailyRain > 40) addRecommendation("heavyRain", "Prepare field drainage and protect vulnerable seedlings or recently treated areas.");
    if (averageMax > 32) addRecommendation("heat", "Consider mulching, timely watering and heat protection during the hottest part of the day.");
    if (rainTotal < 10) addRecommendation("lowRain", "A low-rainfall forecast suggests monitoring drought stress and planning available water.");
    if (soilName === "Clay" || soilName === "Black soil") addRecommendation("slowSoil", "For slow-draining soil, avoid over-irrigation and maintain field drainage.");
    if (soilName === "Sandy" || soilName === "Red soil") addRecommendation("fastSoil", "Light, frequent irrigation may reduce rapid drainage losses; this is an approximate advisory.");
    if (!recommendations.length) addRecommendation("routine", "Continue routine crop monitoring and adjust management to local field observations.");

    const totalScore = soilScore + moistureScore + weatherScore;
    const category = totalScore >= 5 ? "Suitable" : totalScore >= 3 ? "Moderately Suitable" : "Not Suitable";
    return {
        category,
        soilText,
        soilStatus: soilIndex === 0 ? "preferred" : soilIndex > 0 ? "acceptable" : "other",
        moistureClass,
        moistureText,
        weatherText,
        weatherStatus: weatherScore === 0 ? "severe" : weatherScore === 1 ? "mixed" : "compatible",
        recommendations,
        recommendationCodes,
        rainTotal,
        averageMax,
        maxDailyRain,
        rainDays
    };
}

function analyzeClimateRisk() {
    console.log("Climate calculation started.");
    if (!selectedFarmLocation) {
        throw new Error("Search for and select a location before running climate and crop suitability analysis.");
    }
    if (!selectedWeatherData || !Array.isArray(selectedWeatherData.forecast) || selectedWeatherData.forecast.length !== 7) {
        throw new Error("Load weather for a location with a complete 7-day forecast before analysing climate risk.");
    }

    const forecast = selectedWeatherData.forecast;
    const validForecast = forecast.every((day) =>
        day &&
        Number.isFinite(day.precipitationMm) &&
        day.precipitationMm >= 0 &&
        Number.isFinite(day.temperatureMaxC) &&
        Number.isFinite(day.temperatureMinC)
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
    const suitability = analyzeCropSuitability(cropName, soilName, soilMoisture, selectedWeatherData);
    console.log("Crop suitability calculation completed.", suitability);
    document.getElementById("suitabilityCategory").textContent = suitability.category;
    document.getElementById("suitabilityCategory").className =
        `suitability-badge ${suitability.category.toLowerCase().replaceAll(" ", "-")}`;
    document.getElementById("suitabilitySummary").textContent =
        `${cropName} is ${suitability.category.toLowerCase()} for the selected field inputs.`;
    document.getElementById("soilSuitabilityText").textContent = suitability.soilText;
    document.getElementById("moistureSuitabilityText").textContent = suitability.moistureText;
    document.getElementById("weatherSuitabilityText").textContent = suitability.weatherText;
    document.getElementById("suitabilityRecommendations").replaceChildren(
        ...suitability.recommendations.map((recommendation) =>
            Object.assign(document.createElement("li"), { textContent: recommendation })
        )
    );
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
        overall: overallCategory,
        overallScore: Math.max(droughtScore, heavyRainfallScore),
        suitabilityCategory: suitability.category,
        soilStatus: suitability.soilStatus,
        moistureClass: suitability.moistureClass,
        weatherStatus: suitability.weatherStatus,
        rainTotal: suitability.rainTotal,
        rainDays: suitability.rainDays,
        maxDailyRain: suitability.maxDailyRain,
        avgMax: suitability.averageMax,
        recommendationCodes: suitability.recommendationCodes
    };
    reportVoiceStatus.textContent = "";
    renderClimateReport();
    console.log("Final result generated.", climateReportData);
    console.log("Dashboard updated.", {
        droughtScore,
        heavyRainfallScore,
        overallCategory,
        suitability: suitability.category
    });
}

const analyzeClimateButton = document.getElementById("analyzeClimateButton");

analyzeClimateButton.addEventListener("click", () => {
    console.log("Analyze button clicked.");
});

farmForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    farmFeedback.textContent = "";
    locationFeedback.textContent = "";

    const cropName = document.getElementById("cropType").value;
    const soilName = document.getElementById("soilType").value;
    const soilMoisture = Number(soilMoistureInput.value);
    console.log("Input values collected.", { cropName, soilName, soilMoisture });

    if (!selectedFarmLocation) {
        const message = "Search for and select a location before running the analysis.";
        resetRiskResults(message);
        farmFeedback.textContent = message;
        console.error("Selected location unavailable.", message);
        return;
    }
    console.log("Selected location retrieved.", selectedFarmLocation);

    const weatherMatchesLocation =
        selectedWeatherCoordinates &&
        Math.abs(selectedWeatherCoordinates.latitude - selectedFarmLocation.latitude) < 0.000001 &&
        Math.abs(selectedWeatherCoordinates.longitude - selectedFarmLocation.longitude) < 0.000001;

    try {
        if (!selectedWeatherData || !weatherMatchesLocation) {
            analyzeClimateButton.disabled = true;
            analyzeClimateButton.textContent = "Loading weather...";
            locationFeedback.textContent = "Loading actual weather data before analysis...";
            const weatherData = await loadWeather(selectedFarmLocation);
            if (!weatherData) {
                throw new Error("Weather data is unavailable. Search for the location again or try when the weather provider is available.");
            }
        }

        analyzeClimateRisk();
    } catch (error) {
        console.error("Analysis failed.", error);
        resetRiskResults(error.message);
        document.getElementById("riskFeedback").textContent = error.message;
        farmFeedback.textContent = error.message;
    } finally {
        analyzeClimateButton.disabled = false;
        analyzeClimateButton.textContent = "Analyze climate risk";
    }
});

farmForm.addEventListener("input", () => {
    resetRiskResults("Farm inputs changed. Run the analysis again to update the estimates.");
});

farmForm.addEventListener("change", () => {
    resetRiskResults("Farm inputs changed. Run the analysis again to update the estimates.");
});

reportLanguage.addEventListener("change", () => {
    stopClimateReport(false);
    reportVoiceStatus.textContent = "";
    renderClimateReport();
    if (climateReportData) {
        void playClimateReport();
    }
});

playReportButton.addEventListener("click", () => {
    void playClimateReport();
});

pauseReportButton.addEventListener("click", () => {
    if (!reportPlaybackActive) return;
    const text = CLIMATE_REPORT_TEXT[getClimateReportLanguage()];
    const fullText = REPORT_FULL_TEXT[getClimateReportLanguage()];
    if (!("speechSynthesis" in window)) return;
    if (reportIsPaused) {
        window.speechSynthesis.resume();
        reportIsPaused = false;
        const voiceName = currentUtterance && currentUtterance.voice
            ? currentUtterance.voice.name
            : "";
        reportVoiceStatus.textContent = fullText.voicePlaying(voiceName);
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
