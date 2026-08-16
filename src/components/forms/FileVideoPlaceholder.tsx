import { useEffect, useState } from 'react';
import { PlayIcon, VideoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileVideoPlaceholderProps = {
  file: File;
  className?: string;
};

function FileVideoPlaceholder({ file, className }: FileVideoPlaceholderProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div
      className={cn(
        'bg-muted relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border',
        className,
      )}
    >
      {previewUrl ? (
        <video
          aria-label={file.name}
          className='size-full object-cover'
          muted
          preload='metadata'
          src={previewUrl}
        />
      ) : (
        <VideoIcon className='text-muted-foreground size-5' />
      )}
      <span className='absolute inset-0 grid place-items-center bg-black/20 text-white'>
        <PlayIcon className='size-4 fill-current' />
      </span>
    </div>
  );
}

export default FileVideoPlaceholder;
