import * as React from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import FieldLayout from '@/components/forms/FieldLayout';
import FieldMessage from '@/components/forms/FieldMessage';
import { formFieldStyles } from '@/components/forms/form-field.styles';
import type { FieldBaseProps } from '@/components/forms/field.types';
import { Trash2, Upload } from 'lucide-react';
import {
  ACCEPTED_DOCUMENT_FILE_EXTENSIONS,
  ACCEPTED_DOCUMENT_FILE_TYPES,
  MAX_DOCUMENT_FILE_SIZE_BYTES,
  MAX_DOCUMENT_FILE_SIZE_MB,
} from '@/constants';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
// import { getCurrLocale } from '@/utils/language';
import {
  getDocumentFileSizeErrorMessage,
  getDocumentFileTypeErrorMessage,
  isAcceptedDocumentFile,
} from '@/utils/schemas';
import PolicyIcons from '@/assets/svgs/policy-icons.svg';

type CustomDocumentUploaderProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    disabled?: boolean;
    /** Field name for the existing file URL (from server). */
    filePreviewName?: string;
    /** Field name for the existing file extension (e.g. ".docx"). */
    fileExtensionName?: string;
  };

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFriendlyType = (type: string) => {
  if (type === 'application/pdf') return 'PDF';
  if (type === 'application/msword') return 'DOC';
  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'DOCX';
  }
  if (type.startsWith('.')) return type.slice(1).toUpperCase();

  return type.split('/')[1]?.toUpperCase() ?? type;
};

const getFriendlyTypes = (types: string[]) => [...new Set(types.map(getFriendlyType))].join(', ');

/** Returns the PolicyIcons key from a MIME type or extension string. */
// const getFileIconName = (file: File): string => {
//   const mime = file.type;
//   const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

//   if (mime === 'application/pdf' || ext === 'pdf') return 'PDF';
//   if (
//     mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//     ext === 'docx'
//   )
//     return 'Docs';
//   if (mime === 'application/msword' || ext === 'doc') return 'Word';

//   return 'PDF';
// };

/** Returns the PolicyIcons key from a file extension string (e.g. ".docx", ".pdf"). */
const getIconFromExtension = (ext: string): 'PDF' | 'Word' | 'Docs' => {
  const normalized = ext.replace('.', '').toLowerCase();
  if (normalized === 'pdf') return 'PDF';
  if (normalized === 'docx') return 'Docs';
  if (normalized === 'doc') return 'Word';
  return 'Docs';
};

const getFileFromValue = (value: unknown) => {
  if (!value) return null;
  if (value instanceof File) return value;

  return null;
};

