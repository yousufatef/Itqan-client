import { cn } from '@/lib/utils';

const isEmptyValue = (value: unknown): boolean =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

type TableCellValueProps = {
  value?: string | number | null;
  className?: string;
  emptyLabel?: string;
};

const TableCellValue = ({
  value,
  className = 'type-body-sm-semibold text-neutral-900',
  emptyLabel = '-',
}: TableCellValueProps) => {
  if (isEmptyValue(value)) {
    return (
      <p className={cn('type-body-sm-semibold truncate text-neutral-300', className)}>
        {emptyLabel}
      </p>
    );
  }

  return <p className={cn('truncate', className)}>{value}</p>;
};

export default TableCellValue;
