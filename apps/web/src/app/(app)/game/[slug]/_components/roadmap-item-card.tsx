import { UsersIcon } from 'lucide-react';

import { CreditChip, StatusBadge } from '@/components/gamevine';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { RoadmapItem } from '../_data';

const ENGINE_LABEL: Record<RoadmapItem['engine'], string> = {
  fast: 'Fast engine',
  standard: 'Standard engine',
  deep: 'Deep engine',
};

export function RoadmapItemCard({ item }: { item: RoadmapItem }) {
  const pct = Math.min(100, Math.round((item.funded / item.target) * 100));

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-foreground text-sm font-semibold">{item.title}</h3>
            <p className="text-muted-foreground text-xs">{item.summary}</p>
          </div>
          <StatusBadge status={item.status} size="sm" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[11px]">
            {item.scope}
          </Badge>
          <Badge variant="secondary" className="text-[11px]">
            {ENGINE_LABEL[item.engine]}
          </Badge>
          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <UsersIcon aria-hidden="true" className="size-3" />
            {item.contributors} backers
          </span>
        </div>

        <Progress value={pct} aria-label={`${pct.toString()}% funded`} />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Funded</span>
          <div className="flex items-center gap-1.5">
            <CreditChip value={item.funded} size="sm" tone="soft" suffix={null} />
            <span className="text-muted-foreground">of</span>
            <CreditChip value={item.target} size="sm" tone="soft" suffix={null} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
