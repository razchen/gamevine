import { GameCard } from '../_components/game-card';
import { MOCK_GAMES } from '../_fixtures/games';

const SORTS = ['Trending', 'New', 'Most funded this week', 'Most plays'] as const;

export default function BrowsePage() {
  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Browse</h1>
        <p className="max-w-2xl text-[color:var(--color-gv-text-muted)]">
          The discovery grid. Visitors land here first. Cards must do three things: read as a game
          (art + title), read as active (plays, releases), and read as trustworthy (creator handle,
          state).
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {SORTS.map((sort, i) => (
          <button
            key={sort}
            type="button"
            data-selected={i === 0 ? 'true' : 'false'}
            className="gv-border gv-rounded data-[selected=true]:gv-accent inline-flex cursor-pointer items-center gap-1 border px-3 py-1.5 text-xs font-medium data-[selected=false]:text-[color:var(--color-gv-text-muted)] data-[selected=true]:border-transparent"
          >
            {sort}
          </button>
        ))}
        <div className="ml-auto text-[11px] text-[color:var(--color-gv-text-muted)]">
          {MOCK_GAMES.length} games · updated daily
        </div>
      </div>

      <section aria-label="Games" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_GAMES.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </section>
    </>
  );
}
