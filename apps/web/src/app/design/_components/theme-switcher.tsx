'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DENSITIES,
  DENSITY_LABELS,
  FONTS,
  FONT_LABELS,
  MODES,
  THEMES,
  THEME_LABELS,
  useTheme,
  type DensityId,
  type FontId,
  type ModeId,
  type ThemeId,
} from './theme-provider';

type PillProps<T extends string> = {
  value: T;
  current: T;
  onSelect: (value: T) => void;
  children: React.ReactNode;
};

function Pill<T extends string>({ value, current, onSelect, children }: PillProps<T>) {
  const selected = value === current;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-selected={selected ? 'true' : 'false'}
      onClick={() => {
        onSelect(value);
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
        'cursor-pointer whitespace-nowrap',
        'gv-border',
        'data-[selected=true]:gv-accent data-[selected=true]:border-transparent',
        'data-[selected=false]:text-[color:var(--color-gv-text-muted)] data-[selected=false]:hover:text-[color:var(--color-gv-text)]',
      )}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold tracking-[0.14em] text-[color:var(--color-gv-text-muted)] uppercase">
        {label}
      </span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {children}
      </div>
    </div>
  );
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, mode, font, density, setTheme, setMode, setFont, setDensity } = useTheme();

  return (
    <div
      className={cn(
        'gv-surface gv-border gv-rounded flex flex-col gap-4 border p-4 shadow-sm',
        'ring-1 ring-[color:var(--color-gv-border)]/50',
        className,
      )}
      data-slot="theme-switcher"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-heading text-sm font-semibold">Design sandbox</span>
          <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
            Swap palette, font, and density. Saved in this browser.
          </span>
        </div>
        <button
          type="button"
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => {
            setMode(mode === 'dark' ? 'light' : 'dark');
          }}
          className={cn(
            'gv-border inline-flex h-8 w-8 items-center justify-center rounded-md border',
            'cursor-pointer transition-colors',
            'text-[color:var(--color-gv-text-muted)] hover:text-[color:var(--color-gv-text)]',
          )}
        >
          {mode === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>

      <Group label="Palette">
        {THEMES.map((t: ThemeId) => (
          <Pill key={t} value={t} current={theme} onSelect={setTheme}>
            {THEME_LABELS[t]}
          </Pill>
        ))}
      </Group>

      <Group label="Mode">
        {MODES.map((m: ModeId) => (
          <Pill key={m} value={m} current={mode} onSelect={setMode}>
            {m === 'light' ? 'Light' : 'Dark'}
          </Pill>
        ))}
      </Group>

      <Group label="Font">
        {FONTS.map((f: FontId) => (
          <Pill key={f} value={f} current={font} onSelect={setFont}>
            {FONT_LABELS[f]}
          </Pill>
        ))}
      </Group>

      <Group label="Density">
        {DENSITIES.map((d: DensityId) => (
          <Pill key={d} value={d} current={density} onSelect={setDensity}>
            {DENSITY_LABELS[d]}
          </Pill>
        ))}
      </Group>
    </div>
  );
}
