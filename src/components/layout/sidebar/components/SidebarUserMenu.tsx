import UserProfile from '@/components/shared/customs/UserProfile';

type SidebarUserMenuProps = {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  onLogoutClick?: () => void;
};

function SidebarUserMenu({ name = '', email = '', avatarUrl }: SidebarUserMenuProps) {
  return (
    <UserProfile
      name={name}
      subtitle={email}
      avatarUrl={avatarUrl}
      className='min-w-0 flex-1'
    />
  );
}

export default SidebarUserMenu;
