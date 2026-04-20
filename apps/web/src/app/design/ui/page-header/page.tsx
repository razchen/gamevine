import { DownloadIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function PageHeaderGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Page header"
        description="Title + optional eyebrow, description, and action slot. Drop-in replacement for the ad-hoc header blocks on gallery and product pages."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Title + description" description="The most common shape.">
          <div className="w-full">
            <PageHeader
              title="Settings"
              description="Manage notifications, billing, and API tokens for your workspace."
            />
          </div>
        </ComponentExample>

        <ComponentExample
          title="Eyebrow + title + description"
          description="Add a section label above the title for hierarchy."
        >
          <div className="w-full">
            <PageHeader
              eyebrow="Dashboard"
              title="Weekly funding"
              description="Credits pledged by the community across active updates."
            />
          </div>
        </ComponentExample>

        <ComponentExample
          title="With actions"
          description="Actions float to the right on wide screens and wrap beneath on narrow."
        >
          <div className="w-full">
            <PageHeader
              title="Updates"
              description="Rolling list of community pitches and funded items."
              actions={
                <>
                  <Button variant="outline" size="sm">
                    <DownloadIcon />
                    Export
                  </Button>
                  <Button size="sm">
                    <PlusIcon />
                    New update
                  </Button>
                </>
              }
            />
          </div>
        </ComponentExample>

        <ComponentExample title="Minimal" description="Just a title — fine for smaller surfaces.">
          <div className="w-full">
            <PageHeader title="Billing" />
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
