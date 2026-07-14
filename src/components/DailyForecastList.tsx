import type { DailyWeather } from "@/lib/types";
import {
  formatTemp,
  formatDateString,
  formatPrecipitation,
} from "@/utils/format";
import { getWeatherInfo } from "@/utils/weatherCodeMap";

type Props = { daily: DailyWeather[] };

export function DailyForecastList({ daily }: Props) {
  return (
    <section className="glass-card rounded-[2rem] p-6 shadow-soft">
      <p className="card-title">7‑Day Forecast</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        Daily outlook
      </h2>
      <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
        {daily.map((day) => {
          const info = getWeatherInfo(day.weathercode);
          const iconUrl = `https://openweathermap.org/img/wn/${info.icon}@2x.png`;
          const today = new Date().toISOString().slice(0, 10) === day.date;
          return (
            <article
              key={day.date}
              className={`min-w-[180px] rounded-[1.75rem] border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                today
                  ? "border-blue-400 ring-1 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  {formatDateString(day.date)}
                </h3>
                <img
                  src={iconUrl}
                  alt={info.description}
                  className="h-12 w-12"
                />
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                {info.description}
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">
                {formatTemp(day.temp_max)} /{" "}
                <span className="text-slate-500">
                  {formatTemp(day.temp_min)}
                </span>
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Rain: {formatPrecipitation(day.precipitation)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
