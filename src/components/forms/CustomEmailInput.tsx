import CustomInput, { type CustomInputProps } from './CustomInput';
import type { FieldValues } from 'react-hook-form';

type CustomEmailInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  CustomInputProps<TFieldValues>,
  'autoComplete' | 'inputMode' | 'type'
>;

function CustomEmailInput<TFieldValues extends FieldValues = FieldValues>(
  props: CustomEmailInputProps<TFieldValues>,
) {
  return (
    <CustomInput
      autoComplete='email'
      inputMode='email'
      type='email'
      {...props}
    />
  );
}

export default CustomEmailInput;
