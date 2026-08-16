import type { ReactNode } from 'react';

export type ModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  toggle?: (open: boolean) => void;
  trigger?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  forceModal?: boolean;
  headerClassName?: string;
  footerClassName?: string;
};
