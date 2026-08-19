import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '@/assets/svgs/itqan-logo-white-bg.svg';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type MobileHeaderProps = {
  className?: string;
};

function MobileHeader({ className }: MobileHeaderProps) {
  const { t } = useTranslation();
  const { isMobile, toggleSidebar, openMobile } = useSidebar();

  // Desktop: persistent sidebar only — hide navbar entirely
  if (!isMobile) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-22 shrink-0 items-center justify-between rounded-b-2xl bg-white px-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]',
        className,
      )}
    >
      <Link
        to='/'
        className='inline-flex shrink-0 items-center'
        aria-label='ITQAN'
      >
        <img
          src={Logo}
          alt='ITQAN'
          className='h-12 w-55 bg-transparent object-contain'
        />
      </Link>

      <button
        type='button'
        onClick={toggleSidebar}
        className='inline-flex size-6 shrink-0 items-center justify-center text-primary-500'
        aria-label={t('sidebar.toggleMenu')}
        aria-expanded={openMobile}
      >
        <Menu
          className='size-6'
          strokeWidth={2}
          aria-hidden='true'
        />
      </button>
    </header>
  );
}

export default MobileHeader;
