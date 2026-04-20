import { Badge, Credits, Progress } from '../../_components/primitives';

export default function ComponentsPage() {
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Components</h1>
        <p className="text-[color:var(--color-gv-text-muted)]">
          The primitives every page leans on. Judge them per theme: does the accent button feel like
          a call-to-action? Do the state chips carry the right temperature?
        </p>
      </header>

      <section className="gv-surface gv-border gv-rounded flex flex-col gap-5 border p-6">
        <h2 className="font-heading text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="gv-accent gv-rounded inline-flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-medium"
          >
            Contribute 50,000 cr
          </button>
          <button
            type="button"
            className="gv-surface gv-border gv-rounded inline-flex cursor-pointer items-center gap-1 border px-4 py-2 text-sm font-medium"
          >
            Open roadmap
          </button>
          <button
            type="button"
            className="gv-rounded inline-flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-medium text-[color:var(--color-gv-text-muted)] hover:text-[color:var(--color-gv-text)]"
          >
            Cancel
          </button>
          <button
            type="button"
            className="gv-chip-danger gv-rounded inline-flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-medium"
          >
            Withdraw funding
          </button>
        </div>
      </section>

      <section className="gv-surface gv-border gv-rounded flex flex-col gap-5 border p-6">
        <h2 className="font-heading text-xl font-semibold">State chips</h2>
        <div className="flex flex-wrap gap-2">
          <Badge tone="neutral">Draft</Badge>
          <Badge tone="accent">Funding</Badge>
          <Badge tone="warning">Queued</Badge>
          <Badge tone="warning">Running</Badge>
          <Badge tone="success">Released</Badge>
          <Badge tone="success">Published</Badge>
          <Badge tone="danger">Escalated</Badge>
          <Badge tone="danger">Rejected</Badge>
          <Badge tone="credits">Credits</Badge>
        </div>
      </section>

      <section className="gv-surface gv-border gv-rounded flex flex-col gap-5 border p-6">
        <h2 className="font-heading text-xl font-semibold">Progress &amp; funding</h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-heading font-semibold">
                Third-zone boss with a parry window
              </span>
              <span className="gv-credits font-semibold">70%</span>
            </div>
            <Progress value={842_500} max={1_200_000} tone="credits" />
            <div className="flex items-center justify-between text-[11px] text-[color:var(--color-gv-text-muted)]">
              <span>
                <Credits value={842_500} /> of <Credits value={1_200_000} />
              </span>
              <span>37 backers · 12 days to close</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-heading font-semibold">Parallax reef background</span>
              <span className="gv-credits font-semibold">27%</span>
            </div>
            <Progress value={395_500} max={1_450_000} tone="credits" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-heading font-semibold">Gamepad coyote-time fix</span>
              <span className="font-semibold text-[color:var(--color-gv-success)]">Released</span>
            </div>
            <Progress value={120_000} max={120_000} tone="success" />
          </div>
        </div>
      </section>

      <section className="gv-surface gv-border gv-rounded flex flex-col gap-5 border p-6">
        <h2 className="font-heading text-xl font-semibold">Input</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-medium">
            <span className="text-[color:var(--color-gv-text-muted)]">New idea</span>
            <textarea
              defaultValue="A bramble tower could have a tiny knockback every 3s — just 30px. Feels cool."
              rows={3}
              className="gv-surface-muted gv-border gv-rounded border px-3 py-2 text-sm outline-none focus:border-[color:var(--color-gv-accent)] focus:ring-2 focus:ring-[color:var(--color-gv-accent)]/30"
            />
          </label>
          <div className="flex items-center justify-between text-[11px] text-[color:var(--color-gv-text-muted)]">
            <span>
              Costs <Credits value={10_000} /> to submit
            </span>
            <button
              type="button"
              className="gv-accent gv-rounded inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 text-xs font-medium"
            >
              Submit idea
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
