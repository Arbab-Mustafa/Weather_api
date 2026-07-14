"use client";

import { LocateFixed, Search, Sparkles } from "lucide-react";
import { useState } from "react";

type Coordinates = {
  lat: number;
  lon: number;
};

type LocationInputProps = {
  onCoordinatesChange: (coordinates: Coordinates) => void;
};

function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function LocationInput({ onCoordinatesChange }: LocationInputProps) {
  const [mode, setMode] = useState<"geo" | "manual" | "search">("geo");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCoordinatesSubmission(nextLat: number, nextLon: number): void {
    if (!isValidLatitude(nextLat) || !isValidLongitude(nextLon)) {
      setError(
        "Latitude must be between -90 and 90, and longitude between -180 and 180.",
      );
      return;
    }

    setError(null);
    onCoordinatesChange({ lat: nextLat, lon: nextLon });
  }

  function requestGeolocation(): void {
    if (!("geolocation" in navigator)) {
      setMode("manual");
      setError(
        "Geolocation is unavailable in this browser. Enter coordinates manually.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const nextLat = position.coords.latitude;
        const nextLon = position.coords.longitude;
        setLat(nextLat.toFixed(4));
        setLon(nextLon.toFixed(4));
        handleCoordinatesSubmission(nextLat, nextLon);
      },
      (geolocationError) => {
        setLoading(false);
        setMode("manual");

        if (geolocationError.code === geolocationError.PERMISSION_DENIED) {
          setError(
            "Location permission was denied. Enter coordinates manually or allow access in your browser settings.",
          );
          return;
        }

        setError(
          "Unable to determine your location right now. Enter coordinates manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  function handleManualSubmit(): void {
    const nextLat = Number(lat);
    const nextLon = Number(lon);
    if (Number.isNaN(nextLat) || Number.isNaN(nextLon)) {
      setError("Please enter valid numeric coordinates.");
      return;
    }

    handleCoordinatesSubmission(nextLat, nextLon);
  }

  async function handleLocationSearch(): Promise<void> {
    const trimmedLocation = locationName.trim();
    if (!trimmedLocation) {
      setError("Enter a city, town, or place name to search.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams({ q: trimmedLocation });
      const response = await fetch(`/api/geocode?${searchParams.toString()}`);

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          payload?.error ?? "Location search failed. Please try again.",
        );
      }

      const payload = (await response.json()) as {
        lat?: string;
        lon?: string;
        display_name?: string;
      };
      const nextLat = Number(payload.lat);
      const nextLon = Number(payload.lon);

      if (Number.isNaN(nextLat) || Number.isNaN(nextLon)) {
        throw new Error("Location search returned invalid coordinates.");
      }

      setLat(nextLat.toFixed(4));
      setLon(nextLon.toFixed(4));
      handleCoordinatesSubmission(nextLat, nextLon);
    } catch (searchError) {
      const message =
        searchError instanceof Error
          ? searchError.message
          : "Unable to search that location right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-card rounded-[2rem] p-5 shadow-soft md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="card-title">Location</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Find weather for any place or coordinate
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Use your current location, search by city or place name, or enter
            latitude and longitude manually. The Weather-AI API fetches live
            weather, daily forecasts, and AI insights.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setMode("geo")}
            className={`rounded-full px-4 py-2 transition ${mode === "geo" ? "bg-white text-slate-900 shadow-sm" : ""}`}
          >
            Use My Location
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`rounded-full px-4 py-2 transition ${mode === "manual" ? "bg-white text-slate-900 shadow-sm" : ""}`}
          >
            Enter Coordinates
          </button>
          <button
            type="button"
            onClick={() => setMode("search")}
            className={`rounded-full px-4 py-2 transition ${mode === "search" ? "bg-white text-slate-900 shadow-sm" : ""}`}
          >
            Search by Name
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-soft">
          <div className="flex items-center gap-3 text-sm font-medium text-blue-100">
            <Sparkles className="h-4 w-4" />
            Clean, production-ready API proxy
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200">
            API keys stay on the server. Requests are proxied through Next.js so
            the Weather-AI token never reaches the browser. Name searches are
            resolved server-side, then converted into coordinates.
          </p>
          <button
            type="button"
            onClick={requestGeolocation}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LocateFixed className="h-4 w-4" />
            {loading ? "Locating..." : "Use My Location"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {mode === "search" ? (
            <div className="space-y-3">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>City or place name</span>
                <input
                  type="text"
                  value={locationName}
                  onChange={(event) => setLocationName(event.target.value)}
                  placeholder="Islamabad, Pakistan"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                />
              </label>
              <button
                type="button"
                onClick={() => void handleLocationSearch()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search className="h-4 w-4" />
                {loading ? "Searching..." : "Search location"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Latitude</span>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(event) => setLat(event.target.value)}
                    placeholder="-1.2921"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Longitude</span>
                  <input
                    type="number"
                    step="any"
                    value={lon}
                    onChange={(event) => setLon(event.target.value)}
                    placeholder="36.8219"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={handleManualSubmit}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </>
          )}
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
