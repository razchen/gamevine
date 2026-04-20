'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type { ColumnDef } from '@tanstack/react-table';

/**
 * Headless TanStack-Table powered table with batteries: per-column sort
 * (click the header), a single global search input, and a pagination
 * footer with a page-size selector. Composes our shadcn `Table` primitive
 * for styling so it inherits the rest of the design system automatically.
 *
 * For columns that should never sort, pass `enableSorting: false` on the
 * `ColumnDef`. For headers without sort affordance, pass a static string
 * to `header`. This composite is intentionally low-config — surfaces that
 * need server-driven pagination, row selection, or grouping should reach
 * for `useReactTable` directly.
 *
 * Must be a Client Component (TanStack hooks).
 */
export type DataTableProps<TData> = {
  /** Column definitions. Re-exported `ColumnDef<TData>` from this module. */
  columns: ColumnDef<TData>[];
  /** Row data — assumed already loaded; consider Suspense for async data. */
  data: TData[];
  /** Initial page size for the pagination footer. Defaults to 10. */
  pageSize?: number;
  /** Page size options shown in the footer dropdown. Defaults to [5, 10, 25, 50]. */
  pageSizeOptions?: number[];
  /** Placeholder text for the global filter input. */
  filterPlaceholder?: string;
  /** Hide the global filter input entirely. */
  hideFilter?: boolean;
  /** Hide the pagination footer entirely. */
  hidePagination?: boolean;
  className?: string;
};

export function DataTable<TData>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  filterPlaceholder = 'Filter…',
  hideFilter = false,
  hidePagination = false,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable<TData>({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div data-slot="data-table" className={cn('flex flex-col gap-3', className)}>
      {hideFilter ? null : (
        <Input
          aria-label="Filter rows"
          placeholder={filterPlaceholder}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      )}

      <div className="border-border/70 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : canSort ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-2 h-7 gap-1 px-2"
                          onClick={() => header.column.toggleSorting(sortDir === 'asc')}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDir === 'asc' ? (
                            <ArrowUpIcon data-icon="inline-end" />
                          ) : sortDir === 'desc' ? (
                            <ArrowDownIcon data-icon="inline-end" />
                          ) : (
                            <ArrowUpDownIcon
                              data-icon="inline-end"
                              className="text-muted-foreground"
                            />
                          )}
                        </Button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hidePagination ? null : (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>Rows per page</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-[4.5rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
          </div>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(event) => {
                    event.preventDefault();
                    table.previousPage();
                  }}
                  aria-disabled={!table.getCanPreviousPage()}
                  className={cn(!table.getCanPreviousPage() && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={(event) => {
                    event.preventDefault();
                    table.nextPage();
                  }}
                  aria-disabled={!table.getCanNextPage()}
                  className={cn(!table.getCanNextPage() && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
