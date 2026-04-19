export type IdeaState = 'pending-review' | 'approved' | 'rejected' | 'held-moderation';

export type MockIdea = {
  id: string;
  title: string;
  originalText: string;
  submitter: string;
  submittedAgo: string;
  state: IdeaState;
  aiFlags: string[];
  scope: 'balance' | 'enemy' | 'boss' | 'visuals' | 'bug-fix' | 'map' | 'controls';
  slaDaysRemaining: number;
};

export const MOCK_IDEAS: MockIdea[] = [
  {
    id: 'i_1',
    title: 'Parallax background for the reef stage',
    originalText:
      'the reef level feels flat?? maybe a slow-moving layer in the back, like how old arcade shooters did it. Something subtle, not too busy.',
    submitter: '@ribbon',
    submittedAgo: '6 hours ago',
    state: 'pending-review',
    aiFlags: [],
    scope: 'visuals',
    slaDaysRemaining: 14,
  },
  {
    id: 'i_2',
    title: 'Bramble tower could have a knockback',
    originalText:
      'my bramble tower never kills stuff, only slows. could it have a tiny knockback every 3s? even just 30px. feels cool.',
    submitter: '@mira',
    submittedAgo: '1 day ago',
    state: 'pending-review',
    aiFlags: ['similar-to-r_3'],
    scope: 'enemy',
    slaDaysRemaining: 13,
  },
  {
    id: 'i_3',
    title: 'Please add an ending cutscene',
    originalText:
      'i beat wave 20 and the game just... stops. no ending screen, no credits. feels unfinished.',
    submitter: '@korjan',
    submittedAgo: '2 days ago',
    state: 'pending-review',
    aiFlags: ['ai-suggests:out-of-template'],
    scope: 'visuals',
    slaDaysRemaining: 12,
  },
  {
    id: 'i_4',
    title: 'Pause menu needs a restart button',
    originalText:
      'small thing — the pause menu doesnt have a "restart run" option. you have to die to try again.',
    submitter: '@hana',
    submittedAgo: '4 days ago',
    state: 'pending-review',
    aiFlags: [],
    scope: 'controls',
    slaDaysRemaining: 10,
  },
  {
    id: 'i_5',
    title: 'Gull AI feels psychic on hard mode',
    originalText:
      'on hard the gulls seem to know where youre going before you do. maybe add a tiny reaction delay?',
    submitter: '@vex',
    submittedAgo: '11 days ago',
    state: 'pending-review',
    aiFlags: ['sla-expiring'],
    scope: 'balance',
    slaDaysRemaining: 3,
  },
];
