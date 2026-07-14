export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card rounded-3xl p-6">
        <div className="h-5 w-36 rounded-full bg-slate-200" />
        <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl bg-slate-100 p-6">
            <div className="h-4 w-24 rounded-full bg-slate-200" />
            <div className="mt-6 h-16 w-40 rounded-2xl bg-slate-200" />
            <div className="mt-4 h-4 w-56 rounded-full bg-slate-200" />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="h-20 rounded-2xl bg-slate-200" />
              <div className="h-20 rounded-2xl bg-slate-200" />
              <div className="h-20 rounded-2xl bg-slate-200" />
            </div>
          </div>
          <div className="rounded-3xl bg-slate-100 p-6">
            <div className="h-4 w-28 rounded-full bg-slate-200" />
            <div className="mt-4 h-40 rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="mt-4 h-72 rounded-3xl bg-slate-100" />
        </div>
        <div className="glass-card rounded-3xl p-6">
          <div className="h-4 w-40 rounded-full bg-slate-200" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
            <div className="h-4 w-2/3 rounded-full bg-slate-100" />
            <div className="mt-6 h-24 rounded-3xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
