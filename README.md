# Weather-AI Dashboard

Production-ready weather dashboard for the Weather-AI technical assessment. It uses a Next.js App Router frontend, a server-side proxy for API security, responsive Tailwind UI, and a GitHub Actions workflow for Vercel deployment.

## Features

- Secure API proxy so the Weather-AI key never reaches the browser
- Browser geolocation and manual latitude/longitude entry
- Current weather, 7-day forecast, hourly chart, and AI summary
- Loading skeletons, validation, rate-limit handling, and network error states
- Mobile-first responsive layout with a polished glassmorphism-style UI

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react
- date-fns
- Vercel

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create your local environment file from the example:

```bash
copy .env.local.example .env.local
```

4. Add your Weather-AI API key to `.env.local`:

```bash
WEATHER_AI_API_KEY=wai_your_api_key_here
```

5. Run the app locally:

```bash
npm run dev
```

## Getting a Weather-AI API Key

Create an account on Weather-AI and generate an API key from the dashboard. The proxy route reads `WEATHER_AI_API_KEY` on the server and attaches it as a Bearer token to upstream API calls.

## Deployment

The repository includes `.github/workflows/vercel-deploy.yml` for GitHub Actions deployment to Vercel.

Set these GitHub repository secrets before enabling the workflow:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `WEATHER_AI_API_KEY`

## Project Structure

```text
src/
├── app/
│   ├── api/proxy/[...segments]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
├── lib/
└── utils/
```

## Live Demo

TBD after deployment.

## License

MIT
