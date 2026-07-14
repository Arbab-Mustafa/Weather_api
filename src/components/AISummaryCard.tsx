import { Brain, Sparkles } from "lucide-react";
import type { AISummary, WeatherInsight } from "@/lib/types";

type AISummaryCardProps = {
  aiSummary: AISummary | null;
  insight: WeatherInsight;
};

export function AISummaryCard({ aiSummary, insight }: AISummaryCardProps) {
  const summary = aiSummary?.summary?.trim() ?? insight?.summary ?? "";

  const highlights = aiSummary?.highlights?.length
    ? aiSummary.highlights
    : (insight?.highlights ?? []);

  const updatedAt = aiSummary?.updated_at ?? new Date().toISOString();

  const usingAI = !!aiSummary;

  return (
    <section className="glass-card rounded-[2rem] p-6 shadow-soft">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="card-title">Weather Insights</p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {usingAI ? "AI Weather Summary" : "Weather Overview"}
          </h2>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
            usingAI
              ? "bg-blue-50 text-blue-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {usingAI ? (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              AI Generated
            </>
          ) : (
            <>
              <Brain className="h-3.5 w-3.5" />
              Derived From Forecast
            </>
          )}
        </div>
      </div>

      {/* Summary */}

      <p className="mt-5 text-sm leading-7 text-slate-700">{summary}</p>

      {/* Highlights */}

      {highlights.length > 0 && (
        <ul className="mt-6 space-y-3">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3"
            >
              <span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />

              <span className="text-sm leading-6 text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Last Updated
        </span>

        <span className="text-sm font-medium text-slate-700">
          {new Date(updatedAt).toLocaleString()}
        </span>
      </div>
    </section>
  );
}
