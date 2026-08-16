import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import type { FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { Direction } from '@/i18n/useDirection';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import RangeCalendarInput, { formatShortRange } from './RangeCalendarInput';

type CustomRangeCalendarInputProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    defaultValue?: DateRange;
    onValueChange?: (value: DateRange | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    triggerClassName?: string;
    contentClassName?: string;
    formatValue?: (range: DateRange, locale: string) => string;
    dir?: Direction;
    clearable?: boolean;
    resetLabel?: string;
    saveLabel?: string;
    cancelLabel?: string;
    drawerTitle?: string;
    presentation?: 'auto' | 'popover' | 'drawer';
    numberOfMonths?: number;
    layout?: 'auto' | 'compact';
    locale?: string;
    calendarClassName?: string;
  };

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const isDateRange = (value: unknown): value is DateRange =>
  typeof value === 'object' &&
  value !== null &&
  ('from' in value || 'to' in value);

function CustomRangeCalendarInput<TFieldValues extends FieldValues = FieldValues>({
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
  calendarClassName,
  defaultValue,
  onValueChange,
  placeholder = 'Select dates',
  disabled,
  formatValue = formatShortRange,
  dir,
  clearable = true,
  resetLabel = 'Reset',
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  drawerTitle = 'Pick a date range',
  numberOfMonths,
  layout = 'auto',
  presentation = 'auto',
  locale = 'en',
}: CustomRangeCalendarInputProps<TFieldValues>) {
  const generatedId = React.useId();
  const triggerId = generatedId;

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
        const selectedRange = isDateRange(fieldValue) ? fieldValue : defaultValue;

        const commitValue = (nextValue: DateRange | undefined) => {
          field.onChange(nextValue);
          onValueChange?.(nextValue);
        };

        return (
          <>
            {selectedRange?.from ? (
              <input
                name={`${field.name}.from`}
                type='hidden'
                value={toDateInputValue(selectedRange.from)}
              />
            ) : null}
            {selectedRange?.to ? (
              <input
                name={`${field.name}.to`}
                type='hidden'
                value={toDateInputValue(selectedRange.to)}
              />
            ) : null}

            <RangeCalendarInput
              aria-invalid={fieldState.invalid}
              calendarClassName={calendarClassName}
              cancelLabel={cancelLabel}
              clearable={clearable}
              contentClassName={contentClassName}
              dir={dir}
              disabled={disabled}
              drawerTitle={drawerTitle}
              formatValue={formatValue}
              id={triggerId}
              layout={layout}
              locale={locale}
              numberOfMonths={numberOfMonths}
              onBlur={field.onBlur}
              onChange={commitValue}
              placeholder={placeholder}
              presentation={presentation}
              ref={field.ref}
              resetLabel={resetLabel}
              saveLabel={saveLabel}
              triggerClassName={triggerClassName}
              value={selectedRange}
            />
          </>
        );
      }}
    </FieldLayout>
  );
}

export default CustomRangeCalendarInput;
