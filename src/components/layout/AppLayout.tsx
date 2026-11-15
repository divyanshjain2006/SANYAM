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
      style={{ background: '#F1F5F9' }}
    >
      {/* Top bar — fixed, 64px */}
      <TopBar />

      {/* Side rail — fixed, starts at 64px, 220px wide */}
      <SideRail activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main content — offset for top bar + side rail */}
      <main
        className="min-h-screen overflow-y-auto"
        style={{
          paddingTop: '64px',
          paddingLeft: '220px',
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
