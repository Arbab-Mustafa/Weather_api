import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://api.weather-ai.co/v1";

function buildTargetUrl(request: NextRequest, segments: string[]): string {
  const target = new URL(`${API_BASE_URL}/${segments.join("/")}`);
  target.search = request.nextUrl.search;
  return target.toString();
}

async function parseErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as Record<string, unknown>;
      const message = payload.error ?? payload.message ?? payload.detail;
      if (typeof message === "string" && message.trim().length > 0) {
        return message;
      }
    } catch {
      return "Weather-AI returned an invalid error payload.";
    }
  }

  const text = await response.text();
  return text.trim().length > 0 ? text : "Weather-AI request failed.";
}

export async function GET(
  request: NextRequest,
  context: { params: { segments: string[] } },
) {
  const apiKey = process.env.WEATHER_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  const targetUrl = buildTargetUrl(request, context.params.segments);

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: request.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response);
      return NextResponse.json(
        { error: message },
        { status: response.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = await response.json();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    // Don't return 502 when the client simply disconnected (HMR/fast-refresh)
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request aborted" },
        { status: 499, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { error: "Bad Gateway: unable to reach Weather-AI" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
