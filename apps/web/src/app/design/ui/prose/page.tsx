import { PageHeader, Prose } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function ProseGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Prose"
        description="Long-form text container. Wraps @tailwindcss/typography with the local prose-gv modifier so links, code, blockquotes, and bullets pick up our product tokens instead of slate / zinc."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Default size"
          description="A representative markup sample so each pane shows headings, paragraphs, lists, blockquote, and code."
        >
          <Prose>
            <h1>Funding the next update</h1>
            <p>
              Gamevine pools small, recurring credit pledges into single funded updates.
              Contributors propose ideas; supporters back them; releases ship monthly.
            </p>
            <h2>How pledges resolve</h2>
            <p>
              When an idea hits its credit threshold, pledged credits move from <em>held</em> to{' '}
              <em>spent</em> and the update enters the build queue. Backers are notified once the
              release lands.
            </p>
            <h3>Caveats</h3>
            <ul>
              <li>Pledges are debited from the wallet immediately as a hold.</li>
              <li>Refunds happen automatically if an update is cancelled.</li>
              <li>
                See <a href="#">the credits doc</a> for the full lifecycle.
              </li>
            </ul>
            <ol>
              <li>Propose an idea.</li>
              <li>Gather pledges from supporters.</li>
              <li>Funded → released.</li>
            </ol>
            <blockquote>
              The wallet ledger is append-only. Balance is always derived, never stored.
            </blockquote>
            <p>
              Inline code: <code>WalletService.append(entry)</code>. Fenced block:
            </p>
            <pre>
              <code>{`type LedgerEntry = {
  type: 'grant.subscription' | 'spend.pledge' | 'refund.cancelled';
  amount: number;
  refId?: string;
};`}</code>
            </pre>
          </Prose>
        </ComponentExample>

        <ComponentExample
          title="Small size"
          description="Use prose-sm for compact contexts (sidebars, inline help)."
        >
          <Prose size="sm">
            <h3>Compact note</h3>
            <p>
              Smaller body, tighter line-height, but every other prose-gv override still applies —
              links, bullets, blockquotes all keep the product tokens.
            </p>
            <ul>
              <li>One</li>
              <li>Two</li>
              <li>Three</li>
            </ul>
          </Prose>
        </ComponentExample>
      </div>
    </>
  );
}
