import * as React from 'react';
import { CalendarIcon, XIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type CustomDateRangeFilterValue = Record<string, string | undefined>;

type CustomDateRangeFilterProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;
  onFilterChange?: (filter: CustomDateRangeFilterValue) => void;
  fromParamName?: string;
  toParamName?: string;
  placeholder?: string;
  disabled?: boolean;
  numberOfMonths?: number;
  className?: string;
  contentClassName?: string;
  showClearButton?: boolean;
  formatDisplayValue?: (date: Date) => string;
  formatRequestValue?: (date: Date) => string;
};

const defaultFormatDisplayValue = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

const defaultFormatRequestValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function CustomDateRangeFilter({
  value,
  defaultValue,
  onValueChange,
  onFilterChange,
  fromParamName = 'fromDate',
  toParamName = 'toDate',
  placeholder = 'Date range',
  disabled,
  numberOfMonths = 2,
  className,
  contentClassName,
  showClearButton = false,
  formatDisplayValue = defaultFormatDisplayValue,
  formatRequestValue = defaultFormatRequestValue,
}: CustomDateRangeFilterProps) {
  const [internalValue, setInternalValue] = React.useState<DateRange | undefined>(defaultValue);

  const isControlledRef = React.useRef(value !== undefined);
  if (!isControlledRef.current && value !== undefined) {
    isControlledRef.current = true;
  }

  const dateRange = isControlledRef.current ? value : internalValue;

  React.useEffect(() => {
    onFilterChange?.({
      [fromParamName]: dateRange?.from ? formatRequestValue(dateRange.from) : undefined,
      [toParamName]: dateRange?.to ? formatRequestValue(dateRange.to) : undefined,
    });
  }, [dateRange, formatRequestValue, fromParamName, onFilterChange, toParamName]);

  const updateValue = (nextValue: DateRange | undefined) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const displayValue = (() => {
    if (!dateRange?.from) return placeholder;
    if (!dateRange.to) return formatDisplayValue(dateRange.from);

    return `${formatDisplayValue(dateRange.from)} - ${formatDisplayValue(dateRange.to)}`;
  })();

  return (
    <div className='flex w-full items-center gap-2 sm:w-auto'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'w-full justify-between gap-2 px-3 font-normal sm:w-64',
              !dateRange?.from && 'text-muted-foreground',
              className,
            )}
            disabled={disabled}
            type='button'
            variant='outline'
          >
            <span className='truncate'>{displayValue}</span>
            <CalendarIcon className='size-4 shrink-0' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='end'
          className={cn('w-auto p-0', contentClassName)}
        >
          <Calendar
            captionLayout='dropdown'
            mode='range'
            numberOfMonths={numberOfMonths}
            onSelect={updateValue}
            selected={dateRange}
          />
        </PopoverContent>
      </Popover>

      {showClearButton && dateRange?.from ? (
        <Button
          aria-label='Clear date range'
          disabled={disabled}
          onClick={() => updateValue(undefined)}
          size='icon'
          type='button'
          variant='ghost'
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  );
}

export default CustomDateRangeFilter;
