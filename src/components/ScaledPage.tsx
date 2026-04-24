import { useEffect, useState, type ReactNode } from 'react';
import { useScaledViewport } from '../hooks/useScaledViewport';
import { useIsMobile } from '../hooks/useIsMobile';
import { DESIGN } from '../constants';

export default function ScaledPage({ children, bg = '#FFFFFF', fillWidth = false }: {
  children: ReactNode; bg?: string; fillWidth?: boolean
}) {
  const { scale, offsetX } = useScaledViewport();
  const isMobile = useIsMobile();

  const [sx, setSx] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth / DESIGN.width : 1,
  );
  useEffect(() => {
    const update = () => setSx(window.innerWidth / DESIGN.width);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const useFillW = fillWidth || isMobile;
  const appliedScale = useFillW ? sx : scale;

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: useFillW ? 'auto' : 'hidden',
        background: bg,
        height: useFillW ? undefined : '100vh',
      }}
    >
      <div
        style={{
          width: DESIGN.width * appliedScale,
          height: DESIGN.height * appliedScale,
          marginLeft: useFillW ? 0 : offsetX,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: DESIGN.width,
            height: DESIGN.height,
            transform: `scale(${appliedScale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
