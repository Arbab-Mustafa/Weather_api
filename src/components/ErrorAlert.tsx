'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';

type ErrorAlertProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  const isRateLimit = message.includes('429') || message.toLowerCase().includes('rate limit');

  return (
    <div className="glass-card rounded-3xl border-l-4 border-l-rose-500 p-5 text-slate-800 shadow-soft animate-fadeInUp">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">We could not load weather data</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
            {isRateLimit ? (
              <p className="mt-2 text-sm font-medium text-amber-700">
                Your monthly request limit has been reached. Check X-RateLimit-Reset header for reset time.
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}