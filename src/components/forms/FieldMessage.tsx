import { cn } from '@/lib/utils';
import { formFieldStyles } from './form-field.styles';

type FieldMessageProps = {
  id?: string;
  error?: string;
  helperText?: string;
};

function FieldMessage({ id, error, helperText }: FieldMessageProps) {
  if (error) {
    return (
      <p
        className={formFieldStyles.error}
        id={id}
        role='alert'
      >
        {error}
      </p>
    );
  }

  if (helperText) {
    return (
      <p
        className={cn(formFieldStyles.helper)}
        id={id}
      >
        {helperText}
      </p>
    );
  }

  return null;
}

export default FieldMessage;
