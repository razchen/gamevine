import Link from 'next/link';
import { PlayIcon } from 'lucide-react';

import { CreditChip, PlayerAvatar, StatusBadge } from '@/components/gamevine';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { Game } from '../_data';

const numberFormat = new Intl.NumberFormat('en-US');

/**
 * Local discovery card for the /browse grid. Not promoted to
 * `components/gamevine/` yet — if a second surface starts rendering the
 * same shape, promote it then.
 */
export function GameCard({ game, className }: { game: Game; className?: string }) {
  const coverStyle = {
    backgroundImage: `radial-gradient(circle at 30% 30%, oklch(0.7 0.18 ${game.coverHue}), oklch(0.32 0.1 ${((game.coverHue + 60) % 360).toString()}))`,
  };

  return (
    <Card
      className={cn(
        'hover:ring-primary/30 group relative overflow-hidden transition-shadow hover:ring-2',
        className,
      )}
    >
      <Link
        href={`/game/${game.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Open ${game.title}`}
      />

      <div aria-hidden="true" className="h-36 w-full" style={coverStyle} />

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="text-foreground truncate text-base leading-tight font-semibold">
              {game.title}
            </h3>
            <p className="text-muted-foreground truncate text-xs">
              {game.template} · {game.creator.handle}
            </p>
          </div>
          <StatusBadge status={game.status} size="sm" />
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">{game.tagline}</p>

        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PlayerAvatar name={game.creator.name} size="xs" />
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <PlayIcon aria-hidden="true" className="size-3" />
              {numberFormat.format(game.plays7d)}
            </span>
          </div>
          <CreditChip value={game.totalFunded} size="sm" tone="soft" suffix={null} />
        </div>
      </CardContent>
    </Card>
  );
}
