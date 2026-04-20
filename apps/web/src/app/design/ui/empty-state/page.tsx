import { InboxIcon, PlusIcon, SparklesIcon, UsersIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState, PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function EmptyStateGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Empty state"
        description="Quiet placeholder for zero-data surfaces. Dashed border so it reads as a gap, not a real card."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Default"
          description="Icon + copy + primary CTA — the canonical shape."
        >
          <div className="w-full max-w-sm">
            <EmptyState
              icon={<SparklesIcon />}
              title="No updates yet"
              description="Pitch your first community update to get the funding wheel spinning."
              action={
                <Button size="sm">
                  <PlusIcon />
                  New update
                </Button>
              }
            />
          </div>
        </ComponentExample>

        <ComponentExample
          title="Copy only"
          description="When a CTA would feel pushy (read-only views, search results)."
        >
          <div className="w-full max-w-sm">
            <EmptyState
              icon={<InboxIcon />}
              title="Inbox zero"
              description="You're all caught up. New messages land here automatically."
            />
          </div>
        </ComponentExample>

        <ComponentExample
          title="Without icon"
          description="Compact layout for inline empty sections (sidebar panels, card bodies)."
        >
          <div className="w-full max-w-sm">
            <EmptyState
              title="No teammates yet"
              description="Invite collaborators to funds, votes, and release planning."
              action={
                <Button size="sm" variant="outline">
                  <UsersIcon />
                  Invite teammates
                </Button>
              }
            />
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
