import { useNavigate } from 'react-router-dom';
import {
  STUDENT_SIDEBAR_ITEMS,
  TEACHER_SIDEBAR_ITEMS,
} from '../constants';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radii, shadows, filters, motion } from '../design/tokens';

interface SidebarItemProps {
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
  onNav: (path: string) => void;
}

function SidebarItem({ icon, label, path, isActive, onNav }: SidebarItemProps) {
  return (
    <button
      onClick={() => onNav(path)}
      className="group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '8px 0',
        background: 'transparent',
        border: 'none',
        borderRadius: radii.md,
        cursor: 'pointer',
        transition: `background ${motion.duration.fast} ${motion.easing.standard}`,
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = colors.sidebar.hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      <img
        src={icon}
        alt={label}
        style={{
          width: 32,
          height: 32,
          filter: isActive ? filters.activeYellow : filters.inactiveIcon,
          transition: `filter ${motion.duration.fast} ${motion.easing.standard}`,
        }}
      />
      <span
        style={{
          marginTop: 4,
          fontSize: fonts.size.xs,
          fontFamily: fonts.family.inter,
          fontWeight: isActive ? fonts.weight.semibold : fonts.weight.regular,
          color: isActive ? colors.primary : colors.sidebar.inactiveLabel,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.2px',
          transition: `color ${motion.duration.fast} ${motion.easing.standard}`,
        }}
      >
        {label}
      </span>
    </button>
  );
}

interface SidebarProps {
  activePath: string;
  top: number;
  left?: number;
  width?: number;
  height?: number;
}

export default function Sidebar({
  activePath,
  top,
  left = 58,
  width = 70,
  height = 503,
}: SidebarProps) {
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const items = isTeacher ? TEACHER_SIDEBAR_ITEMS : STUDENT_SIDEBAR_ITEMS;
  const activeItemPath = (() => {
    let best: string | null = null;
    for (const it of items) {
      const match =
        activePath === it.path || activePath.startsWith(it.path + '/');
      if (match && (!best || it.path.length > best.length)) best = it.path;
    }
    return best;
  })();
  return (
    <nav
      aria-label="Primary"
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        background: colors.white,
        borderRadius: radii.md,
        boxShadow: shadows.card,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        padding: '12px 0',
      }}
    >
      {items.map((item) => (
        <SidebarItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          isActive={activeItemPath === item.path}
          onNav={navigate}
        />
      ))}
    </nav>
  );
}
