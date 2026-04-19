export type RoadmapItemState =
  | 'approved'
  | 'funding'
  | 'queued'
  | 'running'
  | 'released'
  | 'failed-escalated'
  | 'rejected';

export type RoadmapEngine = 'engine.fast' | 'engine.balanced' | 'engine.premium';

export type MockRoadmapItem = {
  id: string;
  title: string;
  scope: 'balance' | 'enemy' | 'boss' | 'visuals' | 'bug-fix' | 'map' | 'controls';
  summary: string;
  state: RoadmapItemState;
  engine: RoadmapEngine;
  target: number;
  funded: number;
  contributors: number;
  createdBy: { handle: string; isCreator: boolean };
  queuePosition?: number;
  releasedAt?: string;
};

export const MOCK_ROADMAP: MockRoadmapItem[] = [
  {
    id: 'r_1',
    title: 'Third-zone boss with a parry window',
    scope: 'boss',
    summary:
      'Introduce a zone-three boss with telegraphed attacks and a 0.25s parry window. Keep within lane-defense template surfaces.',
    state: 'funding',
    engine: 'engine.premium',
    target: 1_200_000,
    funded: 842_500,
    contributors: 37,
    createdBy: { handle: '@ribbon', isCreator: false },
  },
  {
    id: 'r_2',
    title: 'Enemy wave pacing feels dead between zones 2 and 3',
    scope: 'balance',
    summary:
      'Retune the pacing curve of waves 8-14 so mid-run momentum holds. Keep total wave count unchanged.',
    state: 'queued',
    engine: 'engine.balanced',
    target: 320_000,
    funded: 320_000,
    contributors: 12,
    createdBy: { handle: '@korjan', isCreator: true },
    queuePosition: 1,
  },
  {
    id: 'r_3',
    title: 'New "bramble" tower with area-slow',
    scope: 'enemy',
    summary:
      'Add a bramble tower that applies a radial 35% slow for 2.5s on wave entry. Uses existing tower pool hook.',
    state: 'running',
    engine: 'engine.balanced',
    target: 680_000,
    funded: 680_000,
    contributors: 24,
    createdBy: { handle: '@pixelburo', isCreator: true },
  },
  {
    id: 'r_4',
    title: 'Controls: coyote time feels inconsistent on gamepad',
    scope: 'controls',
    summary:
      'Lift coyote-time window from 60ms to 90ms on gamepad input only; keep keyboard unchanged.',
    state: 'released',
    engine: 'engine.fast',
    target: 120_000,
    funded: 120_000,
    contributors: 5,
    createdBy: { handle: '@fiona', isCreator: true },
    releasedAt: '2 days ago',
  },
  {
    id: 'r_5',
    title: 'Final-wave glitch spawns enemies off-grid',
    scope: 'bug-fix',
    summary:
      'Fix wave 20 spawn offset on ultrawide monitors where lane bounds collapse incorrectly.',
    state: 'approved',
    engine: 'engine.fast',
    target: 90_000,
    funded: 15_000,
    contributors: 2,
    createdBy: { handle: '@mira', isCreator: false },
  },
  {
    id: 'r_6',
    title: 'Parallax background layer for the reef stage',
    scope: 'visuals',
    summary:
      'Add a slow-moving back layer behind reef. Stays within theme + assetSlots; no new asset types.',
    state: 'funding',
    engine: 'engine.premium',
    target: 1_450_000,
    funded: 395_500,
    contributors: 18,
    createdBy: { handle: '@argo', isCreator: true },
  },
];
