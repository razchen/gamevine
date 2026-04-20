const TOKENS: { label: string; cssVar: string; note?: string }[] = [
  { label: 'bg', cssVar: '--color-gv-bg', note: 'page background' },
  { label: 'surface', cssVar: '--color-gv-surface', note: 'card / panel' },
  { label: 'surface-muted', cssVar: '--color-gv-surface-muted', note: 'table row hover, inputs' },
  { label: 'border', cssVar: '--color-gv-border' },
  { label: 'text', cssVar: '--color-gv-text' },
  { label: 'text-muted', cssVar: '--color-gv-text-muted' },
  { label: 'accent', cssVar: '--color-gv-accent', note: 'primary brand action' },
  { label: 'accent-fg', cssVar: '--color-gv-accent-fg' },
  { label: 'accent-2', cssVar: '--color-gv-accent-2', note: 'secondary brand pop' },
  { label: 'success', cssVar: '--color-gv-success', note: 'funded, released' },
  { label: 'warning', cssVar: '--color-gv-warning', note: 'queued, SLA expiring' },
  { label: 'danger', cssVar: '--color-gv-danger', note: 'rejected, destructive' },
  { label: 'credits', cssVar: '--color-gv-credits', note: 'credit amounts everywhere' },
];

function Swatch({ cssVar, label, note }: { cssVar: string; label: string; note?: string }) {
  return (
    <div className="gv-surface gv-border gv-rounded flex flex-col overflow-hidden border">
      <div
        className="h-20 w-full border-b border-[color:var(--color-gv-border)]"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex flex-col gap-0.5 p-3">
        <span className="font-heading text-sm font-semibold">{label}</span>
        <code className="text-[10px] text-[color:var(--color-gv-text-muted)]">{cssVar}</code>
        {note ? (
          <span className="mt-1 text-[11px] text-[color:var(--color-gv-text-muted)]">{note}</span>
        ) : null}
      </div>
    </div>
  );
}

export default function PalettesPage() {
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Palette tokens</h1>
        <p className="text-[color:var(--color-gv-text-muted)]">
          The semantic surface every page is built on. Every theme maps these same thirteen tokens
          to different oklch values. Toggle themes and light/dark in the sidebar to watch them move.
        </p>
      </header>

      <section aria-label="Tokens" className="grid grid-cols-3 gap-3 md:grid-cols-4">
        {TOKENS.map((t) => (
          <Swatch key={t.cssVar} cssVar={t.cssVar} label={t.label} note={t.note} />
        ))}
      </section>

      <section aria-labelledby="combos-heading" className="flex flex-col gap-4">
        <h2 id="combos-heading" className="font-heading text-xl font-semibold">
          Common pairings
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="gv-surface gv-border gv-rounded border p-5">
            <p className="text-xs text-[color:var(--color-gv-text-muted)]">surface + text</p>
            <p className="font-heading mt-2 text-2xl font-semibold">The parry window lands.</p>
            <p className="mt-1 text-sm text-[color:var(--color-gv-text-muted)]">
              Body copy at text-muted, headings at text. Every card in the product looks like this.
            </p>
          </div>
          <div
            className="gv-rounded flex flex-col items-start gap-3 p-5"
            style={{
              backgroundColor: 'var(--color-gv-accent)',
              color: 'var(--color-gv-accent-fg)',
            }}
          >
            <p className="text-xs opacity-80">accent + accent-fg</p>
            <p className="font-heading text-2xl font-semibold">Contribute 50,000 credits</p>
            <p className="text-sm opacity-90">
              The primary CTA. Must read as vibrant, confident, and unambiguously clickable.
            </p>
          </div>
          <div className="gv-chip-success gv-rounded flex flex-col gap-1 p-5">
            <p className="font-heading text-2xl font-semibold">+1,500,000 cr</p>
            <p className="text-sm opacity-90">success — creator plan renewed</p>
          </div>
          <div className="gv-chip-warning gv-rounded flex flex-col gap-1 p-5">
            <p className="font-heading text-2xl font-semibold">3 days left</p>
            <p className="text-sm opacity-90">warning — idea review SLA expiring</p>
          </div>
        </div>
      </section>
    </>
  );
}
