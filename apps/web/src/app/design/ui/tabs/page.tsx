import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function TabsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Tabs"
        description={
          <>
            Segmented control for switching related views. Two visual variants:{' '}
            <code className="font-mono text-xs">default</code> (pill) and{' '}
            <code className="font-mono text-xs">line</code> (underline).
          </>
        }
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Default" description="Pill style. Active tab lifts off the list.">
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-muted-foreground mt-3 text-sm">
                Broad picture of the release — goals, owner, and open questions.
              </p>
            </TabsContent>
            <TabsContent value="roadmap">
              <p className="text-muted-foreground mt-3 text-sm">
                The roadmap items, their funding status, and expected ship dates.
              </p>
            </TabsContent>
            <TabsContent value="stats">
              <p className="text-muted-foreground mt-3 text-sm">
                Plays, contributions, and credits flowing through the release.
              </p>
            </TabsContent>
          </Tabs>
        </ComponentExample>

        <ComponentExample
          title="Line variant"
          description="Underline style. Active tab gets the brand underline."
        >
          <Tabs defaultValue="queued" className="w-full max-w-md">
            <TabsList variant="line">
              <TabsTrigger value="queued">
                Queued <Badge variant="secondary">3</Badge>
              </TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="queued">
              <p className="text-muted-foreground mt-3 text-sm">
                Three releases waiting for the build queue.
              </p>
            </TabsContent>
            <TabsContent value="shipped">
              <p className="text-muted-foreground mt-3 text-sm">
                Everything that&apos;s gone live this month.
              </p>
            </TabsContent>
            <TabsContent value="archived">
              <p className="text-muted-foreground mt-3 text-sm">
                Older releases pulled from the default feed.
              </p>
            </TabsContent>
          </Tabs>
        </ComponentExample>
      </div>
    </>
  );
}
