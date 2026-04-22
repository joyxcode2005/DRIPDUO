export default function Loading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef2ff_38%,#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-4xl border border-slate-200/70 bg-white/85 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
            <div className="h-4 w-44 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-5 h-10 w-72 animate-pulse rounded-2xl bg-slate-200" />
            <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="px-6 py-6 sm:px-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 gap-px bg-slate-200 md:grid-cols-[1.5fr_1.4fr_1fr]">
                <div className="h-12 animate-pulse bg-white" />
                <div className="h-12 animate-pulse bg-white" />
                <div className="h-12 animate-pulse bg-white" />
                <div className="h-14 animate-pulse bg-white" />
                <div className="h-14 animate-pulse bg-white" />
                <div className="h-14 animate-pulse bg-white" />
                <div className="h-14 animate-pulse bg-white" />
                <div className="h-14 animate-pulse bg-white" />
                <div className="h-14 animate-pulse bg-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}