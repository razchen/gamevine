import { ArrowDownLeft, ArrowUpRight, Circle, RotateCcw } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/utils';
import type { LedgerEntry, LedgerType } from '../_fixtures/wallet';
import { Badge, Credits } from './primitives';

type Variant = {
  label: string;
  tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'credits';
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const TYPE_META: Record<LedgerType, Variant> = {
  'grant.subscription_monthly': {
    label: 'Subscription grant',
    tone: 'success',
    icon: ArrowDownLeft,
  },
  'grant.topup_purchase': { label: 'Top-up', tone: 'success', icon: ArrowDownLeft },
  'hold.funding_pledge': { label: 'Pledge hold', tone: 'warning', icon: ArrowUpRight },
  'release.funding_pledge_settled': { label: 'Pledge settled', tone: 'credits', icon: Circle },
  'release.funding_pledge_refunded': { label: 'Pledge refunded', tone: 'accent', icon: RotateCcw },
  'spend.idea_submission': { label: 'Idea fee', tone: 'neutral', icon: ArrowUpRight },
  'spend.game_creation': { label: 'Game creation', tone: 'neutral', icon: ArrowUpRight },
  'adjust.admin': { label: 'Adjustment', tone: 'danger', icon: RotateCcw },
  'adjust.chargeback': { label: 'Chargeback', tone: 'danger', icon: RotateCcw },
};

export function LedgerRow({ entry, className }: { entry: LedgerEntry; className?: string }) {
  const meta = TYPE_META[entry.type];
  const Icon = meta.icon;
  const positive = entry.amount > 0;
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[color:var(--color-gv-border)] px-4 py-3 last:border-b-0',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          positive ? 'gv-chip-success' : 'gv-surface-muted',
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          {entry.refLabel ? (
            <span className="truncate text-[11px] text-[color:var(--color-gv-text-muted)]">
              {entry.refLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate text-xs text-[color:var(--color-gv-text-muted)]">
          {entry.reason} · {entry.createdAt}
        </p>
      </div>
      <Credits value={entry.amount} signed />
    </div>
  );
}
