import {
  Wind,
  Compass,
  Clock3,
  Sun,
  Moon,
  Cloud,
} from "lucide-react";

import type { CurrentWeather } from "@/lib/types";

import {
  formatTemp,
  formatWindSpeed,
  formatTimeString,
  getCompassDirection,
} from "@/utils/format";

import { getWeatherInfo } from "@/utils/weatherCodeMap";

type Props = {
  current: CurrentWeather;
};

export function CurrentWeatherCard({ current }: Props) {
  const weather = getWeatherInfo(current.weathercode);

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <section className="glass-card rounded-[2rem] p-6 shadow-soft animate-fadeInUp">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="card-title">Current Weather</p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Your Location
          </h2>

          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">
            {weather.description}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          WMO {current.weathercode}
        </span>
      </div>

      {/* Main */}

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={iconUrl}
            alt={weather.description}
            className="h-24 w-24"
          />

          <div>
            <div className="text-5xl font-bold tracking-tight text-slate-950">
              {formatTemp(current.temperature)}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" />
                {formatTimeString(current.time)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                {current.is_day ? (
                  <>
                    <Sun className="h-4 w-4 text-yellow-500" />
                    Day
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-indigo-500" />
                    Night
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Cloud className="h-4 w-4" />
            Condition
          </div>

          <div className="mt-2 text-lg font-semibold text-slate-900">
            {weather.description}
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<Wind className="h-5 w-5" />}
          label="Wind Speed"
          value={formatWindSpeed(current.windspeed)}
        />

        <Stat
          icon={<Compass className="h-5 w-5" />}
          label="Direction"
          value={`${current.winddirection}° (${getCompassDirection(
            current.winddirection
          )})`}
        />

        <Stat
          icon={<Clock3 className="h-5 w-5" />}
          label="Updated"
          value={formatTimeString(current.time)}
        />

        <Stat
          icon={
            current.is_day ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )
          }
          label="Period"
          value={current.is_day ? "Day" : "Night"}
        />
      </div>
    </section>
  );
}

type StatProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

function Stat({ label, value, icon }: StatProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-3 text-lg font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}