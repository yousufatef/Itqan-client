import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { getDefaultClassNames, type DayButton } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  RANGE_CALENDAR_INPUT_CELL_SIZE,
  RANGE_CALENDAR_INPUT_COMPACT_GRID_INSET,
  RANGE_CALENDAR_INPUT_DESKTOP_GRID_INSET,
  RANGE_CALENDAR_INPUT_DESKTOP_NAV_INSET,
} from './range-calendar-input.constants';

type CustomRangeCalendarProps = {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  numberOfMonths?: number;
  locale: string;
  className?: string;
  compact?: boolean;
};

function RangeDayButton({
  className,
  modifiers,
  children,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isEndpoint = modifiers.range_start || modifiers.range_end;

  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'relative z-10 flex size-12 items-center justify-center border-0 bg-transparent p-0 outline-none',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-full type-body-md text-neutral-900',
          modifiers.outside && 'text-neutral-400',
          modifiers.disabled && 'text-neutral-300 opacity-50',
          isEndpoint && 'size-9 bg-neutral-900 text-primary-100',
        )}
      >
        {children}
      </span>
    </button>
  );
}

const CustomRangeCalendar = ({
  selected,
  onSelect,
  numberOfMonths = 1,
  locale,
  className,
  compact = false,
}: CustomRangeCalendarProps) => {
  const defaultClassNames = getDefaultClassNames();
  const localeCode = locale.startsWith('it') ? 'it-IT' : 'en-US';
  const isCompact = compact || numberOfMonths === 1;
  const gridInset = isCompact
    ? `${RANGE_CALENDAR_INPUT_COMPACT_GRID_INSET}px`
    : `${RANGE_CALENDAR_INPUT_DESKTOP_GRID_INSET}px`;
  const navInset = isCompact ? '32px' : `${RANGE_CALENDAR_INPUT_DESKTOP_NAV_INSET}px`;

  return (
    <Calendar
      mode='range'
      selected={selected}
      onSelect={onSelect}
      numberOfMonths={numberOfMonths}
      weekStartsOn={1}
      showOutsideDays
      className={cn(
        'w-full bg-transparent p-0',
        isCompact ? 'mx-auto max-w-[358px]' : 'mx-auto w-[854px] max-w-[854px]',
        className,
      )}
      style={
        {
          '--cell-size': `${RANGE_CALENDAR_INPUT_CELL_SIZE}px`,
          '--calendar-grid-inset': gridInset,
          '--calendar-nav-inset': navInset,
        } as React.CSSProperties
      }
      classNames={{
        root: cn('relative isolate w-full', defaultClassNames.root),
        months: cn(
          'relative flex w-full gap-4',
          isCompact ? 'flex-col items-center' : 'flex-row items-start justify-center',
          defaultClassNames.months,
        ),
        month: cn(
          'relative flex w-full min-w-0 flex-col overflow-hidden p-1',
          !isCompact && 'w-[419px] max-w-[419px] shrink-0',
          defaultClassNames.month,
        ),
        month_caption: cn(
          'relative mb-0 flex min-h-[59px] w-full items-center justify-center border-b border-neutral-900 px-[var(--calendar-nav-inset)] py-4',
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          'type-body-lg pointer-events-none flex-1 text-center font-normal text-neutral-900',
          defaultClassNames.caption_label,
        ),
        nav: cn(
          'absolute inset-x-0 top-0 z-10 flex w-full items-center justify-between px-[var(--calendar-nav-inset)] py-4',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          'size-6 p-0 text-neutral-900 hover:bg-transparent aria-disabled:opacity-30',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          'size-6 p-0 text-neutral-900 hover:bg-transparent aria-disabled:opacity-30',
          defaultClassNames.button_next,
        ),
        weekdays: cn('flex w-full px-[var(--calendar-grid-inset)]', defaultClassNames.weekdays),
        weekday: cn(
          'flex h-11 w-12 max-w-12 flex-1 items-center justify-center py-2 type-body-sm font-normal text-neutral-900',
          defaultClassNames.weekday,
        ),
        week: cn('mt-1 flex w-full px-[var(--calendar-grid-inset)]', defaultClassNames.week),
        day: cn('p-0 text-center', defaultClassNames.day),
        range_start: cn('rounded-l-full bg-primary-200', defaultClassNames.range_start),
        range_middle: cn('bg-primary-200', defaultClassNames.range_middle),
        range_end: cn('rounded-r-full bg-primary-200', defaultClassNames.range_end),
        outside: cn('text-neutral-400', defaultClassNames.outside),
        disabled: cn('text-neutral-300 opacity-50', defaultClassNames.disabled),
        today: cn('font-semibold', defaultClassNames.today),
      }}
      formatters={{
        formatCaption: (date) =>
          new Intl.DateTimeFormat(localeCode, { month: 'long', year: 'numeric' }).format(date),
        formatWeekdayName: (date) =>
          new Intl.DateTimeFormat(localeCode, { weekday: 'short' }).format(date),
      }}
      components={{
        DayButton: RangeDayButton,
      }}
    />
  );
};

export default CustomRangeCalendar;
