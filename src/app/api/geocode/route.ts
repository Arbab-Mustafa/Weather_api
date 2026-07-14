import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

type GeocodeResult = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get("q")?.trim();

  if (!searchTerm) {
    return NextResponse.json(
      { error: "Please provide a location name to search." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const targetUrl = new URL(NOMINATIM_URL);
  targetUrl.searchParams.set("format", "jsonv2");
  targetUrl.searchParams.set("q", searchTerm);
  targetUrl.searchParams.set("limit", "1");

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "weather-ai-dashboard/1.0",
      },
      cache: "no-store",
      signal: request.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Location search service is temporarily unavailable." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const results = (await response.json()) as GeocodeResult[];
    const [firstResult] = results;

    if (!firstResult?.lat || !firstResult?.lon) {
      return NextResponse.json(
        { error: "No matching location found. Try a different search term." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        lat: firstResult.lat,
        lon: firstResult.lon,
        display_name: firstResult.display_name ?? searchTerm,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to search that location right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}