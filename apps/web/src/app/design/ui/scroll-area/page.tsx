import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

const TAGS = Array.from({ length: 50 }, (_, i) => `tag-${(i + 1).toString().padStart(2, '0')}`);
const COLUMNS = Array.from({ length: 20 }, (_, i) => `Column ${i + 1}`);

export default function ScrollAreaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Scroll area"
        description="Custom-styled scrollbars tied to the --border token. Use when native scrollbars would break the visual rhythm — most containers should still rely on overflow-auto."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Vertical"
          description="Fixed-height list with overflow. Scrollbar fades with pointer activity."
        >
          <ScrollArea className="border-border h-48 w-60 rounded-lg border">
            <div className="p-3">
              <h4 className="text-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Tags
              </h4>
              {TAGS.map((tag) => (
                <div key={tag} className="flex flex-col">
                  <span className="py-1 text-sm">{tag}</span>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        </ComponentExample>

        <ComponentExample
          title="Horizontal"
          description="Wide table-like row with a horizontal scrollbar."
        >
          <ScrollArea className="border-border max-w-md rounded-lg border">
            <div className="flex gap-3 p-3">
              {COLUMNS.map((col) => (
                <div
                  key={col}
                  className="bg-muted text-foreground flex h-16 w-28 shrink-0 items-center justify-center rounded-md text-xs"
                >
                  {col}
                </div>
              ))}
            </div>
          </ScrollArea>
        </ComponentExample>
      </div>
    </>
  );
}
