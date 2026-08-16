import * as React from 'react';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import FieldLayout from './FieldLayout';
import FieldMessage from './FieldMessage';
import FileDocumentPlaceholder from './FileDocumentPlaceholder';
import FileImagePlaceholder from './FileImagePlaceholder';
import FileVideoPlaceholder from './FileVideoPlaceholder';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';

type CustomFileUploaderProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    disabled?: boolean;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    multiple?: boolean;
    dropzoneClassName?: string;
    previewClassName?: string;
  };

const defaultAcceptedTypes = [
  'image/*',
  'video/*',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFriendlyType = (type: string) => {
  if (type.endsWith('/*')) return type.replace('/*', '').toUpperCase();
  if (type.startsWith('.')) return type.slice(1).toUpperCase();
  if (type === 'application/pdf') return 'PDF';
  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'DOCX';
  }

  return type.split('/')[1]?.toUpperCase() ?? type;
};

const getFriendlyTypes = (types: string[]) => [...new Set(types.map(getFriendlyType))].join(', ');

const getFileExtension = (file: File) => `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;

const isAcceptedFile = (file: File, acceptedTypes: string[]) => {
  if (!acceptedTypes.length) return true;

  return acceptedTypes.some((acceptedType) => {
    if (acceptedType.endsWith('/*')) {
      return file.type.startsWith(acceptedType.replace('*', ''));
    }

    if (acceptedType.startsWith('.')) {
      return getFileExtension(file) === acceptedType.toLowerCase();
    }

    return file.type === acceptedType;
  });
};

type RejectedFile = {
  file: File;
  reason: string;
};

const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

const getUniqueFiles = (files: File[]) => {
  const fileMap = new Map<string, File>();

  files.forEach((file) => {
    fileMap.set(getFileKey(file), file);
  });

  return [...fileMap.values()];
};

const getFilesFromValue = (value: unknown, multiple: boolean) => {
  if (!value) return [];
  if (multiple && Array.isArray(value)) return value.filter(Boolean) as File[];
  if (value instanceof File) return [value];

  return [];
};

const getUrlFromValue = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === 'string' && value.trim()) return value;
  return null;
};

const isImageFile = (file: File) => file.type.startsWith('image/');
const isVideoFile = (file: File) => file.type.startsWith('video/');
const isDocumentFile = (file: File) =>
  file.type === 'application/pdf' ||
  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
  getFileExtension(file) === '.docx';

function FilePlaceholder({ file }: { file: File }) {
  if (isImageFile(file)) return <FileImagePlaceholder file={file} />;
  if (isVideoFile(file)) return <FileVideoPlaceholder file={file} />;
  if (isDocumentFile(file)) return <FileDocumentPlaceholder file={file} />;

  return (
    <div className='bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-md border'>
      <FileIcon className='size-5' />
    </div>
  );
}

function UrlImagePlaceholder({ url, alt }: { url: string; alt?: string }) {
  return (
    <div className='bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border'>
      <img
        alt={alt || 'Preview'}
        className='size-full object-cover'
        src={url}
      />
    </div>
  );
}

function CustomFileUploader<TFieldValues extends FieldValues = FieldValues>({
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
  maxSizeMB = 5,
  acceptedTypes = defaultAcceptedTypes,
  multiple = false,
  dropzoneClassName,
  previewClassName,
}: CustomFileUploaderProps<TFieldValues>) {
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const acceptAttr = acceptedTypes.length ? acceptedTypes.join(',') : undefined;

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
        const files = getFilesFromValue(field.value, multiple);
        const existingUrl = getUrlFromValue(field.value);
        const isDisabled = disabled || field.disabled;

        const validateAndSet = (incomingFiles: FileList | null) => {
          setUploadError('');

          if (!incomingFiles?.length) return;

          const nextFiles = Array.from(incomingFiles);
          const acceptedFiles: File[] = [];
          const rejectedFiles: RejectedFile[] = [];

          nextFiles.forEach((file) => {
            if (!isAcceptedFile(file, acceptedTypes)) {
              rejectedFiles.push({
                file,
                reason: `Invalid type. Allowed: ${getFriendlyTypes(acceptedTypes)}`,
              });
              return;
            }

            if (file.size > maxSizeBytes) {
              rejectedFiles.push({
                file,
                reason: `Too large. Max size is ${maxSizeMB} MB.`,
              });
              return;
            }

            acceptedFiles.push(file);
          });

          if (acceptedFiles.length) {
            if (multiple) {
              field.onChange(getUniqueFiles([...files, ...acceptedFiles]));
            } else {
              field.onChange(acceptedFiles[0]);
            }
          }

          if (rejectedFiles.length) {
            const rejectedFileSummary = rejectedFiles
              .map(({ file, reason }) => `${file.name}: ${reason}`)
              .join('\n');

            toast({
              description: rejectedFileSummary,
              title:
                acceptedFiles.length > 0
                  ? 'Some files were not accepted'
                  : 'Files were not accepted',
              variant: 'destructive',
            });

            if (!acceptedFiles.length) {
              setUploadError('No valid files were selected.');
            }
          }
        };

        const removeFile = (index: number) => {
          setUploadError('');

          if (!multiple) {
            field.onChange(null);
            if (inputRef.current) inputRef.current.value = '';
            return;
          }

          const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index);
          field.onChange(updatedFiles.length ? updatedFiles : null);
          if (inputRef.current) inputRef.current.value = '';
        };

        return (
          <div className='flex flex-col gap-2'>
            <div
              aria-disabled={isDisabled}
              aria-invalid={fieldState.invalid}
              aria-label='Upload file'
              className={cn(
                'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors focus-visible:ring-3 focus-visible:outline-none aria-invalid:ring-3',
                dragOver && 'border-primary bg-primary/5',
                isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
                dropzoneClassName,
              )}
              onClick={() => {
                if (!isDisabled) inputRef.current?.click();
              }}
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
                if (!isDisabled) validateAndSet(event.dataTransfer.files);
              }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !isDisabled) {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              role='button'
              tabIndex={isDisabled ? -1 : 0}
            >
              <span className='bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full'>
                <UploadCloudIcon className='size-5' />
              </span>

              <span className='flex max-w-full flex-col gap-1'>
                <span className='text-foreground text-sm font-medium'>
                  Click to upload or drag and drop
                </span>
                <span className='text-muted-foreground text-xs leading-5'>
                  {getFriendlyTypes(acceptedTypes)} · Max {maxSizeMB} MB
                </span>
              </span>

              <input
                accept={acceptAttr}
                className='hidden'
                disabled={isDisabled}
                multiple={multiple}
                onBlur={field.onBlur}
                onChange={(event) => validateAndSet(event.target.files)}
                ref={inputRef}
                type='file'
              />
            </div>

            {uploadError ? <FieldMessage error={uploadError} /> : null}

            {existingUrl && files.length === 0 ? (
              <div
                className={cn(
                  'border-input bg-background flex items-center justify-between gap-3 rounded-lg border p-2 shadow-xs',
                  previewClassName,
                )}
              >
                <div className='flex min-w-0 items-center gap-3'>
                  <UrlImagePlaceholder
                    alt='Existing image'
                    url={existingUrl}
                  />
                  <span className='min-w-0'>
                    <span className='text-foreground block truncate text-sm font-medium'>
                      {t('forms.labels.current_image', 'Current image')}
                    </span>
                    <span className='text-muted-foreground block text-xs'>
                      {t('forms.labels.uploaded', 'Uploaded')}
                    </span>
                  </span>
                </div>

                <button
                  aria-label='Remove current image'
                  className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50'
                  disabled={isDisabled}
                  onClick={() => {
                    field.onChange(null);
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                  type='button'
                >
                  <XIcon className='size-4' />
                </button>
              </div>
            ) : null}

            {files.length > 0 ? (
              <ul className='flex flex-col gap-2'>
                {files.map((file, index) => (
                  <li
                    className={cn(
                      'border-input bg-background flex items-center justify-between gap-3 rounded-lg border p-2 shadow-xs',
                      previewClassName,
                    )}
                    key={`${file.name}-${file.size}-${index}`}
                  >
                    <div className='flex min-w-0 items-center gap-3'>
                      <FilePlaceholder file={file} />
                      <span className='min-w-0'>
                        <span className='text-foreground block truncate text-sm font-medium'>
                          {file.name}
                        </span>
                        <span className='text-muted-foreground block text-xs'>
                          {formatBytes(file.size)}
                        </span>
                      </span>
                    </div>

                    <button
                      aria-label={`Remove ${file.name}`}
                      className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50'
                      disabled={isDisabled}
                      onClick={() => removeFile(index)}
                      type='button'
                    >
                      <XIcon className='size-4' />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      }}
    </FieldLayout>
  );
}

export default CustomFileUploader;
