import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';
import { Spinner } from '@/components/ui/spinner';
import { useDirection } from '../ui/direction';

export type CustomSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type CustomSelectProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Select>,
  'name'
> &
  FieldBaseProps<TFieldValues> & {
    options: CustomSelectOption[];
    placeholder?: string;
    triggerClassName?: string;
    contentClassName?: string;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
  };

function CustomSelect<TFieldValues extends FieldValues = FieldValues>({
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
  placeholder,
  options,
  onValueChange,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  ...props
}: CustomSelectProps<TFieldValues>) {
  const dir = useDirection();
  const generatedId = React.useId();
  const triggerId = generatedId;
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    const reachedBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 20;

    if (reachedBottom && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  };

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
      {(field, fieldState) => (
        <Select
          {...props}
          name={field.name}
          onValueChange={(value) => {
            field.onChange(value);
            onValueChange?.(value);
          }}
          required={required}
          value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
          dir={dir}
        >
          <SelectTrigger
            aria-invalid={fieldState.invalid}
            className={cn(
              formFieldStyles.selectTrigger,
              triggerClassName,
              'border-neutral-100 bg-white hover:bg-[#F0F0F0]',
            )}
            id={triggerId}
            onBlur={field.onBlur}
            ref={field.ref}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className={contentClassName}
            position='popper'
            sideOffset={4}
            align='start'
          >
            <div
              className='max-h-60 overflow-y-auto'
              onScroll={handleScroll}
            >
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}

                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}

              {isLoadingMore && (
                <div className='flex justify-center py-3'>
                  <Spinner />
                </div>
              )}
            </div>
          </SelectContent>
        </Select>
      )}
    </FieldLayout>
  );
}

export default CustomSelect;
