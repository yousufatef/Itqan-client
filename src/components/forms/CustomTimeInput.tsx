import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ControllerFieldState, FieldValues } from 'react-hook-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import {
  formatHourDisplay,
  formatMinuteDisplay,
  formatTimeString,
  normalizeHourInput,
  normalizeMinuteInput,
  parseTimeString,
  type TimePeriod,
} from './time-input.utils';

export type CustomTimeInputProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    inputClassName?: string;
    disabled?: boolean;
    hourAriaLabel?: string;
    minuteAriaLabel?: string;
    periodAriaLabel?: string;
  };

function sanitizeDigits(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

/** Allow partial hour entry while typing; block invalid 2-digit values like 13. */
function sanitizeHourDigits(value: string): string {
  const digits = sanitizeDigits(value, 2);
  if (digits.length <= 1) return digits;

  const hour = Number(digits);
  if (hour >= 1 && hour <= 12) return digits;

  return digits.slice(0, 1);
}

type TimeInputControlProps = {
  field: {
    value: unknown;
    onChange: (value: string) => void;
    onBlur: () => void;
  };
  fieldState: ControllerFieldState;
  inputId: string;
  inputClassName?: string;
  disabled?: boolean;
  hourAriaLabel?: string;
  minuteAriaLabel?: string;
  periodAriaLabel?: string;
};

const periodLabels: Record<TimePeriod, string> = {
  AM: 'صباحًا',
  PM: 'مساءً',
};

function TimeInputControl({
  field,
  fieldState,
  inputId,
  inputClassName,
  disabled = false,
  hourAriaLabel,
  minuteAriaLabel,
  periodAriaLabel,
}: TimeInputControlProps) {
  const { t } = useTranslation();
  const hourInputRef = React.useRef<HTMLInputElement>(null);
  const minuteInputRef = React.useRef<HTMLInputElement>(null);

  const stringValue = typeof field.value === 'string' ? field.value : '';
  const parsed = parseTimeString(stringValue);
  const [hourText, setHourText] = React.useState(formatHourDisplay(parsed.hour));
  const [minuteText, setMinuteText] = React.useState(formatMinuteDisplay(parsed.minute));
  const [period, setPeriod] = React.useState<TimePeriod>(parsed.period);

  React.useEffect(() => {
    const next = parseTimeString(stringValue);
    setHourText(formatHourDisplay(next.hour));
    setMinuteText(formatMinuteDisplay(next.minute));
    setPeriod(next.period);
  }, [stringValue]);

  const isEmpty = !hourText && !minuteText;

  const commitTime = React.useCallback((hour: string, minute: string, nextPeriod: TimePeriod) => {
    const normalizedHour = normalizeHourInput(hour);
    const normalizedMinute = normalizeMinuteInput(minute);

    if (normalizedHour === null || normalizedMinute === null) return '';

    return formatTimeString({
      hour: normalizedHour,
      minute: normalizedMinute,
      period: nextPeriod,
    });
  }, []);

  const updateFieldValue = (nextHour: string, nextMinute: string, nextPeriod: TimePeriod) => {
    field.onChange(commitTime(nextHour, nextMinute, nextPeriod));
  };

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextHour = sanitizeHourDigits(event.target.value);
    setHourText(nextHour);
    const normalizedHour = normalizeHourInput(nextHour);
    const normalizedMinute = normalizeMinuteInput(minuteText);
    if (normalizedHour !== null && normalizedMinute !== null) {
      updateFieldValue(nextHour, minuteText, period);
    }
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextMinute = sanitizeDigits(event.target.value, 2);
    setMinuteText(nextMinute);
    const normalizedHour = normalizeHourInput(hourText);
    const normalizedMinute = normalizeMinuteInput(nextMinute);
    if (normalizedHour !== null && normalizedMinute !== null) {
      updateFieldValue(hourText, nextMinute, period);
    }
  };

  const handleHourKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowRight' || (event.key === 'Tab' && !event.shiftKey)) {
      const hour = normalizeHourInput(hourText);
      if (hour !== null) {
        event.preventDefault();
        minuteInputRef.current?.focus();
        minuteInputRef.current?.select();
      }
    }
  };

  const handleHourBlur = () => {
    const normalizedHour = normalizeHourInput(hourText);
    const normalizedMinute = normalizeMinuteInput(minuteText);

    if (normalizedHour === null) {
      if (!hourText.trim()) {
        setHourText('');
      }
    } else {
      setHourText(hourText.length === 2 ? hourText : String(normalizedHour));
    }

    if (normalizedHour !== null && normalizedMinute !== null) {
      updateFieldValue(String(normalizedHour), minuteText, period);
      return;
    }

    if (!hourText.trim() && !minuteText.trim()) {
      field.onChange('');
    }
  };

  const handleMinuteBlur = () => {
    const normalizedHour = normalizeHourInput(hourText);
    const normalizedMinute = normalizeMinuteInput(minuteText);
    const nextMinuteText = formatMinuteDisplay(normalizedMinute);

    setMinuteText(nextMinuteText);

    if (normalizedHour !== null && normalizedMinute !== null) {
      updateFieldValue(hourText, nextMinuteText, period);
      return;
    }

    if (!hourText.trim() && !minuteText.trim()) {
      field.onChange('');
    }
  };

  const handlePeriodChange = (nextPeriod: TimePeriod) => {
    setPeriod(nextPeriod);

    if (hourText.trim() && minuteText.trim()) {
      updateFieldValue(hourText, minuteText, nextPeriod);
    }
  };

  return (
    <div
      id={inputId}
      role='group'
      aria-invalid={fieldState.invalid}
      className={cn(formFieldStyles.timeControl, inputClassName)}
    >
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-4'>
          <input
            ref={hourInputRef}
            type='text'
            inputMode='numeric'
            autoComplete='off'
            disabled={disabled}
            value={hourText}
            maxLength={2}
            placeholder='----'
            aria-label={hourAriaLabel ?? t('forms.time.hour')}
            className={formFieldStyles.timeSegment}
            onChange={handleHourChange}
            onKeyDown={handleHourKeyDown}
            onBlur={handleHourBlur}
          />
          <span
            aria-hidden
            className={isEmpty ? formFieldStyles.timeSeparator : formFieldStyles.timeSeparatorFilled}
          >
            :
          </span>
          <input
            ref={minuteInputRef}
            type='text'
            inputMode='numeric'
            autoComplete='off'
            disabled={disabled}
            value={minuteText}
            maxLength={2}
            placeholder='----'
            aria-label={minuteAriaLabel ?? t('forms.time.minute')}
            className={formFieldStyles.timeSegment}
            onChange={handleMinuteChange}
            onBlur={handleMinuteBlur}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              disabled={disabled}
              aria-label={periodAriaLabel ?? t('forms.time.period')}
              className={formFieldStyles.timePeriodTrigger}
            >
              <span>{periodLabels[period]}</span>
              <ChevronDown className='size-6 stroke-[1.5]' aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center' className='min-w-24'>
            {(['AM', 'PM'] as const).map((option) => (
              <DropdownMenuItem key={option} onClick={() => handlePeriodChange(option)}>
                {periodLabels[option]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

const CustomTimeInput = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  optional,
  subLabel,
  wrapperClassName,
  labelClassName,
  inputClassName,
  disabled = false,
  hourAriaLabel,
  minuteAriaLabel,
  periodAriaLabel,
}: CustomTimeInputProps<TFieldValues>) => {
  const generatedId = React.useId();
  const inputId = generatedId;

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      htmlFor={inputId}
      labelClassName={labelClassName}
      name={name}
      optional={optional}
      required={required}
      subLabel={subLabel}
      label={label}
    >
      {(field, fieldState) => (
        <TimeInputControl
          field={field}
          fieldState={fieldState}
          inputId={inputId}
          inputClassName={inputClassName}
          disabled={disabled}
          hourAriaLabel={hourAriaLabel}
          minuteAriaLabel={minuteAriaLabel}
          periodAriaLabel={periodAriaLabel}
        />
      )}
    </FieldLayout>
  );
};

export default CustomTimeInput;
