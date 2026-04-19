import { Play, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockGame } from '../_fixtures/games';
import { Badge } from './primitives';

const nf = new Intl.NumberFormat('en-US');

export function GameCoverArt({ hue, className }: { hue: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('relative aspect-[16/9] w-full overflow-hidden', className)}
      style={{
        background: `
          radial-gradient(1200px 400px at 18% 20%, oklch(0.9 0.2 ${String(hue)}) 0%, transparent 55%),
          radial-gradient(800px 320px at 85% 80%, oklch(0.78 0.22 ${String((hue + 60) % 360)}) 0%, transparent 55%),
          linear-gradient(135deg, oklch(0.25 0.15 ${String(hue)}) 0%, oklch(0.14 0.08 ${String((hue + 30) % 360)}) 100%)
        `,
      }}
    >
      <div className="absolute inset-0 [background-image:radial-gradient(oklch(1_0_0/.5)_1px,transparent_1px)] [background-size:14px_14px] opacity-30 mix-blend-overlay" />
    </div>
  );
}

export function GameCard({ game, className }: { game: MockGame; className?: string }) {
  return (
    <article
      className={cn(
        'gv-surface gv-border gv-rounded group/card flex flex-col overflow-hidden border shadow-sm transition-shadow',
        'hover:shadow-md',
        className,
      )}
    >
      <GameCoverArt hue={game.coverHue} />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-heading text-base leading-tight font-semibold">{game.title}</h3>
            <p className="text-[11px] text-[color:var(--color-gv-text-muted)]">
              by {game.creatorHandle} · {game.template}
            </p>
          </div>
          <Badge tone={game.state === 'published' ? 'success' : 'warning'}>{game.state}</Badge>
        </div>
        <p className="line-clamp-2 text-xs text-[color:var(--color-gv-text-muted)]">
          {game.tagline}
        </p>
        <div className="flex items-center gap-4 text-[11px] text-[color:var(--color-gv-text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Play className="size-3.5" />
            {nf.format(game.plays7d)} / 7d
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" />
            {nf.format(game.uniquePlayers7d)}
          </span>
          <span className="ml-auto">{game.releasesShipped} releases</span>
        </div>
      </div>
    </article>
  );
}
