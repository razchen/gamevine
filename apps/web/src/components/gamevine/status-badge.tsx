import {
  ArchiveIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  ClockIcon,
  PencilIcon,
  XCircleIcon,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Placeholder status vocabulary for release-style artifacts (pitches,
 * funding rounds, update candidates). The real state machine will come
 * from `packages/shared` once the product flows firm up; until then
 * every surface that shows "queued", "funded", etc. should go through
 * this component so the styling stays synced.
 *
 * Do NOT hard-code colours at call sites — extend this vocabulary here.
 */
export const STATUS_VALUES = [
  'draft',
  'queued',
  'funded',
  'released',
  'cancelled',
  'archived',
] as const;

export type StatusValue = (typeof STATUS_VALUES)[number];

type StatusMeta = {
  label: string;
  icon: LucideIcon;
  /**
   * Tailwind class tuple — background + text + subtle border. All three
   * tokens must exist in `globals.css` (or be sized from there). Dark-mode
   * variants are handled by the shared tokens, not per-status overrides.
   */
  className: string;
};

const STATUS_META: Record<StatusValue, StatusMeta> = {
  draft: {
    label: 'Draft',
    icon: PencilIcon,
    className: 'bg-muted text-muted-foreground border-border',
  },
  queued: {
    label: 'Queued',
    icon: CircleDashedIcon,
    className: 'bg-warning/15 text-warning-foreground border-warning/30 dark:text-warning',
  },
  funded: {
    label: 'Funded',
    icon: ClockIcon,
    className: 'bg-credits/20 text-credits-foreground border-credits/40 dark:text-credits',
  },
  released: {
    label: 'Released',
    icon: CheckCircle2Icon,
    className: 'bg-success text-success-foreground border-transparent',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircleIcon,
    className: 'bg-destructive/10 text-destructive border-destructive/30',
  },
  archived: {
    label: 'Archived',
    icon: ArchiveIcon,
    className: 'bg-muted/60 text-muted-foreground border-border/70',
  },
};

export type StatusBadgeProps = {
  status: StatusValue;
  /**
   * `md` (default) matches shadcn Badge height. `sm` is for dense tables.
   */
  size?: 'sm' | 'md';
  /**
   * Hide the leading icon. Mostly useful when packing many badges into
   * a tight grid.
   */
  hideIcon?: boolean;
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<StatusBadgeProps['size']>, string> = {
  sm: 'h-5 px-1.5 text-[11px] gap-1 [&>svg]:size-3',
  md: 'h-6 px-2 text-xs gap-1.5 [&>svg]:size-3.5',
};

export function StatusBadge({
  status,
  size = 'md',
  hideIcon = false,
  className,
}: StatusBadgeProps) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      data-slot="status-badge"
      data-status={status}
      data-size={size}
      className={cn(
        'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
        SIZE_CLASSES[size],
        meta.className,
        className,
      )}
    >
      {hideIcon ? null : <Icon aria-hidden="true" />}
      {meta.label}
    </span>
  );
}
