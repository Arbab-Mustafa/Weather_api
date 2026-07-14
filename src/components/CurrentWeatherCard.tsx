import { Wind } from 'lucide-react';
import type { CurrentWeather } from '@/lib/types';
import { formatTemp, formatWindSpeed, formatTimeString } from '@/utils/format';
import { getWeatherInfo } from '@/utils/weatherCodeMap';

type Props = { current: CurrentWeather };

export function CurrentWeatherCard({ current }: Props) {
  const weatherInfo = getWeatherInfo(current.weathercode);
  const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`;

  return (
    <section className="glass-card rounded-[2rem] p-6 shadow-soft animate-fadeInUp">
      <p className="card-title">Current Weather</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        Your Location
      </h2>
      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">
        {weatherInfo.description}
      </p>
      <div className="mt-6 flex items-center gap-4">
        <img src={iconUrl} alt={weatherInfo.description} className="h-20 w-20" />
        <div>
          <div className="text-5xl font-semibold tracking-tight text-slate-950">
            {formatTemp(current.temperature)}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {formatTimeString(current.time)}{' '}
            <span className="ml-1">
              {current.is_day ? '☀️' : '🌙'}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Wind Speed"
          value={formatWindSpeed(current.windspeed)}
          icon={<Wind />}
        />
        <Stat
          label="Wind Direction"
          value={`${current.winddirection}°`}
          icon={<Wind style={{ transform: 'rotate(45deg)' }} />}
        />
        <Stat
          label="Weather Code"
          value={`WMO ${current.weathercode}`}
          icon={null}
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}