'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coins,
  GamepadIcon,
  HomeIcon,
  LayoutDashboard,
  LibraryBig,
  Palette,
  PlayCircle,
  SquareStack,
  Type,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { Route } from 'next';
import { cn } from '@/lib/utils';

type NavItem = {
  href: Route;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  blurb: string;
};

const ITEMS: NavItem[] = [
  { href: '/design', label: 'Overview', icon: HomeIcon, blurb: 'Welcome + what to look at' },
  { href: '/design/palettes', label: 'Palettes', icon: Palette, blurb: 'Token swatches' },
  { href: '/design/typography', label: 'Typography', icon: Type, blurb: 'Type scale + numerics' },
  {
    href: '/design/components',
    label: 'Components',
    icon: SquareStack,
    blurb: 'Buttons, badges, progress',
  },
  { href: '/design/browse', label: 'Browse', icon: LibraryBig, blurb: 'Game discovery grid' },
  { href: '/design/game', label: 'Game detail', icon: GamepadIcon, blurb: 'Roadmap + funding' },
  { href: '/design/play', label: 'Play', icon: PlayCircle, blurb: 'In-game chrome' },
  {
    href: '/design/manage',
    label: 'Manage',
    icon: LayoutDashboard,
    blurb: 'Creator management',
  },
  { href: '/design/wallet', label: 'Wallet', icon: Coins, blurb: 'Ledger + transactions' },
];

export function DesignNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Design sandbox surfaces" className="flex flex-col gap-0.5">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              'text-[color:var(--color-gv-text-muted)] hover:text-[color:var(--color-gv-text)]',
              'aria-[current=page]:gv-chip-accent aria-[current=page]:font-medium',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="text-[13px]">{item.label}</span>
              <span className="text-[11px] text-[color:var(--color-gv-text-muted)] group-aria-[current=page]:text-[color:var(--color-gv-accent)]/80">
                {item.blurb}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
