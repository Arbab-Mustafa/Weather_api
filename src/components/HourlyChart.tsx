"use client";

import type { HourlyWeather } from '@/lib/types';
import { formatTemp, formatHour, formatPrecipitation } from '@/utils/format';
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getWeatherInfo } from '@/utils/weatherCodeMap';

type Props = { hourly: HourlyWeather[] };

export function HourlyChart({ hourly }: Props) {
  const data = hourly.slice(0, 24).map((point) => ({
    timeLabel: formatHour(point.time),
    temp: point.temp,
    precipitation: point.precipitation,
    condition: getWeatherInfo(point.weathercode).description,
  }));

  if (data.length === 0) {
    return (
      <section className="glass-card rounded-[2rem] p-6 shadow-soft">
        <p className="card-title">Hourly Forecast</p>
        <p className="mt-4 text-sm text-slate-600">
          No hourly data available.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-card rounded-[2rem] p-6 shadow-soft">
      <p className="card-title">Hourly Forecast</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        Temperature (next 24h)
      </h2>
      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
            <XAxis
              dataKey="timeLabel"
              tick={{ fill: '#475569', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="none"
              fill="url(#tempGradient)"
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur-sm">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="text-sm text-slate-600">{point.condition}</p>
      <p>Temperature: {formatTemp(point.temp)}</p>
      <p>Rain: {formatPrecipitation(point.precipitation)}</p>
    </div>
  );
}