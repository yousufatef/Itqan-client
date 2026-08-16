import CustomInput, { type CustomInputProps } from './CustomInput';
import { InputTrimmer, trimStringValues } from '@/utils/input';
import type { FieldValues } from 'react-hook-form';

type CustomPhoneInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  CustomInputProps<TFieldValues>,
  'autoComplete' | 'inputMode' | 'type'
>;

const normalizePhoneValue = (value: string) => {
  return InputTrimmer(value.replace(/[^\d+\s()-]/g, '').replace(/(?!^)\+/g, '')) as string;
};

function CustomPhoneInput<TFieldValues extends FieldValues = FieldValues>({
  onBlur,
  onChange,
  ...props
}: CustomPhoneInputProps<TFieldValues>) {
  return (
    <CustomInput
      autoComplete='tel'
      inputMode='tel'
      onBlur={(event) => {
        event.currentTarget.value = trimStringValues(
          normalizePhoneValue(event.currentTarget.value),
        );
        onBlur?.(event);
      }}
      onChange={(event) => {
        event.currentTarget.value = normalizePhoneValue(event.currentTarget.value);
        onChange?.(event);
      }}
      trimValue={false}
      type='tel'
      {...props}
    />
  );
}

export default CustomPhoneInput;
