import { FileTextIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileDocumentPlaceholderProps = {
  file: File;
  className?: string;
};

const getDocumentLabel = (file: File) => {
  const extension = file.name.split('.').pop()?.toUpperCase();

  if (extension) return extension;
  if (file.type === 'application/pdf') return 'PDF';

  return 'DOC';
};

function FileDocumentPlaceholder({ file, className }: FileDocumentPlaceholderProps) {
  return (
    <div
      className={cn(
        'bg-muted text-muted-foreground flex size-12 shrink-0 flex-col items-center justify-center rounded-md border',
        className,
      )}
    >
      <FileTextIcon className='size-5' />
      <span className='mt-0.5 max-w-10 truncate text-[10px] leading-none font-semibold'>
        {getDocumentLabel(file)}
      </span>
    </div>
  );
}

export default FileDocumentPlaceholder;
