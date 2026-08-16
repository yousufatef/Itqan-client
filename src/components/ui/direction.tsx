import { createContext, useContext, type ReactNode } from 'react';
import type { Direction } from '@/i18n/useDirection';

const DirectionContext = createContext<Direction>('ltr');

type DirectionProviderProps = {
  direction: Direction;
  children: ReactNode;
};

export function DirectionProvider({ direction, children }: DirectionProviderProps) {
  return <DirectionContext.Provider value={direction}>{children}</DirectionContext.Provider>;
}

export function useDirection() {
  return useContext(DirectionContext);
}
