'use client';

import { AlertTriangleIcon, CircleCheckIcon, InfoIcon, OctagonXIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Feedback"
        description={
          <>
            Inline alerts, modal dialogs, and transient toasts. Dialog and toast content portal to{' '}
            <code className="font-mono text-xs">document.body</code> — those previews track the live
            theme.
          </>
        }
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Alert — default"
          description="Informational inline message. Render side-by-side."
        >
          <Alert className="w-full max-w-md">
            <InfoIcon />
            <AlertTitle>Release queued</AlertTitle>
            <AlertDescription>
              Your build is in the queue. You&apos;ll get a notification when it&apos;s ready.
            </AlertDescription>
          </Alert>
        </ComponentExample>

        <ComponentExample
          title="Alert — destructive"
          description="Hard failures. Uses the --destructive token."
        >
          <Alert variant="destructive" className="w-full max-w-md">
            <OctagonXIcon />
            <AlertTitle>Build failed</AlertTitle>
            <AlertDescription>
              Two assets are missing. Fix them in the editor, then try again.
            </AlertDescription>
          </Alert>
        </ComponentExample>

        <ComponentExample
          title="Dialog"
          description="Focus-trapped modal. Portaled, so it renders once in the live theme."
          unportaled={false}
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Archive this release?</DialogTitle>
                <DialogDescription>
                  Archived releases stay searchable but are hidden from the default feed. You can
                  restore them anytime.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                <DialogClose render={<Button />}>Archive</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ComponentExample>

        <ComponentExample
          title="Toasts (sonner)"
          description="Queued notifications from anywhere in the gallery. Portaled to bottom-right."
          unportaled={false}
        >
          <Button
            variant="outline"
            onClick={() =>
              toast.success('Release shipped', {
                description: 'Credits have been released to contributors.',
              })
            }
          >
            <CircleCheckIcon data-icon="inline-start" />
            Success toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning('Queue backed up', {
                description: 'Expect a 5-minute delay.',
              })
            }
          >
            <AlertTriangleIcon data-icon="inline-start" />
            Warning toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error('Upload failed', {
                description: 'Check your connection and try again.',
              })
            }
          >
            <OctagonXIcon data-icon="inline-start" />
            Error toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info('Tip', {
                description: 'Press ⌘K to jump to any release.',
              })
            }
          >
            <InfoIcon data-icon="inline-start" />
            Info toast
          </Button>
        </ComponentExample>
      </div>
    </>
  );
}
