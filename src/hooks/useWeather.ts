"use client";

import { useEffect, useRef, useState } from 'react';
import type { AISummary, WeatherResponse } from '@/lib/types';

function isWeatherResponse(value: unknown): value is WeatherResponse {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  if (
    typeof record.current !== 'object' ||
    record.current === null ||
    typeof (record.current as any).temperature !== 'number'
  ) return false;
  if (!Array.isArray(record.daily)) return false;
  if (!Array.isArray(record.hourly)) return false;
  return true;
}

function normalizeAISummary(value: unknown): AISummary | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  if (
    typeof record.summary === 'string' &&
    Array.isArray(record.highlights) &&
    typeof record.updated_at === 'string'
  ) {
    return {
      summary: record.summary,
      highlights: record.highlights.filter(
        (h: unknown): h is string => typeof h === 'string'
      ),
      updated_at: record.updated_at,
    };
  }
  return null;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: unknown;
      message?: unknown;
      detail?: unknown;
    };
    const msg = payload.error ?? payload.message ?? payload.detail;
    if (typeof msg === 'string' && msg.trim().length > 0) return msg;
  } catch {}
  if (response.status === 429) {
    const reset = response.headers.get('X-RateLimit-Reset');
    return reset
      ? `429 Too Many Requests. Monthly limit reached. Reset: ${new Date(
          Number(reset) * 1000
        ).toLocaleString()}`
      : '429 Too Many Requests. Monthly limit reached.';
  }
  if (response.status >= 500) return 'The weather service is temporarily unavailable.';
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
          days: '7',
          ai: 'true',
          units: 'metric',
          lang: 'en',
        });

        const res = await fetch(`/api/proxy/weather?${params}`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(await readErrorMessage(res));

        const payload: unknown = await res.json();
        if (!isWeatherResponse(payload))
          throw new Error('Weather data was incomplete or malformed.');

        if (mounted) {
          setData({
            current: payload.current,
            daily: payload.daily,
            hourly: payload.hourly,
            ai_summary: normalizeAISummary(payload.ai_summary),
          });
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load weather data.';
        if (mounted) {
          setError(message);
          setData(null);
        }
      } finally {
        if (mounted) setLoading(false);
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