import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockRoadmapItem, RoadmapItemState } from '../_fixtures/roadmap';
import { Badge, Credits, Progress } from './primitives';

const STATE_COPY: Record<
  RoadmapItemState,
  { label: string; tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' }
> = {
  approved: { label: 'Approved', tone: 'neutral' },
  funding: { label: 'Funding', tone: 'accent' },
  queued: { label: 'Queued', tone: 'warning' },
  running: { label: 'Running', tone: 'warning' },
  released: { label: 'Released', tone: 'success' },
  'failed-escalated': { label: 'Escalated', tone: 'danger' },
  rejected: { label: 'Rejected', tone: 'danger' },
};

const ENGINE_COPY: Record<MockRoadmapItem['engine'], string> = {
  'engine.fast': 'Fast',
  'engine.balanced': 'Balanced',
  'engine.premium': 'Premium',
};

export function RoadmapItemCard({
  item,
  className,
}: {
  item: MockRoadmapItem;
  className?: string;
}) {
  const stateCopy = STATE_COPY[item.state];
  const fundingPct = item.target > 0 ? (item.funded / item.target) * 100 : 0;
  const isFunding = item.state === 'funding' || item.state === 'approved';
  return (
    <article
      className={cn(
        'gv-surface gv-border gv-rounded flex flex-col gap-3 border p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge tone={stateCopy.tone}>{stateCopy.label}</Badge>
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
              {item.scope}
            </span>
            {item.queuePosition ? (
              <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
                · queue #{item.queuePosition}
              </span>
            ) : null}
          </div>
          <h3 className="font-heading text-sm leading-snug font-semibold">{item.title}</h3>
          <p className="text-xs text-[color:var(--color-gv-text-muted)]">{item.summary}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--color-gv-text-muted)]">
            <Zap className="size-3" />
            {ENGINE_COPY[item.engine]}
          </span>
          <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
            {item.contributors} backers
          </span>
        </div>
      </div>

      {isFunding ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2 text-[11px]">
            <span className="text-[color:var(--color-gv-text-muted)]">
              <Credits value={item.funded} /> of <Credits value={item.target} />
            </span>
            <span className="gv-credits font-semibold">{fundingPct.toFixed(0)}% funded</span>
          </div>
          <Progress value={item.funded} max={item.target} tone="credits" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
              opened by {item.createdBy.handle}
              {item.createdBy.isCreator ? ' (creator)' : ''}
            </span>
            <button
              type="button"
              className="gv-accent gv-rounded inline-flex cursor-pointer items-center gap-1 px-2.5 py-1 text-[11px] font-medium"
            >
              Contribute credits
            </button>
          </div>
        </div>
      ) : item.state === 'released' ? (
        <div className="flex items-center justify-between text-[11px] text-[color:var(--color-gv-text-muted)]">
          <span>Released {item.releasedAt}</span>
          <span>
            Total funded <Credits value={item.funded} />
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] text-[color:var(--color-gv-text-muted)]">
          <span>Funded & waiting</span>
          <span>
            Locked <Credits value={item.funded} />
          </span>
        </div>
      )}
    </article>
  );
}
