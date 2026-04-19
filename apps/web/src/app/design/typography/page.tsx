import { Credits } from '../_components/primitives';

export default function TypographyPage() {
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Typography</h1>
        <p className="text-[color:var(--color-gv-text-muted)]">
          The type scale used across product surfaces. Swap the font in the sidebar to compare
          Geist, Plus Jakarta Sans, and Space Grotesk. Numerics are tabular — credits should always
          line up.
        </p>
      </header>

      <section className="gv-surface gv-border gv-rounded flex flex-col gap-6 border p-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
            display · 48/1.05 · font-heading · 600
          </span>
          <p className="font-heading text-5xl leading-[1.05] font-semibold tracking-tight">
            Small games, evolved by the people who play them.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
            h1 · 36/1.1 · font-heading · 600
          </span>
          <p className="font-heading text-4xl font-semibold tracking-tight">Neon Relay — roadmap</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
            h2 · 24/1.25 · font-heading · 600
          </span>
          <p className="font-heading text-2xl font-semibold">Third-zone boss with a parry window</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
            h3 · 18/1.3 · font-heading · 600
          </span>
          <p className="font-heading text-lg font-semibold">
            Enemy wave pacing feels dead between zones 2 and 3
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
            body · 14/1.5
          </span>
          <p className="max-w-2xl text-sm">
            A synth-soaked endless runner where you outrun a rising signal. Funded roadmap: four
            enemy waves, a boss in zone three, and tighter jump arcs. The bramble tower is back
            after community feedback.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
            meta · 11/1.4 · text-muted
          </span>
          <p className="max-w-2xl text-[11px] text-[color:var(--color-gv-text-muted)]">
            Opened by @ribbon · 37 backers · 12 days to funding close · Premium engine
          </p>
        </div>
      </section>

      <section className="gv-surface gv-border gv-rounded flex flex-col gap-4 border p-6">
        <h2 className="font-heading text-xl font-semibold">Numerics &amp; credits</h2>
        <p className="text-sm text-[color:var(--color-gv-text-muted)]">
          Credits use a dedicated color token plus tabular numerals so balances line up in a ledger.
          Sign is visually distinct.
        </p>
        <div className="grid grid-cols-2 gap-6 text-3xl font-semibold md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Credits value={1_847_500} />
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">Balance</span>
          </div>
          <div className="flex flex-col gap-1">
            <Credits value={1_500_000} signed />
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
              Monthly grant
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Credits value={-50_000} signed />
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">Pledge hold</span>
          </div>
          <div className="flex flex-col gap-1">
            <Credits value={85_000} />
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
              Held on pledges
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
