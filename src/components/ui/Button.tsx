import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { colors, fonts, radii } from '../../design/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, CSSProperties> = {
  primary: {
    background: colors.primary,
    color: colors.text.primary,
    border: `3px solid ${colors.border.strong}`,
  },
  secondary: {
    background: colors.white,
    color: colors.text.placeholder,
    border: `3px solid ${colors.border.strong}`,
  },
  ghost: {
    background: 'transparent',
    color: colors.text.secondary,
    border: 'none',
  },
};

const SIZE_STYLES: Record<Size, CSSProperties> = {
  sm: { height: 40, fontSize: fonts.size.base, padding: '0 16px' },
  md: { height: 64, fontSize: fonts.size.lg, padding: '0 24px' },
  lg: { height: 73, fontSize: fonts.size.lg, padding: '0 28px' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  children,
  disabled,
  style,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled}
      style={{
        fontFamily: fonts.family.laundry,
        fontWeight: fonts.weight.semibold,
        borderRadius: radii.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : undefined,
        transition: 'background 0.15s, transform 0.15s, opacity 0.15s, box-shadow 0.15s',
        outline: 'none',
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px ${colors.primarySoft}`;
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
