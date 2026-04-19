import { Heart, MessageSquare, Share2, Volume2 } from 'lucide-react';
import { Badge, Credits } from '../_components/primitives';
import { FEATURED_GAME } from '../_fixtures/games';

export default function PlayPage() {
  const game = FEATURED_GAME;
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Play surface</h1>
        <p className="text-[color:var(--color-gv-text-muted)]">
          The chrome around an embedded game. In production, the iframe loads from an isolated
          player-bundle subdomain; here it&apos;s a mock. The chrome must feel present without
          stealing attention from the game.
        </p>
      </header>

      <div className="gv-surface gv-border gv-rounded flex flex-col overflow-hidden border">
        <div className="flex items-center gap-3 border-b border-[color:var(--color-gv-border)] px-4 py-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-semibold">{game.title}</span>
              <Badge tone="success">r14</Badge>
            </div>
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
              by {game.creatorHandle} · {game.template}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              aria-label="Mute"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[color:var(--color-gv-text-muted)] hover:bg-[color:var(--color-gv-surface-muted)] hover:text-[color:var(--color-gv-text)]"
            >
              <Volume2 className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[color:var(--color-gv-text-muted)] hover:bg-[color:var(--color-gv-surface-muted)] hover:text-[color:var(--color-gv-text)]"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>

        <div
          aria-label="Game canvas (mock)"
          className="relative flex aspect-video items-center justify-center"
          style={{
            background: `
              radial-gradient(900px 300px at 20% 30%, oklch(0.9 0.22 ${String(game.coverHue)}) 0%, transparent 55%),
              radial-gradient(800px 320px at 80% 80%, oklch(0.78 0.22 ${String((game.coverHue + 60) % 360)}) 0%, transparent 55%),
              linear-gradient(135deg, oklch(0.22 0.12 ${String(game.coverHue)}) 0%, oklch(0.12 0.06 ${String((game.coverHue + 30) % 360)}) 100%)
            `,
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="rounded-full bg-black/40 px-4 py-1.5 text-[11px] tracking-[0.24em] text-white/80 uppercase backdrop-blur">
              Mock canvas
            </span>
            <span className="font-heading text-3xl font-semibold text-white">
              Neon Relay — Zone 02
            </span>
            <span className="text-sm text-white/70">Score: 12,440 · Lives: 3 · Zone: 2/5</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[color:var(--color-gv-border)] px-4 py-3">
          <div className="flex items-center gap-4 text-[11px] text-[color:var(--color-gv-text-muted)]">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 hover:text-[color:var(--color-gv-text)]"
            >
              <Heart className="size-3.5" />
              Liked by 812
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 hover:text-[color:var(--color-gv-text)]"
            >
              <MessageSquare className="size-3.5" />
              41 comments
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="gv-surface gv-border gv-rounded inline-flex cursor-pointer items-center gap-1 border px-3 py-1.5 text-xs font-medium"
            >
              Submit an idea · <Credits value={10_000} />
            </button>
            <button
              type="button"
              className="gv-accent gv-rounded inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 text-xs font-medium"
            >
              Fund the roadmap
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
