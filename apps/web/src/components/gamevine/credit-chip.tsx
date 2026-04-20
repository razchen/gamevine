import { CoinsIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Canonical way to display a credits value anywhere in the product. Keeps
 * the chip look consistent with the design tokens (`--credits`) so every
 * surface that shows "1,200 credits" renders the same tone, iconography,
 * and numeric formatting.
 *
 * Server-component safe.
 */
export type CreditChipProps = {
  /**
   * Number of credits. Formatted with `toLocaleString()` so thousands
   * separators follow the caller's locale.
   */
  value: number;
  /**
   * Visual size — `sm` for inline-in-text usage, `md` (default) for most
   * surfaces, `lg` for hero callouts.
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * `solid` = full --credits background (high emphasis, default).
   * `soft`  = tinted background with coloured text (works better inside
   *           dense tables or list rows).
   */
  tone?: 'solid' | 'soft';
  /**
   * Prepend `+` for positive values and `−` for negative values. Useful
   * for deltas ("+1,200"). Zero is rendered without a sign.
   */
  signed?: boolean;
  /**
   * Hide the coin icon (defaults to visible). Handy when chips appear in
   * very dense lists.
   */
  hideIcon?: boolean;
  /**
   * Override the label — defaults to "credits" appended after the number.
   * Pass `null` to render only the number.
   */
  suffix?: ReactNode;
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<CreditChipProps['size']>, string> = {
  sm: 'h-5 px-2 text-[11px] gap-1 [&>svg]:size-3',
  md: 'h-6 px-2.5 text-xs gap-1.5 [&>svg]:size-3.5',
  lg: 'h-7 px-3 text-sm gap-2 [&>svg]:size-4',
};

const TONE_CLASSES: Record<NonNullable<CreditChipProps['tone']>, string> = {
  solid: 'bg-credits text-credits-foreground',
  soft: 'bg-credits/15 text-credits-foreground dark:text-credits',
};

function formatValue(value: number, signed: boolean): string {
  if (!signed || value === 0) return value.toLocaleString();
  return value > 0 ? `+${value.toLocaleString()}` : `−${Math.abs(value).toLocaleString()}`;
}

export function CreditChip({
  value,
  size = 'md',
  tone = 'solid',
  signed = false,
  hideIcon = false,
  suffix = 'credits',
  className,
}: CreditChipProps) {
  return (
    <span
      data-slot="credit-chip"
      data-size={size}
      data-tone={tone}
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap tabular-nums',
        SIZE_CLASSES[size],
        TONE_CLASSES[tone],
        className,
      )}
    >
      {hideIcon ? null : <CoinsIcon aria-hidden="true" />}
      <span className="font-mono">{formatValue(value, signed)}</span>
      {suffix ? <span className="font-sans">{suffix}</span> : null}
    </span>
  );
}
