import { motion } from 'framer-motion';
import { useMouseTracker } from '../hooks/useMouseTracker';
import { PSYDUCK_PATHS } from './svg-paths';

interface Props {
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  showHair?: boolean;
}

const spring = { type: 'spring', stiffness: 200, damping: 15 } as const;

export default function PsyduckFace({ width, height, style, className, showHair = true }: Props) {
  const { ref, faceOffset, eyeOffset, leftPupil, rightPupil, blinking } = useMouseTracker();
  const eyeScaleY = blinking ? 0.08 : 1;
  const LEFT_EYE = { x: 117.605, y: 52.5 };
  const RIGHT_EYE = { x: 400.605, y: 52.5 };

  return (
    <svg ref={ref} className={className} style={{ ...style, filter: 'drop-shadow(0px 8px 20px rgba(0,0,0,0.15))' }}
      width={width} height={height} viewBox="-55 -110 620 500" fill="none">
      <motion.g
        animate={{ x: faceOffset.x, y: faceOffset.y, rotate: faceOffset.rotate }}
        transition={spring}
        style={{ transformOrigin: '256px 200px' }}
      >
        {showHair && (
          <g transform="translate(185, -77) scale(0.65)">
            <path d={PSYDUCK_PATHS.hair} fill="black" stroke="black" />
          </g>
        )}
        <path d={PSYDUCK_PATHS.beak} fill="#F3E0C2" />
        <path fillRule="evenodd" clipRule="evenodd" d={PSYDUCK_PATHS.beakOutline} fill="black" fillOpacity="0.15" />

        <motion.g animate={{ x: eyeOffset.x, y: eyeOffset.y }} transition={spring}>
          {[{ eye: LEFT_EYE, pupil: leftPupil }, { eye: RIGHT_EYE, pupil: rightPupil }].map(({ eye, pupil }, i) => (
            <g key={i}>
              <motion.ellipse cx={eye.x} cy={eye.y} rx="67" ry="52.5" fill="white"
                animate={{ scaleY: eyeScaleY }} transition={{ duration: 0.1 }}
                style={{ transformOrigin: `${eye.x}px ${eye.y}px` }} />
              {!blinking && (
                <motion.circle r="11.5" fill="black"
                  cx={pupil?.x ?? eye.x}
                  cy={pupil?.y ?? eye.y}
                  animate={{ cx: pupil?.x ?? eye.x, cy: pupil?.y ?? eye.y }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
              )}
            </g>
          ))}
        </motion.g>
      </motion.g>
    </svg>
  );
}
