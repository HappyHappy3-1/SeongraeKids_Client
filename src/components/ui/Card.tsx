import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { colors, radii, shadows } from '../../design/tokens';

type Variant = 'surface' | 'panel' | 'dark';

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  radius?: keyof typeof radii;
  elevated?: boolean;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, CSSProperties> = {
  surface: { background: colors.surface.white, color: colors.text.primary },
  panel: { background: colors.surface.muted, color: colors.text.primary },
  dark: { background: colors.surface.dark, color: colors.text.inverse },
};

export default function Card({
  variant = 'surface',
  radius = 'lg',
  elevated = false,
  children,
  style,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      style={{
        borderRadius: radii[radius],
        boxShadow: elevated ? shadows.card : undefined,
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
