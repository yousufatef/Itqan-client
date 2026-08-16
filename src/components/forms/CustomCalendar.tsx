import * as React from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { Direction } from '@/i18n/useDirection';
import type { FieldValues } from 'react-hook-form';

type CustomCalendarProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    defaultValue?: Date;
    onValueChange?: (value: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    fromDate?: Date;
    toDate?: Date;
    triggerClassName?: string;
    contentClassName?: string;
    formatValue?: (date: Date) => string;
    dir?: Direction;
    clearable?: boolean;
    /** Title shown at the top of the calendar popover, e.g. "Select date" */
    calendarTitle?: string;
    /** Label for the reset/clear action in the footer */
    resetLabel?: string;
    /** Label for the confirm action in the footer */
    saveLabel?: string;
  };

const defaultFormatValue = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const isSameDay = (a?: Date, b?: Date) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const WEEKDAY_LABELS = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
};

/** Builds a Monday-first, 6-row (42 cell) grid for the given month. */
const buildMonthGrid = (viewDate: Date): DayCell[] => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  // JS getDay(): Sun=0..Sat=6 -> convert to Mon=0..Sun=6
  const leadingCount = (firstOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(year, month, 1 - leadingCount);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return { date, inCurrentMonth: date.getMonth() === month };
  });
};

const monthLabel = (date: Date) =>
  new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date);

function CustomCalendar<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  optional,
  subLabel,
  wrapperClassName,
  labelClassName,
  triggerClassName,
  contentClassName,
  defaultValue,
  onValueChange,
  placeholder = 'Pick a date',
  disabled,
  fromDate,
  toDate,
  formatValue = defaultFormatValue,
  dir,
  clearable = true,
  calendarTitle = 'Select date',
  resetLabel = 'Reset',
  saveLabel = 'Save',
}: CustomCalendarProps<TFieldValues>) {
  const generatedId = React.useId();
  const triggerId = generatedId;
  const [open, setOpen] = React.useState(false);

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      htmlFor={triggerId}
      labelClassName={labelClassName}
      name={name}
      optional={optional}
      required={required}
      subLabel={subLabel}
      label={label}
    >
      {(field, fieldState) => {
        const fieldValue = field.value as unknown;
        const selectedDate = fieldValue instanceof Date ? fieldValue : defaultValue;

        const commitValue = (nextValue: Date | undefined) => {
          field.onChange(nextValue);
          onValueChange?.(nextValue);
        };

        return (
          <>
            {selectedDate ? (
              <input
                name={field.name}
                type='hidden'
                value={toDateInputValue(selectedDate)}
              />
            ) : null}

            <Popover
              onOpenChange={setOpen}
              open={open}
            >
              <PopoverTrigger asChild>
                <Button
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    formFieldStyles.selectTrigger,
                    'justify-between gap-2 px-3 font-normal',
                    !selectedDate && 'text-muted-foreground',
                    triggerClassName,
                  )}
                  disabled={disabled}
                  id={triggerId}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  type='button'
                  variant='outline'
                >
                  <span className='truncate'>
                    {selectedDate ? formatValue(selectedDate) : placeholder}
                  </span>
                  <span className='flex items-center gap-1'>
                    {clearable && selectedDate ? (
                      <span
                        className='text-muted-foreground hover:text-foreground inline-flex size-5 items-center justify-center rounded-sm'
                        onClick={(event) => {
                          event.stopPropagation();
                          commitValue(undefined);
                        }}
                        role='button'
                        tabIndex={-1}
                      >
                        <XIcon className='size-3.5' />
                      </span>
                    ) : null}
                    <CalendarIcon className='text-muted-foreground size-4' />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align='start'
                className={cn('w-auto border-none bg-transparent p-0 shadow-none', contentClassName)}
                dir={dir}
              >
                <SingleDateCalendar
                  calendarTitle={calendarTitle}
                  fromDate={fromDate}
                  onCancel={() => setOpen(false)}
                  onSave={(date) => {
                    commitValue(date);
                    setOpen(false);
                  }}
                  resetLabel={resetLabel}
                  saveLabel={saveLabel}
                  selected={selectedDate}
                  toDate={toDate}
                />
              </PopoverContent>
            </Popover>
          </>
        );
      }}
    </FieldLayout>
  );
}

type SingleDateCalendarProps = {
  selected?: Date;
  onSave: (date: Date | undefined) => void;
  onCancel: () => void;
  fromDate?: Date;
  toDate?: Date;
  calendarTitle: string;
  resetLabel: string;
  saveLabel: string;
};

function SingleDateCalendar({
  selected,
  onSave,
  fromDate,
  toDate,
  calendarTitle,
  resetLabel,
  saveLabel,
}: SingleDateCalendarProps) {
  const [viewDate, setViewDate] = React.useState(() => selected ?? new Date());
  const [pending, setPending] = React.useState<Date | undefined>(selected);

  const grid = React.useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const isDisabled = (date: Date) => {
    if (fromDate && date < fromDate) return true;
    if (toDate && date > toDate) return true;
    return false;
  };

  const goToMonth = (delta: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div
      className={cn(
        'w-[320px] rounded-[8px] border border-neutral-700 bg-primary-100 p-3.5 shadow-sm',
      )}
    >
      <p className='mb-2 type-body-md text-neutral-900'>{calendarTitle}</p>

      <div className='mb-2 flex items-center justify-between border-b border-neutral-800 pb-2'>
        <button
          aria-label='Previous month'
          className='flex size-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-[#e2d6b3] hover:text-[#2c2415]'
          onClick={() => goToMonth(-1)}
          type='button'
        >
          <ChevronLeft className='size-3.5' />
        </button>
        <span className='type-body-lg text-neutral-900'>{monthLabel(viewDate)}</span>
        <button
          aria-label='Next month'
          className='flex size-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-[#e2d6b3] hover:text-[#2c2415]'
          onClick={() => goToMonth(1)}
          type='button'
        >
          <ChevronRight className='size-3.5' />
        </button>
      </div>

      <div className='grid grid-cols-7'>
        {WEEKDAY_LABELS.map((day) => (
          <div
            className='py-0.5 text-center type-body-sm text-neutral-900'
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7'>
        {grid.map(({ date, inCurrentMonth }) => {
          const disabled = isDisabled(date);
          const isSelected = isSameDay(date, pending);

          return (
            <div
              className='flex items-center justify-center py-0.5'
              key={date.toISOString()}
            >
              <button
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-[12px] transition-colors type-body-md',
                  inCurrentMonth ? 'text-neutral-900' : 'text-[#c9bd97]',
                  isSelected && 'bg-neutral-900 text-[#efe7d5] ',
                  !isSelected && !disabled && 'hover:bg-[#e2d6b3]',
                  disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                )}
                disabled={disabled}
                onClick={() => setPending(date)}
                type='button'
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      <div className='mt-2 flex items-center justify-end gap-4  pt-2'>
        <button
          className='type-body-md text-primary-500 transition-colors hover:text-[#8a7a4f]'
          onClick={() => setPending(undefined)}
          type='button'
        >
          {resetLabel}
        </button>
        <button
          className='rounded-lg bg-primary-500 px-4 py-1.5 type-body-md text-neutral-900 transition-colors hover:bg-primary-400'
          onClick={() => onSave(pending)}
          type='button'
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

export default CustomCalendar;