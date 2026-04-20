export type LedgerEntryType =
  | 'grant.subscription_monthly'
  | 'grant.topup_purchase'
  | 'hold.funding_pledge'
  | 'release.funding_pledge_settled'
  | 'release.funding_pledge_refunded'
  | 'spend.idea_submission'
  | 'spend.game_creation';

export type LedgerEntry = {
  id: string;
  type: LedgerEntryType;
  amount: number;
  reason: string;
  refLabel?: string;
  createdAt: string;
};

export const CURRENT_BALANCE = 1_847_500;
export const HELD_BALANCE = 85_000;
export const SUBSCRIPTION_TIER = 'Creator';
export const GRANT_TOTAL = 1_500_000;
export const GRANT_SPENT = 105_000;

export const TOPUP_PACKS = [
  { key: 'small', label: 'Small', price: '$3', credits: 50_000 },
  { key: 'medium', label: 'Medium', price: '$10', credits: 250_000 },
  { key: 'large', label: 'Large', price: '$25', credits: 700_000 },
] as const;

export const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: 'l_1',
    type: 'grant.subscription_monthly',
    amount: 1_500_000,
    reason: 'Creator plan — monthly renewal',
    refLabel: 'Creator · Apr 2026',
    createdAt: '2026-04-14',
  },
  {
    id: 'l_2',
    type: 'hold.funding_pledge',
    amount: -50_000,
    reason: 'Pledged to roadmap item',
    refLabel: 'Third-zone boss with a parry window',
    createdAt: '2026-04-15',
  },
  {
    id: 'l_3',
    type: 'spend.idea_submission',
    amount: -10_000,
    reason: 'Raw idea submission fee',
    refLabel: 'Bramble tower could have a knockback',
    createdAt: '2026-04-15',
  },
  {
    id: 'l_4',
    type: 'release.funding_pledge_settled',
    amount: -35_000,
    reason: 'Roadmap item released — credits settled',
    refLabel: 'Gamepad coyote-time tuning',
    createdAt: '2026-04-16',
  },
  {
    id: 'l_5',
    type: 'grant.topup_purchase',
    amount: 250_000,
    reason: 'Top-up purchase',
    refLabel: '$10 pack',
    createdAt: '2026-04-17',
  },
  {
    id: 'l_6',
    type: 'release.funding_pledge_refunded',
    amount: 25_000,
    reason: 'Roadmap item canceled — contributor refund',
    refLabel: 'Expanded map (withdrawn by creator)',
    createdAt: '2026-04-17',
  },
  {
    id: 'l_7',
    type: 'hold.funding_pledge',
    amount: -35_000,
    reason: 'Pledged to roadmap item',
    refLabel: 'Parallax reef background',
    createdAt: '2026-04-18',
  },
  {
    id: 'l_8',
    type: 'spend.game_creation',
    amount: -200_000,
    reason: 'New game creation',
    refLabel: 'Signal Garden',
    createdAt: '2026-04-10',
  },
];

export const LEDGER_TYPE_LABEL: Record<LedgerEntryType, string> = {
  'grant.subscription_monthly': 'Subscription grant',
  'grant.topup_purchase': 'Top-up',
  'hold.funding_pledge': 'Pledge hold',
  'release.funding_pledge_settled': 'Pledge settled',
  'release.funding_pledge_refunded': 'Pledge refunded',
  'spend.idea_submission': 'Idea submission',
  'spend.game_creation': 'Game creation',
};
