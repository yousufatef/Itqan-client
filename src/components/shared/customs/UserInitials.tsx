import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name?: string) => {
  if (!name) return '';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase())
    .join('');
};

type UserInitialsProps = {
  name?: string;
  className?: string;
  avatarClassName?: string;
  textClassName?: string;
  roleName?: string;
  imageUrl?: string;
  showName?: boolean;
};

export default function UserInitials({
  name = '',
  className,
  avatarClassName,
  textClassName,
  roleName,
  imageUrl,
  showName = true,
}: UserInitialsProps) {
  return (
    <div className='flex items-center gap-2'>
      <div className={cn('flex size-10 shrink-0 items-center justify-center', className)}>
        {imageUrl ? (
          <Avatar className='size-8 shadow-[0_4px_10px_rgba(13,59,46,0.07)]'>
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className='bg-primary-500 text-primary-50 text-sm font-medium'>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span
            className={cn(
              'bg-primary-500 text-primary-50 flex size-8 items-center justify-center rounded-full text-sm font-medium shadow-[0_4px_10px_rgba(13,59,46,0.07)]',
              avatarClassName,
            )}
          >
            {getInitials(name)}
          </span>
        )}
      </div>
      {showName && (
        <div className='flex flex-col'>
          <span className={cn('type-body-xs-semibold capitalize', textClassName)}>{name}</span>
          {roleName && <span className='type-body-xs text-neutral-400'>{roleName}</span>}
        </div>
      )}
    </div>
  );
}
