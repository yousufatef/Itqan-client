import SidebarIcon from '../icons/SidebarIcon';

type LogoutNavItemProps = {
  title: string;
  onLogoutClick: () => void;
};

function LogoutNavItem({ title, onLogoutClick }: LogoutNavItemProps) {
  return (
    <button
      type='button'
      onClick={onLogoutClick}
      className='type-link-md flex h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-error-700 transition-colors hover:bg-error-50'
    >
      <span className='flex size-5 items-center justify-center'>
        <SidebarIcon name='logout' className='size-5' />
      </span>
      <span className='min-w-0 flex-1 truncate text-start'>{title}</span>
    </button>
  );
}

export default LogoutNavItem;
