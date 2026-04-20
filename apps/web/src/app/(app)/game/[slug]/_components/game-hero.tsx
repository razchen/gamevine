import { PlayIcon } from 'lucide-react';

import { PlayerAvatar, Prose, StatusBadge } from '@/components/gamevine';
import { Button } from '@/components/ui/button';

import type { Game } from '../../../browse/_data';

export function GameHero({ game }: { game: Game }) {
  const coverStyle = {
    backgroundImage: `radial-gradient(circle at 25% 20%, oklch(0.72 0.18 ${game.coverHue}), oklch(0.28 0.1 ${((game.coverHue + 60) % 360).toString()}))`,
  };

  return (
    <section className="border-border/70 bg-card overflow-hidden rounded-2xl border">
      <div aria-hidden="true" className="aspect-[21/7] w-full" style={coverStyle} />
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={game.status} />
              <span className="text-muted-foreground text-xs">
                {game.template} · by {game.creator.handle}
              </span>
            </div>
            <h1 className="text-foreground text-3xl leading-tight font-semibold tracking-tight lg:text-4xl">
              {game.title}
            </h1>
            <Prose size="base" className="text-muted-foreground">
              <p>{game.description}</p>
            </Prose>
            <div className="flex items-center gap-2">
              <PlayerAvatar name={game.creator.name} size="sm" />
              <span className="text-muted-foreground text-sm">{game.creator.name}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
            <Button size="lg">
              <PlayIcon data-icon="inline-start" />
              Play now
            </Button>
            <span className="text-muted-foreground text-xs">
              Last release · {game.lastReleaseAt}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
