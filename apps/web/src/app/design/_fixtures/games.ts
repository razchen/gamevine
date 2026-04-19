export type MockGame = {
  slug: string;
  title: string;
  creatorHandle: string;
  template:
    | 'Platformer'
    | 'Top-down shooter'
    | 'Endless runner'
    | 'Puzzle game'
    | 'Flappy-style game'
    | 'Survivor-like game'
    | 'Arcade shooter'
    | 'Breakout / brick breaker'
    | 'Maze chase'
    | 'Lane defense';
  description: string;
  coverHue: number;
  plays7d: number;
  plays30d: number;
  uniquePlayers7d: number;
  releasesShipped: number;
  lastReleaseAt: string;
  state: 'published' | 'dormant';
  tagline: string;
};

export const MOCK_GAMES: MockGame[] = [
  {
    slug: 'neon-relay',
    title: 'Neon Relay',
    creatorHandle: '@fiona',
    template: 'Endless runner',
    description:
      'A synth-soaked endless runner where you outrun a rising signal. Funded roadmap: four enemy waves, a boss in zone three, and tighter jump arcs.',
    coverHue: 215,
    plays7d: 12_430,
    plays30d: 48_112,
    uniquePlayers7d: 3_127,
    releasesShipped: 14,
    lastReleaseAt: '2 days ago',
    state: 'published',
    tagline: 'Outrun the signal.',
  },
  {
    slug: 'brickwave-mature',
    title: 'Brickwave: Mature',
    creatorHandle: '@korjan',
    template: 'Breakout / brick breaker',
    description:
      'Breakout with consequences. Crunchy physics, rain-slicked neon bricks, boss bars that matter.',
    coverHue: 305,
    plays7d: 8_902,
    plays30d: 31_405,
    uniquePlayers7d: 2_411,
    releasesShipped: 21,
    lastReleaseAt: '5 days ago',
    state: 'published',
    tagline: 'Breakout, with weight.',
  },
  {
    slug: 'lane-of-teeth',
    title: 'Lane of Teeth',
    creatorHandle: '@pixelburo',
    template: 'Lane defense',
    description:
      'Three lanes. One jaw. Place thorn towers to slow a tide of bad ideas. Funded this week: a bramble-tower and a rework of wave pacing.',
    coverHue: 140,
    plays7d: 6_041,
    plays30d: 22_780,
    uniquePlayers7d: 1_905,
    releasesShipped: 9,
    lastReleaseAt: '1 day ago',
    state: 'published',
    tagline: 'Three lanes. One jaw.',
  },
  {
    slug: 'paperdoll-peril',
    title: 'Paperdoll Peril',
    creatorHandle: '@hana',
    template: 'Survivor-like game',
    description:
      'A survivor-like played on loose-leaf paper. Scribble weapons, erase-y upgrades, pencil-smudge bosses.',
    coverHue: 35,
    plays7d: 9_215,
    plays30d: 36_007,
    uniquePlayers7d: 2_788,
    releasesShipped: 12,
    lastReleaseAt: '3 days ago',
    state: 'published',
    tagline: 'Survive the syllabus.',
  },
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    creatorHandle: '@vex',
    template: 'Puzzle game',
    description:
      'Route antennae through a garden of interfering plants. 60 hand-built puzzles, three funded difficulty curves.',
    coverHue: 175,
    plays7d: 3_802,
    plays30d: 14_500,
    uniquePlayers7d: 1_055,
    releasesShipped: 6,
    lastReleaseAt: '1 week ago',
    state: 'published',
    tagline: 'Route the signal.',
  },
  {
    slug: 'gull-chase',
    title: 'Gull Chase',
    creatorHandle: '@argo',
    template: 'Maze chase',
    description:
      'Pac-but-gulls. A seaside maze, crumbs you must not drop, and three kinds of tourist to evade.',
    coverHue: 60,
    plays7d: 5_118,
    plays30d: 19_803,
    uniquePlayers7d: 1_611,
    releasesShipped: 8,
    lastReleaseAt: '4 days ago',
    state: 'dormant',
    tagline: 'Do not drop the crumbs.',
  },
];

export const FEATURED_GAME: MockGame = MOCK_GAMES[0];
