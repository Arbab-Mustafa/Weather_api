"use client";

import { Cloud, LocateFixed } from "lucide-react";
import { useMemo, useState } from "react";
import { AISummaryCard } from "@/components/AISummaryCard";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { DailyForecastList } from "@/components/DailyForecastList";
import { ErrorAlert } from "@/components/ErrorAlert";
import { HourlyChart } from "@/components/HourlyChart";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { LocationInput } from "@/components/LocationInput";
import { useWeather } from "@/hooks/useWeather";

type Coordinates = {
  lat: number;
  lon: number;
};

export function WeatherDashboard() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const { data, loading, error, refetch } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const headerSummary = useMemo(() => {
    if (!coordinates) {
      return "Enter a location or use your current location to fetch live weather data.";
    }

    return `Latitude ${coordinates.lat.toFixed(4)}, longitude ${coordinates.lon.toFixed(4)}`;
  }, [coordinates]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-slate-950 px-6 py-8 text-white shadow-soft sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
                <Cloud className="h-3.5 w-3.5" /> Weather-AI Dashboard
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Real-time weather with AI insights
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                A polished assessment-ready dashboard that proxies Weather-AI
                securely, renders forecasts, and surfaces clear error states for
                real-world resilience.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 font-medium text-blue-100">
                <LocateFixed className="h-4 w-4" /> Status
              </div>
              <p className="mt-2 leading-6">{headerSummary}</p>
            </div>
          </div>
        </section>

        <LocationInput onCoordinatesChange={setCoordinates} />

        {!coordinates ? (
          <section className="glass-card rounded-[2rem] p-8 text-center shadow-soft">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-blue-700">
              <Cloud className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
              Enter a location to begin
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Pick your current position or type latitude and longitude. The
              dashboard will then load live current conditions, a 7-day
              forecast, and AI-generated observations.
            </p>
          </section>
        ) : loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorAlert message={error} onRetry={refetch} />
        ) : data ? (
          <div className="space-y-6">
            <CurrentWeatherCard current={data.current} />
            <div className="grid gap-6 lg:grid-cols-2">
              <HourlyChart hourly={data.hourly} />
              <AISummaryCard aiSummary={data.ai_summary} />
            </div>
            <DailyForecastList daily={data.daily} />
          </div>
        ) : (
          <section className="glass-card rounded-[2rem] p-8 text-center shadow-soft">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              No data available
            </p>
            <p className="mt-3 text-slate-700">
              Weather data will appear here after a location is selected.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
