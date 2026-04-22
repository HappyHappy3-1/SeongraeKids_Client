import type { ReactNode } from 'react';
import { useScaledViewport } from '../hooks/useScaledViewport';
import { DESIGN } from '../constants';

export default function ScaledPage({ children, bg = '#FFFFFF', fillWidth = false }: { 
  children: ReactNode; bg?: string; fillWidth?: boolean 
}) {
  const { scale, offsetX } = useScaledViewport();
  
  const sx = window.innerWidth / DESIGN.width;  // fillWidth용

  return (
    <div className="w-screen h-screen overflow-x-hidden" style={{ background: bg }}>
      <div style={{
        width: DESIGN.width,
        height: DESIGN.height,
        transform: fillWidth
          ? `scale(${sx})`
          : `translateX(${offsetX}px) scale(${scale})`,
        transformOrigin: 'top left',
      }}>
        {children}
      </div>
    </div>
  );
}
