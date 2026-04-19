export type ReleaseState = 'published' | 'superseded' | 'rolled_back';

export type MockRelease = {
  id: string;
  version: string;
  commitShort: string;
  state: ReleaseState;
  changelog: string;
  roadmapItemTitle?: string;
  publishedAt: string;
  isCurrent: boolean;
};

export const MOCK_RELEASES: MockRelease[] = [
  {
    id: 'rel_14',
    version: 'r14',
    commitShort: '3c1a88f',
    state: 'published',
    changelog: 'Gamepad coyote-time widened from 60 → 90ms. Keyboard unchanged.',
    roadmapItemTitle: 'Controls: coyote time feels inconsistent on gamepad',
    publishedAt: '2 days ago',
    isCurrent: true,
  },
  {
    id: 'rel_13',
    version: 'r13',
    commitShort: 'a0d42e1',
    state: 'superseded',
    changelog: 'Bramble tower pacing tuned. Reduced sparkle FX on low-spec devices.',
    roadmapItemTitle: 'Bramble tower tuning pass',
    publishedAt: '6 days ago',
    isCurrent: false,
  },
  {
    id: 'rel_12',
    version: 'r12',
    commitShort: '5e7b201',
    state: 'rolled_back',
    changelog: 'Attempted parallax layer — reverted by creator (visual drift on wide screens).',
    roadmapItemTitle: 'Parallax background trial',
    publishedAt: '9 days ago',
    isCurrent: false,
  },
  {
    id: 'rel_11',
    version: 'r11',
    commitShort: '9a18c70',
    state: 'superseded',
    changelog: 'Initial bramble tower implementation.',
    roadmapItemTitle: 'New "bramble" tower with area-slow',
    publishedAt: '13 days ago',
    isCurrent: false,
  },
];
