import { AlertTriangle } from 'lucide-react';
import { Badge, Credits } from '../_components/primitives';
import { MOCK_IDEAS } from '../_fixtures/ideas';
import { MOCK_RELEASES } from '../_fixtures/releases';
import { FEATURED_GAME } from '../_fixtures/games';

export default function ManagePage() {
  const game = FEATURED_GAME;
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Manage · {game.title}
        </h1>
        <p className="text-[color:var(--color-gv-text-muted)]">
          Creator surface. The two jobs: triage raw ideas against a 14-day SLA, and keep an eye on
          releases. Super Admin sees the same layout with additional rails.
        </p>
      </header>

      <section className="grid grid-cols-4 gap-3">
        <StatTile label="Ideas to review" value="5" note="2 expiring" tone="warning" />
        <StatTile label="Funded & queued" value="3" note="next ships ~2d" />
        <StatTile label="Live releases" value="r14" note="2 days ago" tone="success" />
        <StatTile
          label="Credits earned (30d)"
          value={<Credits value={2_850_000} />}
          note="+12% vs last period"
          tone="credits"
        />
      </section>

      <section aria-labelledby="inbox-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 id="inbox-heading" className="font-heading text-xl font-semibold">
            Idea inbox
          </h2>
          <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
            {MOCK_IDEAS.length} pending · SLA 14 days
          </span>
        </div>
        <div className="gv-surface gv-border gv-rounded divide-y divide-[color:var(--color-gv-border)] overflow-hidden border">
          {MOCK_IDEAS.map((idea) => {
            const slaTone =
              idea.slaDaysRemaining <= 3
                ? 'danger'
                : idea.slaDaysRemaining <= 7
                  ? 'warning'
                  : 'neutral';
            return (
              <article key={idea.id} className="flex items-start gap-4 px-4 py-4">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="accent">{idea.scope}</Badge>
                    <Badge tone={slaTone}>
                      {slaTone === 'danger' ? <AlertTriangle className="size-3" /> : null}
                      {idea.slaDaysRemaining}d left
                    </Badge>
                    {idea.aiFlags.map((flag) => (
                      <span
                        key={flag}
                        className="rounded-full border border-dashed border-[color:var(--color-gv-border)] px-2 py-0.5 text-[10px] text-[color:var(--color-gv-text-muted)]"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-heading text-sm leading-snug font-semibold">{idea.title}</h3>
                  <p className="max-w-2xl text-xs text-[color:var(--color-gv-text-muted)]">
                    &ldquo;{idea.originalText}&rdquo;
                  </p>
                  <p className="text-[11px] text-[color:var(--color-gv-text-muted)]">
                    from {idea.submitter} · {idea.submittedAgo}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    className="gv-chip-danger gv-rounded inline-flex cursor-pointer items-center px-2.5 py-1 text-[11px] font-medium"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="gv-surface-muted gv-rounded inline-flex cursor-pointer items-center px-2.5 py-1 text-[11px] font-medium"
                  >
                    Defer
                  </button>
                  <button
                    type="button"
                    className="gv-accent gv-rounded inline-flex cursor-pointer items-center px-2.5 py-1 text-[11px] font-medium"
                  >
                    Approve → roadmap
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="releases-heading" className="flex flex-col gap-3">
        <h2 id="releases-heading" className="font-heading text-xl font-semibold">
          Release history
        </h2>
        <div className="gv-surface gv-border gv-rounded divide-y divide-[color:var(--color-gv-border)] overflow-hidden border">
          {MOCK_RELEASES.map((release) => {
            const tone =
              release.state === 'published'
                ? 'success'
                : release.state === 'rolled_back'
                  ? 'danger'
                  : 'neutral';
            return (
              <article
                key={release.id}
                className="grid grid-cols-[auto_1fr_auto] items-start gap-4 px-4 py-4"
              >
                <div className="flex flex-col items-start gap-1">
                  <Badge tone={tone}>{release.state.replace('_', ' ')}</Badge>
                  <span className="font-heading text-lg font-semibold">{release.version}</span>
                  <span className="text-[10px] text-[color:var(--color-gv-text-muted)]">
                    {release.commitShort}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {release.roadmapItemTitle ? (
                    <h3 className="font-heading text-sm font-semibold">
                      {release.roadmapItemTitle}
                    </h3>
                  ) : null}
                  <p className="text-xs text-[color:var(--color-gv-text-muted)]">
                    {release.changelog}
                  </p>
                  <p className="text-[11px] text-[color:var(--color-gv-text-muted)]">
                    {release.publishedAt}
                    {release.isCurrent ? ' · current' : ''}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {release.isCurrent ? null : (
                    <button
                      type="button"
                      className="gv-surface gv-border gv-rounded inline-flex cursor-pointer items-center gap-1 border px-2.5 py-1 text-[11px] font-medium"
                    >
                      Roll back to this
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function StatTile({
  label,
  value,
  note,
  tone = 'neutral',
}: {
  label: string;
  value: React.ReactNode;
  note: string;
  tone?: 'neutral' | 'success' | 'warning' | 'credits';
}) {
  const noteClass =
    tone === 'success'
      ? 'text-[color:var(--color-gv-success)]'
      : tone === 'warning'
        ? 'text-[color:var(--color-gv-warning)]'
        : tone === 'credits'
          ? 'gv-credits'
          : 'text-[color:var(--color-gv-text-muted)]';
  return (
    <div className="gv-surface gv-border gv-rounded flex flex-col gap-1 border p-4">
      <span className="text-[11px] font-medium tracking-[0.14em] text-[color:var(--color-gv-text-muted)] uppercase">
        {label}
      </span>
      <span className="font-heading text-2xl font-semibold">{value}</span>
      <span className={`text-[11px] ${noteClass}`}>{note}</span>
    </div>
  );
}
