import type { InputHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { colors, fonts, radii } from '../../design/tokens';

type InputSize = 'sm' | 'md' | 'lg';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  leadingIcon?: ReactNode;
  fullWidth?: boolean;
}

const SIZE_STYLES: Record<InputSize, CSSProperties> = {
  sm: { height: 40, fontSize: fonts.size.base },
  md: { height: 64, fontSize: fonts.size.lg },
  lg: { height: 73, fontSize: fonts.size.lg },
};

export default function Input({
  inputSize = 'md',
  leadingIcon,
  fullWidth,
  style,
  ...rest
}: Props) {
  return (
    <div
      style={{
        background: colors.white,
        border: `3px solid ${colors.border.strong}`,
        borderRadius: radii.md,
        display: 'flex',
        alignItems: 'center',
        padding: '0 23px',
        width: fullWidth ? '100%' : undefined,
        ...SIZE_STYLES[inputSize],
        ...style,
      }}
    >
      {leadingIcon && (
        <div style={{ marginRight: 16, display: 'flex', flexShrink: 0 }}>{leadingIcon}</div>
      )}
      <input
        {...rest}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          textAlign: 'center',
          fontSize: SIZE_STYLES[inputSize].fontSize,
          fontFamily: fonts.family.laundry,
          color: colors.text.placeholder,
        }}
      />
    </div>
  );
}
