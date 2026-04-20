import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ComponentExample } from '../_components/component-example';

export default function CardsPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Cards</h1>
        <p className="text-muted-foreground text-sm">
          Elevated surfaces for grouped content. `data-size=&quot;sm&quot;` for denser layouts.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Header + content + footer"
          description="The canonical three-region card."
        >
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Draft release</CardTitle>
              <CardDescription>Feedback window closes in 36 hours.</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Two contributors already left notes. Review before the window closes.
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" size="sm">
                Dismiss
              </Button>
              <Button size="sm">Review</Button>
            </CardFooter>
          </Card>
        </ComponentExample>

        <ComponentExample
          title="Action slot"
          description="Icon action in the header's right column."
        >
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Grant balance</CardTitle>
              <CardDescription>Resets on the 1st.</CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon-sm" aria-label="Options">
                  <MoreHorizontalIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-heading text-2xl font-semibold">12,400</p>
              <p className="text-muted-foreground text-xs">credits available</p>
            </CardContent>
          </Card>
        </ComponentExample>

        <ComponentExample title="Compact" description="size='sm' tightens padding and spacing.">
          <Card size="sm" className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Short update</CardTitle>
              <CardDescription>Compact layout for list views.</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Fits nicely inside feeds and sidebars.
            </CardContent>
          </Card>
        </ComponentExample>

        <ComponentExample
          title="Loading"
          description="Skeleton placeholders preserve the final layout."
        >
          <Card className="w-full max-w-sm">
            <CardHeader>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        </ComponentExample>
      </div>
    </>
  );
}
