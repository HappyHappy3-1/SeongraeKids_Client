import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ScaledPage from './ScaledPage';
import HeaderBar from './HeaderBar';
import { SIDEBAR_ITEMS, ACTIVE_ICON_FILTER, FONTS } from '../constants';

function SidebarItem({ icon, label, y, path, isActive, onNav }: {
  icon: string; label: string; y: number; path: string; isActive: boolean; onNav: (p: string) => void;
}) {
  return (
    <button onClick={() => onNav(path)}
      className="absolute flex flex-col items-center cursor-pointer border-none bg-transparent"
      style={{ left: 58, top: y, width: 70 }}>
      <img src={icon} alt={label}
        style={{ width: 35, height: 35, filter: isActive ? ACTIVE_ICON_FILTER : 'none' }} />
      <span style={{ fontSize: 10, fontFamily: FONTS.inter, color: isActive ? '#FDCB35' : '#000', marginTop: 3 }}>
        {label}
      </span>
    </button>
  );
}

const SIDEBAR_Y_OFFSETS: Record<string, number[]> = {
  '/home': [371, 462, 557, 652, 732],
  '/classroom': [365, 456, 552, 646, 726],
};

export default function DashboardLayout({ activePath, sidebarTop, children }: {
  activePath: string; sidebarTop: number; children: ReactNode;
}) {
  const navigate = useNavigate();
  const yOffsets = SIDEBAR_Y_OFFSETS[activePath] ?? SIDEBAR_Y_OFFSETS['/home']!;

  return (
    <ScaledPage>
      <div className="relative w-full h-full bg-white">
        <HeaderBar />
        <div className="absolute bg-white rounded-[4px]"
          style={{ left: 58, top: sidebarTop, width: 70, height: 503, boxShadow: '0px 4px 7.5px rgba(0,0,0,0.07)' }} />
        {SIDEBAR_ITEMS.map((item, i) => (
          <SidebarItem key={item.path} {...item}
            y={yOffsets[i]} isActive={activePath === item.path} onNav={navigate} />
        ))}
        {children}
      </div>
    </ScaledPage>
  );
}
