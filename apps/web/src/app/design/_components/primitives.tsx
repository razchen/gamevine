import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase',
  {
    variants: {
      tone: {
        neutral: 'gv-surface-muted gv-border border text-[color:var(--color-gv-text-muted)]',
        accent: 'gv-chip-accent',
        success: 'gv-chip-success',
        warning: 'gv-chip-warning',
        danger: 'gv-chip-danger',
        credits: 'gv-chip-credits',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

type ProgressProps = {
  value: number;
  max: number;
  label?: string;
  className?: string;
  tone?: 'accent' | 'credits' | 'success';
};

export function Progress({ value, max, label, className, tone = 'credits' }: ProgressProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const fillColor =
    tone === 'accent'
      ? 'var(--color-gv-accent)'
      : tone === 'success'
        ? 'var(--color-gv-success)'
        : 'var(--color-gv-credits)';
  return (
    <div
      className={cn('flex w-full flex-col gap-1.5', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? 'progress'}
    >
      {label ? (
        <div className="flex items-center justify-between text-[11px] text-[color:var(--color-gv-text-muted)]">
          <span>{label}</span>
          <span className="font-variant-numeric-tabular">{pct.toFixed(0)}%</span>
        </div>
      ) : null}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-gv-surface-muted)]">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct.toFixed(2)}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}

type CreditsProps = {
  value: number;
  signed?: boolean;
  className?: string;
};

const creditsFormatter = new Intl.NumberFormat('en-US');

export function Credits({ value, signed = false, className }: CreditsProps) {
  const display = signed
    ? value > 0
      ? `+${creditsFormatter.format(value)}`
      : creditsFormatter.format(value)
    : creditsFormatter.format(Math.abs(value));
  return (
    <span className={cn('gv-credits font-medium', className)} data-slot="credits">
      {display}
      <span className="ml-1 text-[10px] font-normal tracking-wider uppercase opacity-70">cr</span>
    </span>
  );
}
