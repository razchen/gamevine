import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ComponentExample } from '../_components/component-example';

const FAQS = [
  {
    q: 'What is Gamevine?',
    a: 'A community-funded browser game publisher. Creators post pitches, players fund releases with credits.',
  },
  {
    q: 'How do credits work?',
    a: 'Credits are purchased in packs and spent on pitches. Unspent credits roll over; refunds follow the posted policy.',
  },
  {
    q: 'Can I export my reviews?',
    a: 'Yes — every user can export their full review history as JSON from account settings.',
  },
];

export default function AccordionPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Accordion</h1>
        <p className="text-muted-foreground text-sm">
          Progressive disclosure. Prefer over Tabs when the items are semantically similar and the
          user benefits from scanning headers without a commit.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Single open"
          description="Default behaviour — one panel open at a time."
        >
          <Accordion className="w-full max-w-md">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.q} value={`item-${index}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>
                  <p>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ComponentExample>

        <ComponentExample
          title="Multiple open"
          description="`multiple` lets several panels stay expanded simultaneously."
        >
          <Accordion multiple className="w-full max-w-md">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.q} value={`item-${index}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>
                  <p>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ComponentExample>

        <ComponentExample
          title="Default open"
          description="Seed `defaultValue` with an item to open on mount."
        >
          <Accordion defaultValue={['item-0']} className="w-full max-w-md">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.q} value={`item-${index}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>
                  <p>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ComponentExample>
      </div>
    </>
  );
}
