'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

const SIDES = ['right', 'left', 'top', 'bottom'] as const;

export default function SheetPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Sheet"
        description="Edge-anchored drawer built on Dialog. Portaled — previews render against the live theme only. Prefer Sheet over Dialog for multi-field edit forms or navigation panels."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Edit form"
          description="Side-anchored edit sheet with header / body / footer."
          unportaled={false}
        >
          <Sheet>
            <SheetTrigger render={<Button variant="outline">Edit profile</Button>} />
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&apos;re done.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3 px-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Ada Lovelace" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@ada" />
                </div>
              </div>
              <SheetFooter>
                <Button>Save changes</Button>
                <SheetClose render={<Button variant="outline">Cancel</Button>} />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </ComponentExample>

        <ComponentExample
          title="Sides"
          description="Drawers can anchor to any edge. Left/right are most common."
          unportaled={false}
        >
          <div className="flex flex-wrap items-center gap-2">
            {SIDES.map((side) => (
              <Sheet key={side}>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="sm">
                      {side}
                    </Button>
                  }
                />
                <SheetContent side={side}>
                  <SheetHeader>
                    <SheetTitle>Anchored {side}</SheetTitle>
                    <SheetDescription>
                      Dismiss with Escape, clicking the backdrop, or the close button.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
