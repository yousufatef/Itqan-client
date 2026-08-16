import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type Direction = 'ltr' | 'rtl';

export function getLanguageDirection(_language: string): Direction {
  return 'ltr';
}

export function useDirection() {
  const { i18n } = useTranslation();
  const direction = getLanguageDirection(i18n.language);

  useEffect(() => {
    const language = i18n.language;
    const nextDirection = getLanguageDirection(language);

    document.documentElement.lang = language;
    document.documentElement.dir = nextDirection;
  }, [i18n.language]);

  return direction;
}
