import { cn } from '@/lib/utils';

type SidebarUserProfileProps = {
  name: string;
  role?: string;
  subtitle?: string;
  avatarUrl?: string | null;
  className?: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase())
    .join('');
}

function UserProfile({
  name = '',
  role = '',
  subtitle,
  avatarUrl,
  className,
}: SidebarUserProfileProps) {
  const secondaryText = subtitle ?? role;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {avatarUrl ? (
        <img
          alt={name}
          className='size-10 shrink-0 rounded-full object-cover'
          src={avatarUrl}
        />
      ) : (
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-500'>
          {getInitials(name)}
        </div>
      )}
      <div className='min-w-0 flex-1'>
        <p className='type-body-sm-semibold truncate text-neutral-900'>{name}</p>
        {secondaryText ? (
          <p className='type-body-xs truncate text-neutral-400'>{secondaryText}</p>
        ) : null}
      </div>
    </div>
  );
}

export default UserProfile;
