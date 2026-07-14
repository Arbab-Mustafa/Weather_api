# 🌦️ Weather-AI Dashboard

A production-ready Weather Dashboard built as part of the **Weather-AI Technical Assessment**.

The application securely integrates with the Weather-AI API through a server-side proxy, visualizes current and forecast weather, and presents AI-generated weather insights in a clean, responsive interface.

The project focuses on clean architecture, security, scalability, and production-ready engineering practices rather than simply displaying weather information.

---

#  Live Demo

https://weather-api-nu-six.vercel.app/

---

# Preview

(Add screenshots here after deployment)

---

#  Features

##  Location Support

- Search weather by city or place name
- Automatic browser geolocation
- Manual latitude & longitude input
- Server-side geocoding

---

##  Weather Data

Displays live Weather-AI data including:

- Current Weather
- Temperature
- Weather Condition
- Wind Speed
- Wind Direction
- Day / Night Status
- Last Updated Time
- Weather Code

---

## 📈 Forecasts

### Hourly Forecast

- Next 24 hours
- Interactive temperature chart
- Weather condition tooltip
- Rain prediction

### Daily Forecast

- 7-Day Forecast
- Maximum temperature
- Minimum temperature
- Rainfall
- Weather condition
- Weather icons

---

## 🤖 AI Weather Insights

Displays AI-generated weather analysis including:

- Weather Summary
- Important Highlights
- Forecast Overview
- Last Updated Timestamp

Gracefully handles situations where AI insights are unavailable.

---

## 🔒 Security

The application never exposes the Weather-AI API key.

All requests are proxied through Next.js API Routes.

```
Browser
     │
     ▼
Next.js API Route
     │
     ▼
Weather-AI API
```

API credentials remain securely on the server.

---

## ⚡ Performance

- Server-side API Proxy
- Optimized production build
- Cached API responses
- Responsive UI
- Skeleton loading
- Lazy rendering
- Error boundaries
- AbortController support
- Retry functionality

---

## 📱 Responsive Design

Fully responsive across

- Desktop
- Laptop
- Tablet
- Mobile

Built using Tailwind CSS.

---

# 🛠 Tech Stack

## Frontend

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS

## Charts

- Recharts

## Icons

- Lucide React

## Date Formatting

- date-fns

## Deployment

- Vercel

## CI/CD

- GitHub Actions

---

# 📁 Project Structure

```
src
│
├── app
│   ├── api
│   │   ├── geocode
│   │   └── proxy
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── AISummaryCard.tsx
│   ├── CurrentWeatherCard.tsx
│   ├── DailyForecastList.tsx
│   ├── ErrorAlert.tsx
│   ├── HourlyChart.tsx
│   ├── LoadingSkeleton.tsx
│   ├── LocationInput.tsx
│   └── WeatherDashboard.tsx
│
├── hooks
│   └── useWeather.ts
│
├── lib
│   └── types.ts
│
├── utils
│   ├── format.ts
│   └── weatherCodeMap.ts
│
├── .env.local.example
├── package.json
└── README.md
```

---

# 🏗 Architecture

```
                 Browser
                     │
                     ▼
        Weather Dashboard (React)
                     │
                     ▼
             useWeather Hook
                     │
                     ▼
          Next.js API Proxy Route
                     │
                     ▼
             Weather-AI API
```

The browser never communicates directly with Weather-AI.

---

# ⚙️ Requirements

Before running the project, install:

- Node.js 20+
- npm
- Git

Check versions

```bash
node -v

npm -v

git --version
```

---

# 🔑 Weather-AI API Key

Create an account on Weather-AI.

Generate an API key.

Example

```
wai_xxxxxxxxxxxxxxxxxxxxxxxxx
```

Never expose this key inside client-side code.

---

# 📥 Installation

## 1 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/weather-ai-dashboard.git
```

---

## 2 Enter Project

```bash
cd weather-ai-dashboard
```

---

## 3 Install Dependencies

```bash
npm install
```

---

## 4 Create Environment File

Copy the example environment file.

Windows

```bash
copy .env.local.example .env.local
```

Linux / macOS

```bash
cp .env.local.example .env.local
```

---

## 5 Configure Environment Variables

Open

```
.env.local
```

Add

```env
WEATHER_AI_API_KEY=wai_your_api_key_here
```

---

## 6 Run Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 🏗 Build for Production

```bash
npm run build
```

Start production server

```bash
npm start
```

---

# 🧪 Available Scripts

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Production Start

```bash
npm start
```

Lint

```bash
npm run lint
```

---

# 🌐 Environment Variables

| Variable | Required | Description |
|-----------|----------|-------------|
| WEATHER_AI_API_KEY | ✅ | Weather-AI API Key |

Example

```env
WEATHER_AI_API_KEY=wai_xxxxxxxxxxxxxxxxx
```

---

# 🚀 Deployment

## Deploy to Vercel

Push the repository to GitHub.

Import the repository into Vercel.

Add the following Environment Variable inside Vercel.

```
WEATHER_AI_API_KEY
```

Deploy.

---

# ⚙ GitHub Actions Deployment

This repository includes an automated deployment workflow.

```
.github/workflows/vercel-deploy.yml
```

Required GitHub Secrets

```
VERCEL_TOKEN

VERCEL_ORG_ID

VERCEL_PROJECT_ID

WEATHER_AI_API_KEY
```

Every push to the **main** branch automatically triggers deployment.

---

# 🔒 Security Considerations

✔ API key never reaches the browser

✔ Server-side API proxy

✔ Environment Variables

✔ Request validation

✔ Graceful error handling

✔ Rate limit handling

✔ AbortController support

---

# 📊 API Flow

```
User

   │

Search Location

   │

Next.js Geocode API

   │

Latitude & Longitude

   │

Weather Proxy

   │

Weather-AI API

   │

Weather Response

   │

Dashboard Rendering
```

---

# 🎯 Assessment Highlights

This project demonstrates:

- Production-ready architecture
- Secure API integration
- Clean component-based design
- Responsive UI/UX
- TypeScript best practices
- Error handling
- Loading states
- AI integration
- Data visualization
- GitHub Actions CI/CD
- Vercel deployment
- Modern React patterns
- Scalable project structure

---

# 👨‍💻 Author

**Arbab Mustafa**

Portfolio

https://social.arbabmustafa.com

GitHub

https://github.com/Arbab-Mustafa

LinkedIn

https://linkedin.com/in/arbabmustafa

---

# 📄 License

MIT License

Feel free to use this project for educational purposes.
