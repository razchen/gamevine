import { CircleHelpIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ComponentExample } from '../_components/component-example';

export default function TooltipPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Tooltip</h1>
        <p className="text-muted-foreground text-sm">
          Hover hints for icon-only controls and constrained labels. Content portals to{' '}
          <code className="font-mono text-xs">document.body</code>, so previews track the live
          theme.
        </p>
      </header>

      <TooltipProvider>
        <div className="flex flex-col gap-8">
          <ComponentExample
            title="On a button"
            description="Default tooltip above the trigger."
            unportaled={false}
          >
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
              <TooltipContent>Shown after a brief hover delay.</TooltipContent>
            </Tooltip>
          </ComponentExample>

          <ComponentExample
            title="On an icon"
            description="Common pattern for dense UI (toolbars, tables)."
            unportaled={false}
          >
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Info" />}>
                <InfoIcon />
              </TooltipTrigger>
              <TooltipContent>Hover help for an icon-only button.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Help" />}>
                <CircleHelpIcon />
              </TooltipTrigger>
              <TooltipContent side="bottom">Tip placement below the trigger.</TooltipContent>
            </Tooltip>
          </ComponentExample>

          <ComponentExample
            title="On a disabled target"
            description="Wrap the disabled control in a span so hover still fires."
            unportaled={false}
          >
            <Tooltip>
              <TooltipTrigger
                render={<span tabIndex={0} className="inline-flex" />}
                aria-label="Disabled button tooltip"
              >
                <Button disabled>Unavailable</Button>
              </TooltipTrigger>
              <TooltipContent>
                Disabled buttons swallow pointer events; wrap them to surface hints.
              </TooltipContent>
            </Tooltip>
          </ComponentExample>
        </div>
      </TooltipProvider>
    </>
  );
}
