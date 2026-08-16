import { CreditCard, LogOut, Settings, ShieldCheck, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import { useLogoutApi } from '@/modules/auth/hooks/useLogoutApi';

type CustomUserMenuAvatarProps = {
  name: string;
  email: string;
  imageUrl?: string;
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

function CustomUserMenuAvatar({ name, email, imageUrl, className }: CustomUserMenuAvatarProps) {
  const { logOut, isLoading } = useLogoutApi();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'hover:bg-muted focus-visible:ring-ring inline-flex cursor-pointer items-center gap-2 rounded-md p-1 text-start transition-colors outline-none focus-visible:ring-2',
          className,
        )}
      >
        <Avatar size='lg'>
          <AvatarImage
            alt={name}
            src={imageUrl}
          />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <span className='hidden min-w-0 md:block'>
          <span className='block truncate text-sm font-medium'>{name}</span>
          <span className='text-muted-foreground block truncate text-xs'>{email}</span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-64'
      >
        <DropdownMenuLabel className='flex items-center gap-3 px-2 py-2'>
          <Avatar>
            <AvatarImage
              alt={name}
              src={imageUrl}
            />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span className='min-w-0'>
            <span className='text-foreground block truncate text-sm font-medium'>{name}</span>
            <span className='block truncate text-xs font-normal'>{email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShieldCheck />
            Security
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={() => void logOut()}
          disabled={isLoading}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CustomUserMenuAvatar;
