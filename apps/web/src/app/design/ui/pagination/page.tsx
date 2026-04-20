'use client';

import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

const TOTAL = 8;

export default function PaginationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Pagination"
        description="Semantic pagination primitive. Consumer owns state — the primitive only provides the presentation + the correct aria wiring."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Short list" description="Five or fewer pages — show them all.">
          <ShortPagination />
        </ComponentExample>

        <ComponentExample
          title="With ellipsis"
          description="Collapse the middle when the range is large."
        >
          <WindowedPagination />
        </ComponentExample>

        <ComponentExample
          title="Prev/next only"
          description="Infinite cursor lists don't know total — drop page numbers entirely."
        >
          <PrevNextPagination />
        </ComponentExample>
      </div>
    </>
  );
}

function ShortPagination() {
  const [page, setPage] = useState(2);
  const pages = [1, 2, 3, 4, 5];
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(event) => {
              event.preventDefault();
              setPage((p) => Math.max(1, p - 1));
            }}
            href="#"
          />
        </PaginationItem>
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(event) => {
                event.preventDefault();
                setPage(p);
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setPage((p) => Math.min(pages.length, p + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function WindowedPagination() {
  const [page, setPage] = useState(5);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setPage((p) => Math.max(1, p - 1));
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive={page === 1}
            onClick={(event) => {
              event.preventDefault();
              setPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {[page - 1, page, page + 1].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(event) => {
                event.preventDefault();
                setPage(p);
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive={page === TOTAL}
            onClick={(event) => {
              event.preventDefault();
              setPage(TOTAL);
            }}
          >
            {TOTAL}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setPage((p) => Math.min(TOTAL, p + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function PrevNextPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
