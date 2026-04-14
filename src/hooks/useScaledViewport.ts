import { useEffect, useState } from 'react';
import { DESIGN } from '../constants';

export function useScaledViewport() {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const update = () => {
      const sx = window.innerWidth / DESIGN.width;
      const sy = window.innerHeight / DESIGN.height;
      const s = Math.min(sx, sy);
      setScale(s);
      setOffsetX(Math.max(0, (window.innerWidth - DESIGN.width * s) / 2));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return { scale, offsetX };
}
