# 🌦️ ClimateAnalyzer AI – Climate Analyzer

An AI-powered climate analysis platform designed to help users understand weather conditions, monitor climate patterns, and identify potential climate risks.

## 📌 Project Overview

ClimateAnalyzer AI is a web-based climate analysis application that provides real-time weather information and climate insights based on geographical locations.

The application retrieves weather data, displays current weather conditions, and provides forecast information to help users understand changing environmental conditions.

## ✨ Features

- **Dynamic Location Search:** Search for weather information using different locations.
- **Real-Time Weather Data:** Retrieve current temperature, humidity, and precipitation.
- **Weather Forecast:** Display a seven-day weather forecast.
- **Climate Risk Analysis:** Explore potential climate risks such as drought, heavy rainfall, and temperature stress.
- **Interactive Dashboard:** View weather information through a user-friendly interface.

## 🛠️ Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API

**Weather Data**
- Open-Meteo API (Geocoding and Weather API)

**Development Tools**
- Visual Studio Code
- Git
- GitHub

## 📂 Project Structure

```text
ClimateAnalyzer-AI/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   │   └── climate.js
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
│
├── .gitignore
├── package.json
└── package-lock.json
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sharmilareddy-jpg/ClimateAnalyzer-AI.git
```

### 2. Navigate to the Project Folder

```bash
cd ClimateAnalyzer-AI
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Backend Server

```bash
npm run dev
```

### 5. Open the Application

Open the frontend `index.html` file in your browser or use the configured local development server.

The backend is expected to run at:

```text
http://localhost:3000
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/geocode?name=location` | Retrieves geographical coordinates |
| GET | `/api/weather?latitude=...&longitude=...` | Retrieves weather information |

## 🌍 External API

This project uses the **Open-Meteo API** to retrieve geographical and weather information.

- Geocoding API
- Weather Forecast API

Website: https://open-meteo.com/

## 🚀 Future Enhancements

- Improve AI-based climate risk prediction.
- Add interactive climate visualizations.
- Provide more detailed drought and rainfall analysis.
- Enhance location-based climate insights.
- Improve dashboard functionality.

## 👩‍💻 Developer

**Sharmila Reddy**

B.Tech – Computer Science and Engineering

GitHub: https://github.com/sharmilareddy-jpg

---

⭐ If you find this project interesting, consider giving it a star!