function CustomDocumentUploader<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  optional,
  subLabel,
  wrapperClassName,
  labelClassName,
  disabled = false,
  filePreviewName,
  fileExtensionName,
}: CustomDocumentUploaderProps<TFieldValues>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const acceptedTypes = [...ACCEPTED_DOCUMENT_FILE_TYPES, ...ACCEPTED_DOCUMENT_FILE_EXTENSIONS];
  const acceptAttr = acceptedTypes.join(',');
  const { t } = useTranslation();
  const { clearErrors, trigger, watch, setValue } = useFormContext();

  // Read existing URL / extension from sibling fields (populated from API)
  const filePreviewUrl: string | null = filePreviewName
    ? (watch(filePreviewName as any) ?? null)
    : null;
  const fileExtension: string | null = fileExtensionName
    ? (watch(fileExtensionName as any) ?? null)
    : null;

  React.useEffect(() => {
    const preventFileNavigation = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes('Files')) return;

      event.preventDefault();
    };

    window.addEventListener('dragover', preventFileNavigation);
    window.addEventListener('drop', preventFileNavigation);

    return () => {
      window.removeEventListener('dragover', preventFileNavigation);
      window.removeEventListener('drop', preventFileNavigation);
    };
  }, []);

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      label={label}
      labelClassName={labelClassName}
      name={name}
      optional={optional}
      required={required}
      subLabel={subLabel}
    >
      {(field, fieldState) => {
        const file = getFileFromValue(field.value);
        const isDisabled = disabled || field.disabled;

        const validateAndSet = async (incomingFiles: FileList | null) => {
          setUploadError('');

          if (!incomingFiles?.length) return;

          const selectedFile = incomingFiles[0];

          if (!(await isAcceptedDocumentFile(selectedFile))) {
            const errorMsg = getDocumentFileTypeErrorMessage();
            toast({
              description: errorMsg,
              title: t('forms.labels.file_not_accepted'),
              variant: 'destructive',
            });
            setUploadError(errorMsg);
            return;
          }

          if (selectedFile.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
            const errorMsg = getDocumentFileSizeErrorMessage();
            toast({
              description: errorMsg,
              title: t('forms.labels.file_not_accepted'),
              variant: 'destructive',
            });
            setUploadError(errorMsg);
            return;
          }

          field.onChange(selectedFile);
          clearErrors(name as any);
          void trigger(name as any);
        };

        const removeFile = () => {
          setUploadError('');
          field.onChange(null);
          if (inputRef.current) inputRef.current.value = '';
          clearErrors(name as any);
          void trigger(name as any);
        };

        const removeExistingFile = () => {
          if (filePreviewName) setValue(filePreviewName as any, null);
          if (fileExtensionName) setValue(fileExtensionName as any, null);
          setUploadError('');
        };

        const handleClick = () => {
          if (!isDisabled && !file && !filePreviewUrl) inputRef.current?.click();
        };

        return (
          <div className='flex flex-col gap-2'>
            <div
              aria-disabled={isDisabled}
              aria-invalid={fieldState.invalid}
              aria-label={t('forms.labels.upload_document')}
              className={cn(
                'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex items-center gap-4 rounded-[4px] border-2 border-dashed border-neutral-100 p-2 transition-colors focus-visible:ring-3 focus-visible:outline-none aria-invalid:ring-3',
                dragOver && 'border-primary bg-primary/5',
                isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
                !isDisabled && !file && 'cursor-pointer',
              )}
              onClick={handleClick}
              onDragEnter={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isDisabled) setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDragOver={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isDisabled) setDragOver(true);
              }}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setDragOver(false);
                if (!isDisabled) void validateAndSet(event.dataTransfer.files);
              }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !isDisabled && !file) {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              role='button'
              tabIndex={isDisabled ? -1 : 0}
            >
              {file ? (
                <>
                  <span className='flex items-center justify-center'>
                    <img src={PolicyIcons} alt='policy-icons' className='h-4 w-4' />
                  </span>

                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <span className='type-body-sm-semibold truncate text-neutral-900'>
                      {file.name}
                    </span>
                    <span className='type-body-sm text-neutral-400'>{formatBytes(file.size)}</span>
                  </div>

                  <button
                    aria-label={`${t('forms.labels.remove_file')} - ${file.name}`}
                    className='text-error-500 hover:bg-destructive/10 inline-flex size-10 shrink-0 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50'
                    disabled={isDisabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFile();
                    }}
                    type='button'
                  >
                    <Trash2 className='h-4 w-4' aria-hidden='true' />
                  </button>
                </>
              ) : filePreviewUrl ? (
                // ── Existing server file (from GET) ──────────────────────────
                <>
                  <span className='flex items-center justify-center'>
                    <img src={PolicyIcons} alt='policy-icons' className='h-4 w-4' />
                  </span>

                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <span className='type-body-sm-semibold truncate text-neutral-900'>
                      {t('forms.labels.current_file') || filePreviewUrl.split('/').pop()}
                    </span>
                    <span className='type-body-sm text-neutral-400'>
                      {fileExtension
                        ? getIconFromExtension(fileExtension)
                        : t('forms.labels.existing_file')}
                    </span>
                  </div>

                  <button
                    // aria-label={t('forms.labels.remove_file')}
                    className='text-error-500 hover:bg-destructive/10 inline-flex size-10 shrink-0 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50'
                    disabled={isDisabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeExistingFile();
                    }}
                    type='button'
                  >
                    <Trash2 className='h-4 w-4' aria-hidden='true' />
                  </button>
                </>
              ) : (
                <>
                  <span className='bg-muted text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-[8px]'>
                    <Upload className='h-4 w-4' aria-hidden='true' />
                  </span>

                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <span className='type-body-sm-semibold text-neutral-900'>
                      {t('forms.labels.upload_document')}
                    </span>
                    <span className='type-body-sm text-neutral-400'>
                      {getFriendlyTypes(acceptedTypes)} • {t('forms.labels.max_size')}{' '}
                      {MAX_DOCUMENT_FILE_SIZE_MB}MB
                    </span>
                  </div>
                </>
              )}

              <input
                accept={acceptAttr}
                className='hidden'
                disabled={isDisabled}
                multiple={false}
                onBlur={field.onBlur}
                onChange={(event) => {
                  void validateAndSet(event.target.files);
                }}
                ref={inputRef}
                type='file'
              />
            </div>

            {uploadError ? <FieldMessage error={uploadError} /> : null}
          </div>
        );
      }}
    </FieldLayout>
  );
}

export default CustomDocumentUploader;
