import type { FieldValues } from 'react-hook-form';
import CustomComboboxMultiple from './CustomComboboxMultiple';
import CustomComboboxSingle from './CustomComboboxSingle';
import type { ComboboxOption } from './combobox.types';
import type { FieldBaseProps } from './field.types';

export type CustomComboboxOption = ComboboxOption;

export type CustomComboboxProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    options: ComboboxOption[];
    multiple?: boolean;
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    showSelectAll?: boolean;
    selectAllLabel?: string;
    maxVisibleLabels?: number;
    triggerClassName?: string;
    contentClassName?: string;
    isLoading?: boolean;
    clearable?: boolean;
  };

export default function CustomCombobox<TFieldValues extends FieldValues = FieldValues>({
  multiple = false,
  onValueChange,
  ...props
}: CustomComboboxProps<TFieldValues>) {
  if (multiple) {
    return (
      <CustomComboboxMultiple
        {...props}
        onValueChange={onValueChange as ((value: string[]) => void) | undefined}
      />
    );
  }

  return (
    <CustomComboboxSingle
      {...props}
      onValueChange={onValueChange as ((value: string) => void) | undefined}
    />
  );
}
