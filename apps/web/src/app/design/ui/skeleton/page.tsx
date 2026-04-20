import { Skeleton } from '@/components/ui/skeleton';
import { ComponentExample } from '../_components/component-example';

export default function SkeletonPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Skeleton</h1>
        <p className="text-muted-foreground text-sm">
          Animated placeholders that preserve final layout. Composed from `--muted` with a pulsing
          animation.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample title="Lines" description="Rectangular placeholders.">
          <div className="flex w-full max-w-md flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </ComponentExample>

        <ComponentExample title="Avatar + text" description="Row pattern for comments / lists.">
          <div className="flex w-full max-w-md items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </ComponentExample>

        <ComponentExample title="Card shape" description="Whole-card placeholder.">
          <div className="border-border bg-card flex w-full max-w-sm flex-col gap-3 rounded-xl border p-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </ComponentExample>

        <ComponentExample title="Paragraph" description="Multi-line text placeholder.">
          <div className="flex w-full max-w-md flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3" style={{ width: `${60 + ((i * 13) % 40)}%` }} />
            ))}
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
