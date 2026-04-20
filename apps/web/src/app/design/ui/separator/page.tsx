import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function SeparatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Separator"
        description={
          <>
            Horizontal or vertical divider tied to the --border token. Semantic — avoids the ad-hoc{' '}
            <code className="font-mono text-xs">&lt;div class=&quot;border-t&quot;&gt;</code>{' '}
            sprinkled throughout feature code.
          </>
        }
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Horizontal" description="Default orientation.">
          <div className="flex w-full max-w-sm flex-col gap-3">
            <div className="text-sm">Profile</div>
            <Separator />
            <div className="text-sm">Billing</div>
            <Separator />
            <div className="text-sm">Sessions</div>
          </div>
        </ComponentExample>

        <ComponentExample
          title="Vertical"
          description="Add `orientation='vertical'` and stretch the parent."
        >
          <div className="flex h-12 items-center gap-4">
            <span className="text-sm">Overview</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Activity</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Settings</span>
          </div>
        </ComponentExample>

        <ComponentExample
          title="Label break"
          description="Separator with an inline label — common in long forms."
        >
          <div className="flex w-full max-w-sm items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs tracking-wider uppercase">or</span>
            <Separator className="flex-1" />
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
