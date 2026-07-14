"use client";

import { useEffect, useRef, useState } from "react";
import type {
  AISummary,
  HourlyWeather,
  WeatherInsight,
  WeatherOverview,
  WeatherResponse,
  WeatherStatistics,
} from "@/lib/types";
import { format } from "date-fns";
import { getWeatherInfo } from "@/utils/weatherCodeMap";

function isWeatherResponse(value: unknown): value is WeatherResponse {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;

  if (
    typeof record.current !== "object" ||
    record.current === null ||
    typeof (record.current as any).temperature !== "number"
  ) {
    return false;
  }

  if (!Array.isArray(record.daily)) return false;

  if (!Array.isArray(record.hourly)) return false;

  return true;
}

function normalizeAISummary(value: unknown): AISummary | null {
  if (typeof value !== "object" || value === null) return null;

  const record = value as Record<string, unknown>;

  if (
    typeof record.summary === "string" &&
    Array.isArray(record.highlights) &&
    typeof record.updated_at === "string"
  ) {
    return {
      summary: record.summary,
      highlights: record.highlights.filter(
        (item): item is string => typeof item === "string",
      ),
      updated_at: record.updated_at,
    };
  }

  return null;
}

function buildOverview(payload: WeatherResponse): WeatherOverview {
  const today = payload.daily[0];

  return {
    currentTemp: payload.current.temperature,
    todayHigh: today?.temp_max ?? payload.current.temperature,
    todayLow: today?.temp_min ?? payload.current.temperature,
    todayRain: today?.precipitation ?? 0,
    weatherCode: payload.current.weathercode,
    updatedAt: payload.current.time,
    isDay: payload.current.is_day === 1,
  };
}

function buildStatistics(hourly: HourlyWeather[]): WeatherStatistics {
  const next24 = hourly.slice(0, 24);

  const temps = next24.map((h) => h.temp);

  const highestTemp = Math.max(...temps);

  const lowestTemp = Math.min(...temps);

  const averageTemp =
    temps.reduce((sum, t) => sum + t, 0) / Math.max(temps.length, 1);

  const warmest = next24.find((h) => h.temp === highestTemp);

  const coolest = next24.find((h) => h.temp === lowestTemp);

  const rainyHours = next24.filter((h) => h.precipitation > 0).length;

  const dryHours = next24.length - rainyHours;

  const totalRainfall = next24.reduce((sum, h) => sum + h.precipitation, 0);

  return {
    averageTemp,

    highestTemp,

    lowestTemp,

    warmestHour: warmest ? format(new Date(warmest.time), "h:mm a") : "-",

    coolestHour: coolest ? format(new Date(coolest.time), "h:mm a") : "-",

    rainyHours,

    dryHours,

    totalRainfall,
  };
}

function buildInsight(
  payload: WeatherResponse,
  aiSummary: AISummary | null,
): WeatherInsight {
  if (aiSummary) {
    return {
      summary: aiSummary.summary,
      highlights: aiSummary.highlights,
    };
  }

  const today = payload.daily[0];

  const condition = getWeatherInfo(payload.current.weathercode).description;

  const highlights: string[] = [];

  highlights.push(`Today's high will reach ${today.temp_max.toFixed(1)}°C.`);

  highlights.push(`Today's low will be ${today.temp_min.toFixed(1)}°C.`);

  if (today.precipitation > 0) {
    highlights.push(
      `${today.precipitation.toFixed(
        1,
      )} mm of precipitation is expected today.`,
    );
  } else {
    highlights.push("No significant rainfall is expected today.");
  }

  highlights.push(`Wind speed is ${payload.current.windspeed.toFixed(1)} m/s.`);

  return {
    summary: `Current weather is ${condition.toLowerCase()} with a temperature of ${payload.current.temperature.toFixed(
      1,
    )}°C.`,

    highlights,
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: unknown;
      message?: unknown;
      detail?: unknown;
    };

    const msg = payload.error ?? payload.message ?? payload.detail;

    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  } catch {}

  if (response.status === 429) {
    const reset = response.headers.get("X-RateLimit-Reset");

    return reset
      ? `429 Too Many Requests. Monthly limit reached. Reset: ${new Date(
          Number(reset) * 1000,
        ).toLocaleString()}`
      : "429 Too Many Requests. Monthly limit reached.";
  }

  if (response.status >= 500) {
    return "The weather service is temporarily unavailable.";
  }

  return `Request failed with status ${response.status}.`;
}

export function useWeather(lat: number | null, lon: number | null) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    abortRef.current = controller;

    let mounted = true;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lon: String(lon),
          days: "7",
          ai: "true",
          units: "metric",
          lang: "en",
        });

        const response = await fetch(`/api/proxy/weather?${params}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(await readErrorMessage(response));
        }

        const payload: unknown = await response.json();

        if (!isWeatherResponse(payload)) {
          throw new Error("Weather data was incomplete or malformed.");
        }

        const aiSummary = normalizeAISummary(payload.ai_summary);

        const overview = buildOverview(payload);

        const statistics = buildStatistics(payload.hourly);

        const insight = buildInsight(payload, aiSummary);

        if (mounted) {
          setData({
            current: payload.current,
            daily: payload.daily,
            hourly: payload.hourly,
            ai_summary: normalizeAISummary(payload.ai_summary),

            overview: payload.overview,
            statistics: payload.statistics,
            insight: payload.insight,
          });
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        const message =
          err instanceof Error ? err.message : "Failed to load weather data.";

        if (mounted) {
          setError(message);
          setData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [lat, lon, refreshIndex]);

  return {
    data,
    loading,
    error,
    refetch: () => setRefreshIndex((c) => c + 1),
  };
}
