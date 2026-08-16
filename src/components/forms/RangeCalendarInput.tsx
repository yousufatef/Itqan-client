import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarDays, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Direction } from '@/i18n/useDirection';
import CustomRangeCalendar from './CustomRangeCalendar';
import { formFieldStyles } from './form-field.styles';
import {
  RANGE_CALENDAR_INPUT_DRAWER_CLASS,
  RANGE_CALENDAR_INPUT_POPOVER_COMPACT_CLASS,
  RANGE_CALENDAR_INPUT_POPOVER_DESKTOP_CLASS,
} from './range-calendar-input.constants';

export type RangeCalendarLayout = 'auto' | 'compact';
export type RangeCalendarPresentation = 'auto' | 'popover' | 'drawer';

export function formatShortRange(range: DateRange, locale: string) {
  if (!range.from || !range.to) return '';

  const localeCode = locale.startsWith('it') ? 'it-IT' : 'en-US';
  const formatter = new Intl.DateTimeFormat(localeCode, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return `${formatter.format(range.from)} - ${formatter.format(range.to)}`;
}

export const hasCompleteRange = (range?: DateRange) => Boolean(range?.from && range?.to);

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export function resolveRangeCalendarMonths({
  layout,
  numberOfMonths,
  isDesktopLayout,
  forceSingleMonth = false,
}: {
  layout: RangeCalendarLayout;
  numberOfMonths?: number;
  isDesktopLayout: boolean;
  forceSingleMonth?: boolean;
}) {
  if (forceSingleMonth || layout === 'compact') return 1;
  if (numberOfMonths != null) return numberOfMonths;
  return isDesktopLayout ? 2 : 1;
}

export function resolveRangeCalendarPresentation({
  presentation,
  isDesktopLayout,
}: {
  presentation: RangeCalendarPresentation;
  isDesktopLayout: boolean;
}) {
  if (presentation === 'popover') return 'popover';
  if (presentation === 'drawer') return 'drawer';
  return isDesktopLayout ? 'popover' : 'drawer';
}

type RangeCalendarPanelProps = {
  selected?: DateRange;
  onSave: (range: DateRange | undefined) => void;
  onCancel?: () => void;
  locale: string;
  numberOfMonths: number;
  compact: boolean;
  resetLabel: string;
  saveLabel: string;
  cancelLabel: string;
  calendarClassName?: string;
  open: boolean;
  variant: 'popover' | 'drawer';
};

export function RangeCalendarPanel({
  selected,
  onSave,
  onCancel,
  locale,
  numberOfMonths,
  compact,
  resetLabel,
  saveLabel,
  cancelLabel,
  calendarClassName,
  open,
  variant,
}: RangeCalendarPanelProps) {
  const [pending, setPending] = React.useState<DateRange | undefined>(selected);

  React.useEffect(() => {
    if (open) {
      setPending(selected);
    }
  }, [open, selected]);

  const handleCancel = () => {
    setPending(selected);
    onCancel?.();
  };

  return (
    <div
      className={cn(
        variant === 'popover' && formFieldStyles.rangeCalendarContent,
        variant === 'drawer' && 'flex flex-col bg-[#F8F8F8]',
      )}
    >
      <div className={cn(variant === 'drawer' && 'px-0 pt-0')}>
        <CustomRangeCalendar
          className={calendarClassName}
          compact={compact}
          key={`${variant}-${compact ? 'compact' : 'desktop'}-${numberOfMonths}`}
          locale={locale}
          numberOfMonths={numberOfMonths}
          onSelect={setPending}
          selected={pending}
        />
      </div>

      {variant === 'popover' ? (
        <div className={formFieldStyles.rangeCalendarFooter}>
          <button
            className={formFieldStyles.rangeCalendarReset}
            onClick={() => setPending(undefined)}
            type='button'
          >
            {resetLabel}
          </button>
          <button
            className={formFieldStyles.rangeCalendarSave}
            disabled={!hasCompleteRange(pending)}
            onClick={() => onSave(pending)}
            type='button'
          >
            {saveLabel}
          </button>
        </div>
      ) : (
        <div className={formFieldStyles.rangeCalendarDrawerFooter}>
          <button
            className={formFieldStyles.rangeCalendarDrawerCancel}
            onClick={handleCancel}
            type='button'
          >
            {cancelLabel}
          </button>
          <button
            className={formFieldStyles.rangeCalendarDrawerSave}
            disabled={!hasCompleteRange(pending)}
            onClick={() => onSave(pending)}
            type='button'
          >
            {saveLabel}
          </button>
        </div>
      )}
    </div>
  );
}

/** @deprecated Use RangeCalendarPanel */
export const RangeCalendarPopover = RangeCalendarPanel;

export type RangeCalendarInputProps = {
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
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
  numberOfMonths?: number;
  layout?: RangeCalendarLayout;
  presentation?: RangeCalendarPresentation;
  locale?: string;
  calendarClassName?: string;
  id?: string;
  'aria-invalid'?: boolean;
  onBlur?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

function RangeCalendarTriggerButton({
  id,
  ariaInvalid,
  disabled,
  onBlur,
  ref,
  triggerClassName,
  displayRange,
  formatValue,
  locale,
  placeholder,
  clearable,
  onClear,
  onClick,
}: {
  id?: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
  triggerClassName?: string;
  displayRange?: DateRange;
  formatValue: (range: DateRange, locale: string) => string;
  locale: string;
  placeholder: string;
  clearable: boolean;
  onClear: () => void;
  onClick?: () => void;
}) {
  return (
    <button
      id={id}
      type='button'
      aria-invalid={ariaInvalid}
      disabled={disabled}
      onBlur={onBlur}
      onClick={onClick}
      ref={ref}
      className={cn(
        formFieldStyles.rangeCalendarTrigger,
        !displayRange && 'text-[#8C8A84]',
        triggerClassName,
      )}
    >
      <span className='truncate text-start'>
        {displayRange ? formatValue(displayRange, locale) : placeholder}
      </span>
      <span className='flex shrink-0 items-center gap-1.5'>
        {clearable && displayRange ? (
          <span
            role='button'
            tabIndex={-1}
            onClick={(event) => {
              event.stopPropagation();
              onClear();
            }}
            className='hover:text-neutral-900 inline-flex size-4 items-center justify-center rounded-sm text-[#8C8A84] transition-colors'
          >
            <X className='size-3.5' />
          </span>
        ) : null}
        <CalendarDays className='size-5 text-primary-500' />
      </span>
    </button>
  );
}

const RangeCalendarInput = ({
  value,
  onChange,
  placeholder = 'Select dates',
  disabled,
  triggerClassName,
  contentClassName,
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
  calendarClassName,
  id,
  'aria-invalid': ariaInvalid,
  onBlur,
  ref,
}: RangeCalendarInputProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)');
  const resolvedPresentation = resolveRangeCalendarPresentation({
    presentation,
    isDesktopLayout,
  });
  const useDrawer = resolvedPresentation === 'drawer';
  const resolvedMonths = resolveRangeCalendarMonths({
    layout,
    numberOfMonths,
    isDesktopLayout,
    forceSingleMonth: useDrawer,
  });
  const isCompact = resolvedMonths === 1;
  const displayRange = hasCompleteRange(value) ? value : undefined;

  const handleSave = (nextValue: DateRange | undefined) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  const triggerProps = {
    id,
    ariaInvalid,
    disabled,
    onBlur,
    ref,
    triggerClassName,
    displayRange,
    formatValue,
    locale,
    placeholder,
    clearable,
    onClear: () => onChange?.(undefined),
  };

  if (useDrawer) {
    return (
      <>
        <RangeCalendarTriggerButton
          {...triggerProps}
          onClick={() => !disabled && setOpen(true)}
        />
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetContent
            dir={dir}
            showCloseButton={false}
            side='bottom'
            className={cn(RANGE_CALENDAR_INPUT_DRAWER_CLASS, contentClassName)}
          >
            <div className='flex items-center justify-between gap-4 px-4 pb-2 pt-4'>
              <SheetTitle className='type-body-lg text-start font-semibold text-neutral-900'>
                {drawerTitle}
              </SheetTitle>
              <button
                type='button'
                aria-label={cancelLabel}
                onClick={() => setOpen(false)}
                className='inline-flex size-6 items-center justify-center text-neutral-900 transition-opacity hover:opacity-70'
              >
                <X className='size-6' />
              </button>
            </div>

            <RangeCalendarPanel
              calendarClassName={calendarClassName}
              cancelLabel={cancelLabel}
              compact
              locale={locale}
              numberOfMonths={1}
              onCancel={() => setOpen(false)}
              onSave={handleSave}
              open={open}
              resetLabel={resetLabel}
              saveLabel={saveLabel}
              selected={value}
              variant='drawer'
            />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <RangeCalendarTriggerButton {...triggerProps} />
      </PopoverTrigger>
      <PopoverContent
        align='start'
        sideOffset={4}
        className={cn(
          'border-none bg-transparent p-0 shadow-none',
          isCompact
            ? RANGE_CALENDAR_INPUT_POPOVER_COMPACT_CLASS
            : RANGE_CALENDAR_INPUT_POPOVER_DESKTOP_CLASS,
          contentClassName,
        )}
        dir={dir}
      >
        <RangeCalendarPanel
          calendarClassName={calendarClassName}
          cancelLabel={cancelLabel}
          compact={isCompact}
          locale={locale}
          numberOfMonths={resolvedMonths}
          onSave={handleSave}
          open={open}
          resetLabel={resetLabel}
          saveLabel={saveLabel}
          selected={value}
          variant='popover'
        />
      </PopoverContent>
    </Popover>
  );
};

export default RangeCalendarInput;
