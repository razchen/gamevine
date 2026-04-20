import type { ReactNode } from 'react';

import { AppHeader, AppSidebar } from '@/components/gamevine';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
