import { ArrowDownIcon, ArrowUpIcon, MinusIcon, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Summary tile for dashboards. One metric per card — label up top, value
 * large, optional trend delta and helper description below. `value` is a
 * `ReactNode` so callers can drop a `<CreditChip />` or any other composite
 * in there instead of a raw string.
 *
 * Server-component safe.
 */
export type StatCardDelta = {
  /** Value shown inline next to the arrow (e.g. "12%", "+1.2k", "3 days"). */
  value: ReactNode;
  /**
   * `up` / `down` colour the delta and pick the arrow.
   * `flat` uses the muted palette and a bar glyph.
   */
  trend: 'up' | 'down' | 'flat';
  /**
   * Label read by screen readers to describe the delta context
   * ("vs. last week"). Renders visually after the value.
   */
  label?: ReactNode;
};

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  delta?: StatCardDelta;
  icon?: LucideIcon;
  className?: string;
};

const TREND_CLASSES: Record<StatCardDelta['trend'], string> = {
  up: 'text-success',
  down: 'text-destructive',
  flat: 'text-muted-foreground',
};

const TREND_ICONS: Record<StatCardDelta['trend'], LucideIcon> = {
  up: ArrowUpIcon,
  down: ArrowDownIcon,
  flat: MinusIcon,
};

export function StatCard({
  label,
  value,
  description,
  delta,
  icon: Icon,
  className,
}: StatCardProps) {
  const TrendIcon = delta ? TREND_ICONS[delta.trend] : null;

  return (
    <div
      data-slot="stat-card"
      className={cn(
        'border-border/70 bg-card text-card-foreground flex flex-col gap-3 rounded-xl border p-4 shadow-xs',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
        {Icon ? <Icon aria-hidden="true" className="text-muted-foreground size-4" /> : null}
      </div>

      <div className="text-foreground text-2xl leading-none font-semibold tabular-nums">
        {value}
      </div>

      {delta || description ? (
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {delta && TrendIcon ? (
            <span
              data-slot="stat-card-delta"
              data-trend={delta.trend}
              className={cn(
                'inline-flex items-center gap-1 font-medium tabular-nums',
                TREND_CLASSES[delta.trend],
              )}
            >
              <TrendIcon aria-hidden="true" className="size-3" />
              {delta.value}
              {delta.label ? (
                <span className="text-muted-foreground font-normal">{delta.label}</span>
              ) : null}
            </span>
          ) : null}
          {description ? <span>{description}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
