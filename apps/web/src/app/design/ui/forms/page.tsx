import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function FormsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Forms"
        description={
          <>
            Input, Label, Textarea, and a submit row. Validation state uses{' '}
            <code className="font-mono text-xs">aria-invalid</code>.
          </>
        }
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Input" description="Default, disabled, and invalid states.">
          <div className="flex w-full max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="form-email">Email</Label>
              <Input id="form-email" type="email" placeholder="you@gamevine.ai" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="form-disabled">Disabled</Label>
              <Input id="form-disabled" placeholder="Can't edit" disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="form-invalid">Handle</Label>
              <Input id="form-invalid" aria-invalid="true" defaultValue="123!" />
              <span className="text-destructive text-xs">
                Handles must start with a letter and use only a-z0-9_.
              </span>
            </div>
          </div>
        </ComponentExample>

        <ComponentExample title="Textarea" description="Auto-sizing multi-line input.">
          <div className="flex w-full max-w-sm flex-col gap-1.5">
            <Label htmlFor="form-notes">Release notes</Label>
            <Textarea id="form-notes" placeholder="What changed?" />
            <span className="text-muted-foreground text-xs">Markdown is supported.</span>
          </div>
        </ComponentExample>

        <ComponentExample title="Submit row" description="Button cluster below a form body.">
          <form className="flex w-full max-w-sm flex-col gap-3" action="#">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="form-title">Idea title</Label>
              <Input id="form-title" placeholder="Give it a name" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit idea
              </Button>
            </div>
          </form>
        </ComponentExample>
      </div>
    </>
  );
}
