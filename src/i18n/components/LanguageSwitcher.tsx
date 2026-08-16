import { useTranslation } from 'react-i18next';
import { getLanguageDirection } from '../useDirection';
import { Globe2 } from 'lucide-react';

type Language = 'en' | 'it';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language.startsWith('it') ? 'it' : 'en';
  const nextLanguage: Language = currentLanguage === 'it' ? 'en' : 'it';

  const changeLanguage = async () => {
    await i18n.changeLanguage(nextLanguage);

    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = getLanguageDirection(nextLanguage);
  };

  return (
    <button
      type='button'
      aria-label={`Switch language to ${nextLanguage.toUpperCase()}`}
      onClick={() => {
        void changeLanguage();
      }}
      className='border-primary-500 text-primary-500 hover:bg-primary-100 absolute top-18.5 right-18.5 z-20 flex h-12 min-w-20.25 rotate-0 cursor-pointer items-center justify-center gap-2 rounded-[4px] border bg-transparent px-4 py-2 leading-5.25 transition-colors max-md:top-4 max-md:right-4'
    >
      <Globe2 className='size-4 shrink-0' aria-hidden='true' />
      <span className='align-middle'>{currentLanguage === 'en' ? 'EN' : 'IT'}</span>
    </button>
  );
}
