import type { StatusValue } from '@/components/gamevine';

export type Game = {
  slug: string;
  title: string;
  creator: { handle: string; name: string };
  template: string;
  tagline: string;
  description: string;
  coverHue: number;
  plays7d: number;
  uniquePlayers7d: number;
  releasesShipped: number;
  totalFunded: number;
  lastReleaseAt: string;
  status: StatusValue;
};

export const MOCK_GAMES: Game[] = [
  {
    slug: 'neon-relay',
    title: 'Neon Relay',
    creator: { handle: '@fiona', name: 'Fiona' },
    template: 'Endless runner',
    tagline: 'Outrun the signal.',
    description:
      'A synth-soaked endless runner where you outrun a rising signal. Funded roadmap: four enemy waves, a boss in zone three, and tighter jump arcs.',
    coverHue: 215,
    plays7d: 12_430,
    uniquePlayers7d: 3_127,
    releasesShipped: 14,
    totalFunded: 8_250_000,
    lastReleaseAt: '2 days ago',
    status: 'released',
  },
  {
    slug: 'brickwave-mature',
    title: 'Brickwave: Mature',
    creator: { handle: '@korjan', name: 'Korjan' },
    template: 'Breakout',
    tagline: 'Breakout, with weight.',
    description:
      'Breakout with consequences. Crunchy physics, rain-slicked neon bricks, boss bars that matter.',
    coverHue: 305,
    plays7d: 8_902,
    uniquePlayers7d: 2_411,
    releasesShipped: 21,
    totalFunded: 12_040_000,
    lastReleaseAt: '5 days ago',
    status: 'released',
  },
  {
    slug: 'lane-of-teeth',
    title: 'Lane of Teeth',
    creator: { handle: '@pixelburo', name: 'Pixelburo' },
    template: 'Lane defense',
    tagline: 'Three lanes. One jaw.',
    description:
      'Three lanes. One jaw. Place thorn towers to slow a tide of bad ideas. Funded this week: a bramble-tower and a rework of wave pacing.',
    coverHue: 140,
    plays7d: 6_041,
    uniquePlayers7d: 1_905,
    releasesShipped: 9,
    totalFunded: 4_980_000,
    lastReleaseAt: '1 day ago',
    status: 'funded',
  },
  {
    slug: 'paperdoll-peril',
    title: 'Paperdoll Peril',
    creator: { handle: '@hana', name: 'Hana' },
    template: 'Survivor-like',
    tagline: 'Survive the syllabus.',
    description:
      'A survivor-like played on loose-leaf paper. Scribble weapons, erase-y upgrades, pencil-smudge bosses.',
    coverHue: 35,
    plays7d: 9_215,
    uniquePlayers7d: 2_788,
    releasesShipped: 12,
    totalFunded: 6_720_000,
    lastReleaseAt: '3 days ago',
    status: 'released',
  },
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    creator: { handle: '@vex', name: 'Vex' },
    template: 'Puzzle',
    tagline: 'Route the signal.',
    description:
      'Route antennae through a garden of interfering plants. 60 hand-built puzzles, three funded difficulty curves.',
    coverHue: 175,
    plays7d: 3_802,
    uniquePlayers7d: 1_055,
    releasesShipped: 6,
    totalFunded: 2_150_000,
    lastReleaseAt: '1 week ago',
    status: 'queued',
  },
  {
    slug: 'gull-chase',
    title: 'Gull Chase',
    creator: { handle: '@argo', name: 'Argo' },
    template: 'Maze chase',
    tagline: 'Do not drop the crumbs.',
    description:
      'Pac-but-gulls. A seaside maze, crumbs you must not drop, and three kinds of tourist to evade.',
    coverHue: 60,
    plays7d: 5_118,
    uniquePlayers7d: 1_611,
    releasesShipped: 8,
    totalFunded: 1_845_000,
    lastReleaseAt: '4 days ago',
    status: 'archived',
  },
];

export const SORTS = ['Trending', 'New', 'Most funded this week', 'Most plays'] as const;
