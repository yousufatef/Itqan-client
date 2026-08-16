import * as React from 'react';
import { Building2, ChevronDown, Search, X } from 'lucide-react';
import type { FieldValues } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { ComboboxBaseProps, ComboboxOption } from './combobox.types';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';

type ComboboxMode = 'single' | 'multiple';

type ComboboxFieldProps<TFieldValues extends FieldValues = FieldValues> =
  ComboboxBaseProps<TFieldValues> & {
    mode: ComboboxMode;
    showSelectAll?: boolean;
    selectAllLabel?: string;
    maxVisibleLabels?: number;
    onValueChange?: (value: string | string[]) => void;
  };

export function filterComboboxOptions(options: ComboboxOption[], searchQuery: string) {
  if (!searchQuery.trim()) return options;

  const query = searchQuery.toLowerCase().trim();

  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(query) ||
      (option.subLabel && option.subLabel.toLowerCase().includes(query)),
  );
}

export function ComboboxField<TFieldValues extends FieldValues = FieldValues>({
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
  options,
  mode,
  onValueChange,
  placeholder = 'Select option',
  searchPlaceholder,
  disabled = false,
  showSelectAll = true,
  selectAllLabel = 'Select All',
  maxVisibleLabels = 2,
  isLoading = false,
  clearable = true,
  emptyMessage = 'No results found',
  loadingMessage = 'Loading options...',
}: ComboboxFieldProps<TFieldValues>) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const generatedId = React.useId();
  const triggerId = generatedId;
  const isMultiple = mode === 'multiple';

  const filteredOptions = React.useMemo(
    () => filterComboboxOptions(options, searchQuery),
    [options, searchQuery],
  );

  const defaultSearchPlaceholder = isMultiple ? 'Search apartment...' : 'Search Building...';

  React.useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

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
        const rawValue = field.value;

        const selectedValues: string[] = React.useMemo(() => {
          if (isMultiple) {
            if (Array.isArray(rawValue)) return rawValue;
            if (typeof rawValue === 'string' && rawValue) return [rawValue];
            return [];
          }

          return typeof rawValue === 'string' && rawValue ? [rawValue] : [];
        }, [isMultiple, rawValue]);

        const selectedOptions = React.useMemo(
          () => options.filter((option) => selectedValues.includes(option.value)),
          [options, selectedValues],
        );

        let triggerText = placeholder;

        if (selectedOptions.length > 0) {
          if (!isMultiple) {
            triggerText = selectedOptions[0].label;
          } else {
            const visibleLabels = selectedOptions
              .slice(0, maxVisibleLabels)
              .map((option) => option.label);
            const hiddenCount = selectedOptions.length - visibleLabels.length;
            triggerText = `${visibleLabels.join(', ')}${hiddenCount > 0 ? ` +${hiddenCount}` : ''}`;
          }
        }

        const updateValue = (nextValue: string | string[]) => {
          field.onChange(nextValue);
          onValueChange?.(nextValue);
        };

        const handleOptionClick = (optionValue: string) => {
          if (!isMultiple) {
            updateValue(optionValue);
            setOpen(false);
            return;
          }

          const isSelected = selectedValues.includes(optionValue);
          const nextValues = isSelected
            ? selectedValues.filter((value) => value !== optionValue)
            : [...selectedValues, optionValue];

          updateValue(nextValues);
        };

        const allFilteredValues = filteredOptions.map((option) => option.value);
        const isAllSelected =
          allFilteredValues.length > 0 &&
          allFilteredValues.every((value) => selectedValues.includes(value));

        const handleToggleSelectAll = () => {
          if (isAllSelected) {
            updateValue(selectedValues.filter((value) => !allFilteredValues.includes(value)));
            return;
          }

          updateValue(Array.from(new Set([...selectedValues, ...allFilteredValues])));
        };

        const handleClear = (event: React.MouseEvent) => {
          event.stopPropagation();
          updateValue(isMultiple ? [] : '');
        };

        return (
          <Popover
            onOpenChange={setOpen}
            open={open}
          >
            <PopoverTrigger asChild>
              <button
                id={triggerId}
                type='button'
                aria-invalid={fieldState.invalid}
                disabled={disabled || isLoading}
                onBlur={field.onBlur}
                ref={field.ref}
                className={cn(
                  formFieldStyles.comboboxTrigger,
                  selectedOptions.length === 0 && 'text-[#8C8A84]',
                  triggerClassName,
                )}
              >
                {!isMultiple && selectedOptions.length > 0 ? (
                  <span className='flex flex-1 flex-col truncate text-start'>
                    <span className='truncate'>{selectedOptions[0].label}</span>
                    {(selectedOptions[0].additionalInfo || selectedOptions[0].subLabel) ? (
                      <span className='truncate text-sm text-[#A9A49C]'>
                        {selectedOptions[0].additionalInfo ?? selectedOptions[0].subLabel}
                      </span>
                    ) : null}
                  </span>
                ) : (
                  <span className='truncate flex-1 text-start'>{triggerText}</span>
                )}
                <span className='flex shrink-0 items-center gap-1.5 text-[#8C8A84]'>
                  {isMultiple && selectedOptions.length > 0 ? (
                    <span className='rounded-[2px] bg-[#E8E6E1] px-1.5 py-0.5 text-xs font-medium text-neutral-800'>
                      {selectedOptions.length}
                    </span>
                  ) : null}
                  {clearable && selectedOptions.length > 0 ? (
                    <span
                      role='button'
                      tabIndex={-1}
                      onClick={handleClear}
                      className='hover:text-neutral-900 inline-flex size-4 items-center justify-center rounded-sm transition-colors'
                    >
                      <X className='size-3.5' />
                    </span>
                  ) : null}
                  <ChevronDown className='size-5 text-primary-500' />
                </span>
              </button>
            </PopoverTrigger>

            <PopoverContent
              align='start'
              sideOffset={4}
              className={cn(formFieldStyles.comboboxContent, contentClassName)}
            >
              <div className='relative flex w-full items-center'>
                <Search className='pointer-events-none absolute left-4 size-5 text-[#999791]' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder || defaultSearchPlaceholder}
                  className={formFieldStyles.comboboxSearch}
                />
              </div>

              {isMultiple && showSelectAll && options.length > 0 ? (
                <div
                  onClick={handleToggleSelectAll}
                  className='flex min-h-9 cursor-pointer select-none items-center gap-2.5 rounded-[4px] px-2 py-1 text-start transition-colors hover:bg-white'
                >
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleToggleSelectAll}
                    className={cn(
                      formFieldStyles.comboboxCheckbox,
                      formFieldStyles.comboboxCheckboxSelectAll,
                    )}
                  />
                  <span className='type-body-md font-normal text-neutral-900'>{selectAllLabel}</span>
                </div>
              ) : null}

              <div className='flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain pr-0.5'>
                {isLoading ? (
                  <div className='py-6 text-center text-xs text-[#8C8A84]'>{loadingMessage}</div>
                ) : filteredOptions.length === 0 ? (
                  <div className='py-6 text-center text-xs text-[#8C8A84]'>{emptyMessage}</div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);

                    return (
                      <div
                        key={option.value}
                        onClick={() => !option.disabled && handleOptionClick(option.value)}
                        className={cn(
                          formFieldStyles.comboboxOption,
                          isMultiple ? 'min-h-16 py-2' : 'min-h-10 py-2',
                          isSelected
                            ? formFieldStyles.comboboxOptionSelected
                            : formFieldStyles.comboboxOptionDefault,
                          option.disabled && 'pointer-events-none opacity-50',
                        )}
                      >
                        {isMultiple ? (
                          <Checkbox
                            checked={isSelected}
                            className={cn(
                              formFieldStyles.comboboxCheckbox,
                              formFieldStyles.comboboxCheckboxMultiple,
                            )}
                          />
                        ) : null}

                        {option.image !== undefined ? (
                          <div className={formFieldStyles.comboboxThumbnail}>
                            {option.image ? (
                              <img
                                src={option.image}
                                alt={option.label}
                                className='size-full object-cover'
                                onError={(event) => {
                                  (event.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Building2 className='size-5 text-neutral-400' />
                            )}
                          </div>
                        ) : null}

                        <div className='flex min-w-0 flex-1 flex-col'>
                          <span
                            className={cn(
                              'truncate type-body-md leading-5',
                              isSelected ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-900',
                            )}
                          >
                            {option.label}
                          </span>
                          {(option.subLabel || option.additionalInfo) ? (
                            <span className='mt-0.5 truncate text-sm leading-5 text-[#A9A49C]'>
                              {option.subLabel ?? option.additionalInfo}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
        );
      }}
    </FieldLayout>
  );
}
