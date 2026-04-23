import type { ReactNode } from 'react';
import ScaledPage from './ScaledPage';
import HeaderBar from './HeaderBar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ activePath, sidebarTop, children, fillWidth }: {
  activePath: string; sidebarTop: number; children: ReactNode; fillWidth?: boolean;
}) {
  return (
    <ScaledPage fillWidth={fillWidth}>
      <div className="relative w-full h-full bg-white">
        <HeaderBar />
        <Sidebar activePath={activePath} top={sidebarTop} />
        {children}
      </div>
    </ScaledPage>
  );
}