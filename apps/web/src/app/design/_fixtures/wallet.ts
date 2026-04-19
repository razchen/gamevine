export type LedgerType =
  | 'grant.subscription_monthly'
  | 'grant.topup_purchase'
  | 'hold.funding_pledge'
  | 'release.funding_pledge_settled'
  | 'release.funding_pledge_refunded'
  | 'spend.idea_submission'
  | 'spend.game_creation'
  | 'adjust.admin'
  | 'adjust.chargeback';

export type LedgerEntry = {
  id: string;
  type: LedgerType;
  amount: number;
  reason: string;
  refType?: 'RoadmapItem' | 'Idea' | 'Game' | 'Subscription' | 'Topup';
  refLabel?: string;
  createdAt: string;
};

export const CURRENT_BALANCE = 1_847_500;
export const HELD_BALANCE = 85_000;
export const SUBSCRIPTION_TIER = 'Creator';
export const MONTHLY_GRANT = 1_500_000;

export const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: 'l_1',
    type: 'grant.subscription_monthly',
    amount: 1_500_000,
    reason: 'Creator plan — monthly renewal',
    refType: 'Subscription',
    refLabel: 'Creator · Apr 2026',
    createdAt: 'Apr 14, 2026',
  },
  {
    id: 'l_2',
    type: 'hold.funding_pledge',
    amount: -50_000,
    reason: 'Pledged to roadmap item',
    refType: 'RoadmapItem',
    refLabel: 'Third-zone boss with a parry window',
    createdAt: 'Apr 15, 2026',
  },
  {
    id: 'l_3',
    type: 'spend.idea_submission',
    amount: -10_000,
    reason: 'Raw idea submission fee',
    refType: 'Idea',
    refLabel: 'Bramble tower could have a knockback',
    createdAt: 'Apr 15, 2026',
  },
  {
    id: 'l_4',
    type: 'release.funding_pledge_settled',
    amount: -35_000,
    reason: 'Roadmap item released — credits settled',
    refType: 'RoadmapItem',
    refLabel: 'Gamepad coyote-time tuning',
    createdAt: 'Apr 16, 2026',
  },
  {
    id: 'l_5',
    type: 'grant.topup_purchase',
    amount: 250_000,
    reason: 'Top-up purchase',
    refType: 'Topup',
    refLabel: '$10 pack',
    createdAt: 'Apr 17, 2026',
  },
  {
    id: 'l_6',
    type: 'release.funding_pledge_refunded',
    amount: 25_000,
    reason: 'Roadmap item canceled — contributor refund',
    refType: 'RoadmapItem',
    refLabel: 'Expanded map (withdrawn by creator)',
    createdAt: 'Apr 17, 2026',
  },
  {
    id: 'l_7',
    type: 'hold.funding_pledge',
    amount: -35_000,
    reason: 'Pledged to roadmap item',
    refType: 'RoadmapItem',
    refLabel: 'Parallax reef background',
    createdAt: 'Apr 18, 2026',
  },
];
