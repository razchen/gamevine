import type { StatusValue } from '@/components/gamevine';

import { MOCK_GAMES, type Game } from '../../browse/_data';

export type RoadmapItem = {
  id: string;
  title: string;
  scope: 'balance' | 'enemy' | 'boss' | 'visuals' | 'bug-fix' | 'map' | 'controls';
  summary: string;
  status: StatusValue;
  engine: 'fast' | 'standard' | 'deep';
  target: number;
  funded: number;
  contributors: number;
  createdBy: { handle: string; name: string; isCreator: boolean };
};

export type Release = {
  id: string;
  version: string;
  commitShort: string;
  changelog: string;
  publishedAt: string;
  isCurrent: boolean;
};

export const MOCK_GAMES_BY_SLUG: Record<string, Game> = Object.fromEntries(
  MOCK_GAMES.map((game) => [game.slug, game]),
);

export const MOCK_ROADMAP: RoadmapItem[] = [
  {
    id: 'r_1',
    title: 'Third-zone boss with a parry window',
    scope: 'boss',
    summary:
      'Introduce a zone-three boss with telegraphed attacks and a 0.25s parry window. Keep within template surfaces.',
    status: 'funded',
    engine: 'deep',
    target: 1_200_000,
    funded: 842_500,
    contributors: 37,
    createdBy: { handle: '@ribbon', name: 'Ribbon', isCreator: false },
  },
  {
    id: 'r_2',
    title: 'Enemy wave pacing feels dead between zones 2 and 3',
    scope: 'balance',
    summary:
      'Retune the pacing curve of waves 8-14 so mid-run momentum holds. Keep total wave count unchanged.',
    status: 'queued',
    engine: 'standard',
    target: 320_000,
    funded: 320_000,
    contributors: 12,
    createdBy: { handle: '@korjan', name: 'Korjan', isCreator: true },
  },
  {
    id: 'r_3',
    title: 'New "bramble" tower with area-slow',
    scope: 'enemy',
    summary:
      'Add a bramble tower that applies a radial 35% slow for 2.5s on wave entry. Uses existing tower pool hook.',
    status: 'queued',
    engine: 'standard',
    target: 680_000,
    funded: 680_000,
    contributors: 24,
    createdBy: { handle: '@pixelburo', name: 'Pixelburo', isCreator: true },
  },
  {
    id: 'r_4',
    title: 'Controls: coyote time feels inconsistent on gamepad',
    scope: 'controls',
    summary:
      'Lift coyote-time window from 60ms to 90ms on gamepad input only; keep keyboard unchanged.',
    status: 'released',
    engine: 'fast',
    target: 120_000,
    funded: 120_000,
    contributors: 5,
    createdBy: { handle: '@fiona', name: 'Fiona', isCreator: true },
  },
  {
    id: 'r_5',
    title: 'Final-wave glitch spawns enemies off-grid',
    scope: 'bug-fix',
    summary:
      'Fix wave 20 spawn offset on ultrawide monitors where lane bounds collapse incorrectly.',
    status: 'draft',
    engine: 'fast',
    target: 90_000,
    funded: 15_000,
    contributors: 2,
    createdBy: { handle: '@mira', name: 'Mira', isCreator: false },
  },
];

export const MOCK_RELEASES: Release[] = [
  {
    id: 'rel_14',
    version: 'r14',
    commitShort: '3c1a88f',
    changelog: 'Gamepad coyote-time widened from 60 → 90ms. Keyboard unchanged.',
    publishedAt: '2 days ago',
    isCurrent: true,
  },
  {
    id: 'rel_13',
    version: 'r13',
    commitShort: 'a0d42e1',
    changelog: 'Bramble tower pacing tuned. Reduced sparkle FX on low-spec devices.',
    publishedAt: '6 days ago',
    isCurrent: false,
  },
  {
    id: 'rel_12',
    version: 'r12',
    commitShort: '5e7b201',
    changelog: 'Attempted parallax layer — reverted by creator (visual drift on wide screens).',
    publishedAt: '9 days ago',
    isCurrent: false,
  },
  {
    id: 'rel_11',
    version: 'r11',
    commitShort: '9a18c70',
    changelog: 'Initial bramble tower implementation.',
    publishedAt: '13 days ago',
    isCurrent: false,
  },
];
