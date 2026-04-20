'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import {
  BellIcon,
  CompassIcon,
  InboxIcon,
  LayoutGridIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  WalletIcon,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Signed-in app sidebar. Structure follows
 * `docs/product/app-surfaces-and-navigation.md` — discovery / creator /
 * account / admin, in that order. Disabled items represent launch
 * destinations that exist in the IA but aren't wired up yet; keeping
 * them visible-and-greyed communicates "this is coming" rather than
 * hiding them and surprising users later.
 *
 * Server-component safe. Active-route highlighting happens via a CSS
 * `data-active` attribute derived from `pathname`, passed in by the
 * layout.
 */
type Item =
  | {
      kind: 'link';
      label: string;
      href: Route;
      icon: LucideIcon;
      badge?: ReactNode;
    }
  | {
      kind: 'disabled';
      label: string;
      icon: LucideIcon;
      note?: string;
    };

type Section = { heading: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    heading: 'Discover',
    items: [{ kind: 'link', label: 'Browse', href: '/browse', icon: CompassIcon }],
  },
  {
    heading: 'Creator',
    items: [
      { kind: 'disabled', label: 'Create', icon: SparklesIcon, note: 'Creator tier' },
      { kind: 'disabled', label: 'My games', icon: LayoutGridIcon, note: 'Creator tier' },
    ],
  },
  {
    heading: 'Account',
    items: [
      { kind: 'link', label: 'Wallet', href: '/wallet', icon: WalletIcon },
      { kind: 'disabled', label: 'Inbox', icon: InboxIcon },
      { kind: 'disabled', label: 'Notifications', icon: BellIcon },
      { kind: 'disabled', label: 'Settings', icon: SettingsIcon },
    ],
  },
  {
    heading: 'Admin',
    items: [{ kind: 'disabled', label: 'Moderation', icon: ShieldIcon, note: 'Super admin' }],
  },
];

export type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      data-slot="app-sidebar"
      className={cn(
        'border-border/70 bg-background hidden w-56 shrink-0 border-r lg:block',
        className,
      )}
    >
      <nav aria-label="App sections" className="sticky top-14 flex flex-col gap-6 px-3 py-6">
        {SECTIONS.map((section) => (
          <div key={section.heading} className="flex flex-col gap-1">
            <span className="text-muted-foreground px-2 text-[11px] font-medium tracking-[0.14em] uppercase">
              {section.heading}
            </span>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.label}>
                  <SidebarItem item={item} pathname={pathname} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function SidebarItem({ item, pathname }: { item: Item; pathname?: string }) {
  const Icon = item.icon;

  if (item.kind === 'disabled') {
    return (
      <div
        aria-disabled="true"
        title={item.note}
        className="text-muted-foreground/70 flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-1.5 text-sm"
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.note ? (
          <span className="text-muted-foreground/60 ml-auto text-[10px] tracking-wide uppercase">
            {item.note}
          </span>
        ) : null}
      </div>
    );
  }

  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      data-active={isActive ? 'true' : undefined}
      className={cn(
        'text-foreground/70 hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
        'data-active:bg-muted data-active:text-foreground data-active:font-medium',
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span className="truncate">{item.label}</span>
      {item.badge ? <span className="ml-auto">{item.badge}</span> : null}
    </Link>
  );
}
