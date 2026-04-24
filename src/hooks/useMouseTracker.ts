import { useEffect, useState, useRef, useCallback } from 'react';

interface TrackerResult {
  ref: React.RefObject<SVGSVGElement | null>;
  faceOffset: { x: number; y: number; rotate: number };
  eyeOffset: { x: number; y: number };
  leftPupil: { x: number; y: number };
  rightPupil: { x: number; y: number };
  blinking: boolean;
}

const LEFT_EYE = { x: 117.605, y: 52.5 };
const RIGHT_EYE = { x: 400.605, y: 52.5 };
const VIEW_CENTER = { x: 310, y: 250 };

export function useMouseTracker(): TrackerResult {
  const ref = useRef<SVGSVGElement>(null);
  const [faceOffset, setFaceOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [leftPupil, setLeftPupil] = useState({ x: 121.5, y: 49.5 });
  const [rightPupil, setRightPupil] = useState({ x: 404.5, y: 49.5 });
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const doBlink = () => {
      setBlinking(true);
      setTimeout(() => {
        setBlinking(false);
        if (Math.random() < 0.4) {
          setTimeout(() => {
            setBlinking(true);
            setTimeout(() => setBlinking(false), 120);
          }, 200);
        }
      }, 130);
    };
    const id = setInterval(() => { if (Math.random() < 0.5) doBlink(); }, 1800);
    return () => clearInterval(id);
  }, []);

  const calcPupil = useCallback((eye: { x: number; y: number }, mx: number, my: number) => {
    const dx = mx - (eye.x + 55);
    const dy = my - (eye.y + 110);
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d === 0) return eye;
    const offset = Math.min(d * 0.06, 20);
    return { x: eye.x + (dx / d) * offset, y: eye.y + (dy / d) * offset };
  }, []);

  const rafRef = useRef<number | null>(null);
  const lastEventRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    lastEventRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const ev = lastEventRef.current;
      if (!ev || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const mx = (ev.x - rect.left) * (620 / rect.width);
      const my = (ev.y - rect.top) * (500 / rect.height);
      const dx = mx - VIEW_CENTER.x;
      const dy = my - VIEW_CENTER.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0) {
        const fs = Math.min(d * 0.02, 8);
        setFaceOffset({ x: (dx / d) * fs, y: (dy / d) * fs * 0.5, rotate: (dx / d) * Math.min(d * 0.008, 3) });
        const es = Math.min(d * 0.025, 10);
        setEyeOffset({ x: (dx / d) * es, y: (dy / d) * es * 0.6 });
      }
      setLeftPupil(calcPupil(LEFT_EYE, mx, my));
      setRightPupil(calcPupil(RIGHT_EYE, mx, my));
    });
  }, [calcPupil]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return { ref, faceOffset, eyeOffset, leftPupil, rightPupil, blinking };
}
