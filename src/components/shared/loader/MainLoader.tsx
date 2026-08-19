import Logo from '@/assets/svgs/itqan-logo-white-bg.svg';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type MainLoaderProps = {
  className?: string;
  showLogo?: boolean;
};

const MainLoader = ({ className, showLogo = true }: MainLoaderProps) => {
  return (
    <div
      className={cn(
        'flex min-h-75 items-center justify-center bg-background',
        className,
      )}
    >
      <div className='flex flex-col items-center gap-4'>
        {showLogo ? (
          <img
            src={Logo}
            alt='Itqan'
            className='h-10 w-[232px] animate-in fade-in object-contain duration-500'
          />
        ) : null}

        <Spinner className='size-10' />

        <p className='type-body-md text-neutral-400'>جاري التحميل</p>
      </div>
    </div>
  );
};

export default MainLoader;
