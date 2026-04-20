import { CoinsIcon, FlameIcon, TrophyIcon, UsersIcon } from 'lucide-react';

import { CreditChip, PageHeader, StatCard } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function StatCardGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Stat card"
        description="Single-metric dashboard tile. Label, large value, optional trend delta, and helper description. Value is a ReactNode so it can host other composites."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Grid of metrics"
          description="Four tiles as they'd appear on a dashboard row."
        >
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard
              label="Active players"
              value="12,480"
              icon={UsersIcon}
              delta={{ value: '8.4%', trend: 'up', label: 'vs. last week' }}
            />
            <StatCard
              label="Credits pledged"
              value={<CreditChip value={1428000} tone="soft" hideIcon size="lg" suffix={null} />}
              icon={CoinsIcon}
              delta={{ value: '1,200', trend: 'down', label: 'vs. last week' }}
              description="Across 38 open updates"
            />
            <StatCard
              label="Hot streak"
              value="6 days"
              icon={FlameIcon}
              delta={{ value: 'same', trend: 'flat', label: 'week-over-week' }}
            />
            <StatCard
              label="Releases this month"
              value="12"
              icon={TrophyIcon}
              description="Funded → released end-to-end"
            />
          </div>
        </ComponentExample>

        <ComponentExample title="Bare metric" description="No delta, no icon — just label + value.">
          <div className="w-full max-w-xs">
            <StatCard label="Average pledge" value="2,400 credits" />
          </div>
        </ComponentExample>

        <ComponentExample
          title="Negative trend"
          description="`down` uses the --destructive palette."
        >
          <div className="w-full max-w-xs">
            <StatCard
              label="Churn"
              value="1.8%"
              icon={UsersIcon}
              delta={{ value: '0.4pp', trend: 'down', label: 'vs. last month' }}
              description="Measured against rolling 30-day cohort"
            />
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
