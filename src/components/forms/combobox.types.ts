import type { FieldValues } from 'react-hook-form';
import type { FieldBaseProps } from './field.types';

export type ComboboxOption = {
  label: string;
  value: string;
  subLabel?: string;
  additionalInfo?: string;
  image?: string;
  disabled?: boolean;
};

export type ComboboxBaseProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    options: ComboboxOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    triggerClassName?: string;
    contentClassName?: string;
    isLoading?: boolean;
    clearable?: boolean;
    emptyMessage?: string;
    loadingMessage?: string;
  };

export type ComboboxSingleProps<TFieldValues extends FieldValues = FieldValues> =
  ComboboxBaseProps<TFieldValues> & {
    onValueChange?: (value: string) => void;
  };

export type ComboboxMultipleProps<TFieldValues extends FieldValues = FieldValues> =
  ComboboxBaseProps<TFieldValues> & {
    onValueChange?: (value: string[]) => void;
    showSelectAll?: boolean;
    selectAllLabel?: string;
    maxVisibleLabels?: number;
  };
