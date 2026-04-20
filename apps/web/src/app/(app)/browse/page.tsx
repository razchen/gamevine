import { Gamepad2Icon } from 'lucide-react';

import { EmptyState, PageHeader } from '@/components/gamevine';
import { Button } from '@/components/ui/button';

import { GameCard } from './_components/game-card';
import { MOCK_GAMES, SORTS } from './_data';

export default function BrowsePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Browse"
          description="Play small browser games and fund the ideas you want to see next."
        />

        <div className="flex flex-wrap items-center gap-2">
          {SORTS.map((sort, index) => {
            const selected = index === 0;
            return (
              <Button
                key={sort}
                variant={selected ? 'secondary' : 'ghost'}
                size="sm"
                aria-pressed={selected}
              >
                {sort}
              </Button>
            );
          })}
          <span className="text-muted-foreground ml-auto text-xs">
            {MOCK_GAMES.length} games · updated daily
          </span>
        </div>

        {MOCK_GAMES.length === 0 ? (
          <EmptyState
            icon={<Gamepad2Icon />}
            title="No games yet"
            description="Once creators start publishing, they'll show up here."
          />
        ) : (
          <section
            aria-label="Games"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {MOCK_GAMES.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
