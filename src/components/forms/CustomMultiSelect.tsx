import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';

export type CustomMultiSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type CustomMultiSelectProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    options: CustomMultiSelectOption[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    maxVisibleLabels?: number;
    triggerClassName?: string;
    contentClassName?: string;
  };

function CustomMultiSelect<TFieldValues extends FieldValues = FieldValues>({
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
  defaultValue = [],
  onValueChange,
  placeholder = 'Select options',
  disabled,
  maxVisibleLabels = 2,
}: CustomMultiSelectProps<TFieldValues>) {
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
        const selectedValues: string[] = Array.isArray(field.value) ? field.value : defaultValue;
        const selectedOptions = options.filter((option) => selectedValues.includes(option.value));
        const visibleLabels = selectedOptions
          .slice(0, maxVisibleLabels)
          .map((option) => option.label);
        const hiddenCount = Math.max(selectedOptions.length - visibleLabels.length, 0);
        const triggerText =
          selectedOptions.length > 0
            ? `${visibleLabels.join(', ')}${hiddenCount ? ` +${hiddenCount}` : ''}`
            : placeholder;

        const updateValue = (nextValue: string[]) => {
          field.onChange(nextValue);
          onValueChange?.(nextValue);
        };

        const toggleOption = (optionValue: string) => {
          const nextValue = selectedValues.includes(optionValue)
            ? selectedValues.filter((item) => item !== optionValue)
            : [...selectedValues, optionValue];

          updateValue(nextValue);
        };

        const clearValue = (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          updateValue([]);
        };

        return (
          <>
            {selectedValues.map((selectedValue) => (
              <input
                key={selectedValue}
                name={field.name}
                type='hidden'
                value={selectedValue}
              />
            ))}

            <PopoverPrimitive.Root>
              <PopoverPrimitive.Trigger asChild>
                <Button
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    formFieldStyles.selectTrigger,
                    'justify-between gap-2 px-3 font-normal',
                    selectedOptions.length === 0 && 'text-muted-foreground',
                    triggerClassName,
                  )}
                  disabled={disabled}
                  id={triggerId}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  type='button'
                  variant='outline'
                >
                  <span className='truncate'>{triggerText}</span>
                  <span className='flex items-center gap-1'>
                    {selectedOptions.length > 0 ? (
                      <span
                        aria-label={`${selectedOptions.length} selected`}
                        className='bg-muted text-muted-foreground rounded-sm px-1.5 py-0.5 text-xs font-medium'
                      >
                        {selectedOptions.length}
                      </span>
                    ) : null}
                    {selectedOptions.length > 0 ? (
                      <span
                        className='text-muted-foreground hover:text-foreground inline-flex size-5 items-center justify-center rounded-sm'
                        onClick={(event) => {
                          clearValue(event);
                        }}
                        role='button'
                        tabIndex={-1}
                      >
                        <XIcon className='size-3.5' />
                      </span>
                    ) : null}
                    <ChevronDownIcon className='text-muted-foreground size-4' />
                  </span>
                </Button>
              </PopoverPrimitive.Trigger>

              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  align='start'
                  className={cn(
                    'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 mt-1 max-h-72 w-(--radix-popover-trigger-width) min-w-64 overflow-y-auto rounded-md border p-1 shadow-md outline-none',
                    contentClassName,
                  )}
                  sideOffset={4}
                >
                  {options.map((option) => {
                    const checked = selectedValues.includes(option.value);

                    return (
                      <button
                        className={cn(
                          'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground flex w-full items-center gap-3 rounded-sm px-2 py-2 text-start text-sm transition-colors outline-none disabled:pointer-events-none disabled:opacity-50',
                          checked && 'bg-accent/70',
                        )}
                        disabled={option.disabled}
                        key={option.value}
                        onClick={() => {
                          toggleOption(option.value);
                        }}
                        type='button'
                      >
                        <Checkbox
                          checked={checked}
                          className='pointer-events-none'
                          tabIndex={-1}
                        />
                        <span className='min-w-0 flex-1 truncate'>{option.label}</span>
                        {checked ? <CheckIcon className='text-muted-foreground size-4' /> : null}
                      </button>
                    );
                  })}
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
          </>
        );
      }}
    </FieldLayout>
  );
}

export default CustomMultiSelect;
