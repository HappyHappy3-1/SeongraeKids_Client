import type { ReactNode } from 'react';
import { useScaledViewport } from '../hooks/useScaledViewport';
import { DESIGN } from '../constants';

export default function ScaledPage({ children, bg = '#FFFFFF' }: { children: ReactNode; bg?: string }) {
  const { scale, offsetX } = useScaledViewport();

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: bg }}>
      <div style={{
        width: DESIGN.width,
        height: DESIGN.height,
        transform: `translateX(${offsetX}px) scale(${scale})`,
        transformOrigin: 'top left',
      }}>
        {children}
      </div>
    </div>
  );
}
