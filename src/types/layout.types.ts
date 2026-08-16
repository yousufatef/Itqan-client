import type { ReactNode } from 'react';

// ─── Primitive types ──────────────────────────────────────────────────────────
export type MainModeProps = {
  mode?: 'default';
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  primaryLabel?: ReactNode;
  secondaryLabel?: ReactNode;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
  isPrimaryLoading?: boolean;
  isSecondaryLoading?: boolean;
};

export type FormModeProps = {
  mode: 'form';
  title: string;
  subtitle?: string;
  onBack?: () => void;
  primaryLabel?: ReactNode;
  secondaryLabel?: ReactNode;
  onSecondaryClick?: () => void;
  showSecondaryButton?: boolean;
  primaryButtonProps?: React.ComponentProps<'button'>;
  secondaryButtonProps?: React.ComponentProps<'button'>;
  isPrimaryLoading?: boolean;
  isSecondaryLoading?: boolean;
};
