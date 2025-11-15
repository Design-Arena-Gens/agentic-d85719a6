import JazzComposer from "@/components/JazzComposer";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="grain-overlay pointer-events-none absolute inset-0 z-0" />
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-20 sm:px-12 lg:px-24">
        <header className="space-y-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-brass-400">
            midnight velvet
          </p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl">
            Craft a lush jazz standard in seconds
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-lg text-slate-200/80 sm:text-xl">
            Spin up a smoky lounge arrangement with walking bass, brushed swing
            drums, altered dominants, and lyrical croon — ready for the stage.
          </p>
        </header>
        <JazzComposer />
        <footer className="mt-auto flex flex-col items-center gap-3 text-sm text-slate-300/80 sm:flex-row sm:justify-between">
          <p>Built for impromptu sessions, rehearsals, and late-night inspiration.</p>
          <p>Click “Play Arrangement” and let the band take it from there.</p>
        </footer>
      </section>
    </main>
  );
}
