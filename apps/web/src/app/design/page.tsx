import Link from 'next/link';
import type { Route } from 'next';
import type { ComponentType, SVGProps } from 'react';
import {
  Coins,
  GamepadIcon,
  LibraryBig,
  LayoutDashboard,
  Palette,
  PlayCircle,
  SquareStack,
  Type,
} from 'lucide-react';
import { THEME_BLURBS, THEME_LABELS, THEMES } from './_components/theme-constants';

type SurfaceCard = {
  href: Route;
  label: string;
  blurb: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const SURFACES: SurfaceCard[] = [
  {
    href: '/design/palettes',
    label: 'Palettes',
    blurb: 'Every semantic token in every theme · light and dark.',
    icon: Palette,
  },
  {
    href: '/design/typography',
    label: 'Typography',
    blurb: 'Type scale, numerics, credit formatting, heading pairing.',
    icon: Type,
  },
  {
    href: '/design/components',
    label: 'Components',
    blurb: 'Buttons, badges, progress — how the primitives feel in each theme.',
    icon: SquareStack,
  },
  {
    href: '/design/browse',
    label: 'Browse',
    blurb: 'The discovery grid. Games, stats, state chips.',
    icon: LibraryBig,
  },
  {
    href: '/design/game',
    label: 'Game detail',
    blurb: 'Roadmap with funding progress, contribution CTA.',
    icon: GamepadIcon,
  },
  {
    href: '/design/play',
    label: 'Play',
    blurb: 'The chrome around an embedded game runtime.',
    icon: PlayCircle,
  },
  {
    href: '/design/manage',
    label: 'Manage',
    blurb: 'Creator surface: idea queue, release history, stats.',
    icon: LayoutDashboard,
  },
  {
    href: '/design/wallet',
    label: 'Wallet',
    blurb: 'Balances, monthly grant, append-only ledger.',
    icon: Coins,
  },
];

export default function DesignHomePage() {
  return (
    <>
      <header className="flex flex-col gap-3">
        <span className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
          Sandbox
        </span>
        <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight">
          Pick the personality.
        </h1>
        <p className="max-w-xl text-[color:var(--color-gv-text-muted)]">
          Four candidate palettes, all vibrant and energetic, all different. Switch themes in the
          sidebar and walk through the surfaces below. Your selection is saved locally — no server
          round-trip.
        </p>
      </header>

      <section aria-labelledby="themes-heading" className="flex flex-col gap-4">
        <h2 id="themes-heading" className="font-heading text-xl font-semibold">
          The four themes
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((id) => (
            <article
              key={id}
              className="gv-surface gv-border gv-rounded flex flex-col gap-3 border p-4"
            >
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[color:var(--color-gv-accent)]" />
                <span className="h-3 w-3 rounded-full bg-[color:var(--color-gv-accent-2)]" />
                <span className="h-3 w-3 rounded-full bg-[color:var(--color-gv-credits)]" />
                <span className="h-3 w-3 rounded-full bg-[color:var(--color-gv-success)]" />
                <span className="ml-auto text-[10px] font-semibold tracking-[0.2em] text-[color:var(--color-gv-text-muted)] uppercase">
                  data-theme=&quot;{id}&quot;
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading text-base font-semibold">{THEME_LABELS[id]}</h3>
                <p className="text-xs text-[color:var(--color-gv-text-muted)]">
                  {THEME_BLURBS[id]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="surfaces-heading" className="flex flex-col gap-4">
        <h2 id="surfaces-heading" className="font-heading text-xl font-semibold">
          Walk the product
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {SURFACES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="gv-surface gv-border gv-rounded flex items-start gap-3 border p-4 transition-colors hover:border-[color:var(--color-gv-accent)]"
              >
                <span className="gv-chip-accent flex h-9 w-9 items-center justify-center rounded-md">
                  <Icon className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="font-heading text-sm font-semibold">{s.label}</span>
                  <span className="text-xs text-[color:var(--color-gv-text-muted)]">{s.blurb}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
