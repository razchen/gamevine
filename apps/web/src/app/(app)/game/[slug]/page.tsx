import { notFound } from 'next/navigation';
import { MessageCircleIcon, SparklesIcon } from 'lucide-react';

import { CreditChip, EmptyState, StatCard } from '@/components/gamevine';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GameHero } from './_components/game-hero';
import { RoadmapItemCard } from './_components/roadmap-item-card';
import { MOCK_GAMES_BY_SLUG, MOCK_RELEASES, MOCK_ROADMAP } from './_data';

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = MOCK_GAMES_BY_SLUG[slug];
  if (!game) notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <GameHero game={game} />

      <section aria-label="Key stats" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Plays · 7d" value={game.plays7d.toLocaleString()} />
        <StatCard label="Unique players · 7d" value={game.uniquePlayers7d.toLocaleString()} />
        <StatCard label="Releases shipped" value={game.releasesShipped} />
        <StatCard
          label="Total funded"
          value={<CreditChip value={game.totalFunded} size="lg" tone="solid" suffix={null} />}
        />
      </section>

      <Tabs defaultValue="roadmap" className="gap-6">
        <TabsList>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="releases">Releases</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-foreground text-lg font-semibold">Roadmap</h2>
            <Button variant="outline" size="sm" disabled title="Sign in to submit an idea">
              Submit idea · <CreditChip value={10_000} size="sm" tone="soft" suffix={null} />
            </Button>
          </div>
          {MOCK_ROADMAP.length === 0 ? (
            <EmptyState
              icon={<SparklesIcon />}
              title="No roadmap items yet"
              description="Be the first to submit an idea for this game."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {MOCK_ROADMAP.map((item) => (
                <RoadmapItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="releases" className="flex flex-col gap-3">
          <h2 className="text-foreground text-lg font-semibold">Releases</h2>
          <Card size="sm">
            <CardContent className="flex flex-col divide-y">
              {MOCK_RELEASES.map((release) => (
                <div key={release.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground font-mono text-sm font-semibold">
                      {release.version}
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {release.commitShort}
                    </span>
                    {release.isCurrent ? (
                      <Badge variant="secondary" className="text-[10px]">
                        current
                      </Badge>
                    ) : null}
                    <span className="text-muted-foreground ml-auto text-xs">
                      {release.publishedAt}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{release.changelog}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussion">
          <EmptyState
            icon={<MessageCircleIcon />}
            title="Discussion is quiet"
            description="Discussion threads open after the next release lands."
          />
        </TabsContent>

        <TabsContent value="stats">
          <EmptyState
            title="Detailed stats coming soon"
            description="Granular play and funding analytics will live here."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
