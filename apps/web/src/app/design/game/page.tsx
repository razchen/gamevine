import { PlayCircle } from 'lucide-react';
import { GameCoverArt } from '../_components/game-card';
import { Badge, Credits } from '../_components/primitives';
import { RoadmapItemCard } from '../_components/roadmap-item-card';
import { FEATURED_GAME } from '../_fixtures/games';
import { MOCK_ROADMAP } from '../_fixtures/roadmap';

const nf = new Intl.NumberFormat('en-US');

const TABS = ['Roadmap', 'Releases', 'Discussion', 'Stats'] as const;

export default function GameDetailPage() {
  const game = FEATURED_GAME;
  return (
    <>
      <section className="gv-surface gv-border gv-rounded flex flex-col overflow-hidden border">
        <GameCoverArt hue={game.coverHue} className="aspect-[21/7]" />
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge tone="success">Published</Badge>
                <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
                  {game.template} · by {game.creatorHandle}
                </span>
              </div>
              <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight">
                {game.title}
              </h1>
              <p className="max-w-2xl text-[color:var(--color-gv-text-muted)]">
                {game.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                type="button"
                className="gv-accent gv-rounded inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold"
              >
                <PlayCircle className="size-4" />
                Play now
              </button>
              <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
                Last release: {game.lastReleaseAt}
              </span>
            </div>
          </div>
          <dl className="grid grid-cols-4 gap-6 border-t border-[color:var(--color-gv-border)] pt-4 text-sm">
            <div>
              <dt className="text-[11px] text-[color:var(--color-gv-text-muted)] uppercase">
                plays (7d)
              </dt>
              <dd className="font-heading text-xl font-semibold">{nf.format(game.plays7d)}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-[color:var(--color-gv-text-muted)] uppercase">
                unique players (7d)
              </dt>
              <dd className="font-heading text-xl font-semibold">
                {nf.format(game.uniquePlayers7d)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-[color:var(--color-gv-text-muted)] uppercase">
                releases
              </dt>
              <dd className="font-heading text-xl font-semibold">{game.releasesShipped}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-[color:var(--color-gv-text-muted)] uppercase">
                total funded
              </dt>
              <dd className="font-heading text-xl font-semibold">
                <Credits value={8_250_000} />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <nav
        aria-label="Game sections"
        className="flex items-center gap-2 border-b border-[color:var(--color-gv-border)]"
      >
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            data-selected={i === 0 ? 'true' : 'false'}
            className="relative cursor-pointer px-3 py-2.5 text-sm font-medium text-[color:var(--color-gv-text-muted)] after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-transparent data-[selected=true]:text-[color:var(--color-gv-text)] data-[selected=true]:after:bg-[color:var(--color-gv-accent)]"
          >
            {tab}
          </button>
        ))}
      </nav>

      <section aria-label="Roadmap" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Roadmap</h2>
          <button
            type="button"
            className="gv-surface gv-border gv-rounded inline-flex cursor-pointer items-center gap-1 border px-3 py-1.5 text-xs font-medium"
          >
            Submit a new idea · <Credits value={10_000} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {MOCK_ROADMAP.map((item) => (
            <RoadmapItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
