import { useEffect, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileImagePlaceholderProps = {
  file: File;
  className?: string;
};

function FileImagePlaceholder({ file, className }: FileImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (imageError) {
    return (
      <div
        className={cn(
          'bg-muted flex size-12 shrink-0 items-center justify-center rounded-md border',
          className,
        )}
      >
        <ImageIcon className='text-muted-foreground size-5' />
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div
        className={cn(
          'bg-muted flex size-12 shrink-0 items-center justify-center rounded-md border',
          className,
        )}
      >
        <ImageIcon className='text-muted-foreground size-5' />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border',
        className,
      )}
    >
      <img
        alt={file.name}
        className='size-full object-cover'
        onError={() => setImageError(true)}
        src={previewUrl}
      />
    </div>
  );
}

export default FileImagePlaceholder;
