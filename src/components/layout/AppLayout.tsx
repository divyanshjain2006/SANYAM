import React from 'react';
import { TopBar } from './TopBar';
import { SideRail, DashboardTab } from './SideRail';
import { VersionBadge } from './VersionBadge';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#111827' }}
    >
      {/* Top bar — fixed, 56px */}
      <TopBar />

      {/* Side rail — fixed, starts at 56px */}
      <SideRail activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main content — offset for top bar + side rail */}
      <main
        className="min-h-screen overflow-y-auto"
        style={{
          paddingTop: '56px',
          paddingLeft: '60px',
        }}
      >
        {children}
      </main>

      {/* Persistent floating version & backend readiness badge */}
      <VersionBadge />
    </div>
  );
}

export default AppLayout;
