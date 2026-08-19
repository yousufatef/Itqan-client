import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { ArrowDownUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Direction } from '@/i18n/useDirection';
import LoadingOverlay from '../loader/LoadingOverlay';

export type CustomTableMeta = {
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
};

type CustomTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyMessage?: string;
  className?: string;
  dir?: Direction;
  rowClassName?: (row: TData) => string;
  isFetching?: boolean;
  onRowClick?: (row: TData) => void;
};

function CustomTable<TData>({
  columns,
  data,
  emptyMessage = 'لا يوجد بيانات لعرضها',
  className,
  dir,
  rowClassName,
  isFetching = false,
  onRowClick,
}: CustomTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[8px] border border-neutral-100 bg-white',
        className,
      )}
      dir={dir}
    >
      {isFetching && <LoadingOverlay />}
      <Table>
        <TableHeader className='bg-neutral-50'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className='border-b border-neutral-100 hover:bg-transparent'
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as CustomTableMeta | undefined;
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'type-body-sm h-12 overflow-clip p-2 text-start font-normal text-neutral-400',
                      meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <div className='flex min-w-0 items-center gap-2'>
                        {meta?.sortable ? (
                          <ArrowDownUp
                            className='size-4 shrink-0 text-neutral-400'
                            aria-hidden='true'
                          />
                        ) : null}
                        <span className='min-w-0 flex-1 truncate'>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>

                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={cn(
                  'h-16 border-b border-neutral-100 bg-white',
                  onRowClick ? 'cursor-pointer hover:bg-neutral-50' : 'hover:bg-white',
                  rowClassName?.(row.original),
                )}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as CustomTableMeta | undefined;
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'type-body-sm-semibold overflow-clip p-2 text-start text-neutral-900',
                        meta?.className,
                      )}
                    >
                      <div className='flex min-w-0 items-center'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className='hover:bg-white'>
              <TableCell
                className='type-body-sm h-28 p-2 text-center text-neutral-400'
                colSpan={columns.length}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default CustomTable;
