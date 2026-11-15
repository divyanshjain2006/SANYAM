import clsx from 'clsx';

export type DashboardTab = 'map' | 'calendar' | 'frp' | 'sensitivity';

interface TabItem {
  id: DashboardTab;
  icon: string;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'map', icon: '🗺️', label: 'Map' },
  { id: 'calendar', icon: '📅', label: 'Calendar' },
  { id: 'frp', icon: '📊', label: 'FRP Studio' },
  { id: 'sensitivity', icon: '🔧', label: 'Sensitivity' },
];

interface SideRailProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function SideRail({ activeTab, onTabChange }: SideRailProps) {
  return (
    <aside
      className="fixed top-[56px] left-0 bottom-0 z-40 flex flex-col items-center pt-4 pb-4 gap-1"
      style={{
        width: '60px',
        background: '#192234',
        borderRight: '1px solid rgba(148,163,184,0.14)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
            className={clsx(
              'flex flex-col items-center justify-center w-12 h-12 rounded-xl gap-0.5 transition-all duration-150 cursor-pointer',
              isActive
                ? 'text-[#F59E0B]'
                : 'text-[#64748B] hover:text-[#CBD5E1] hover:bg-[rgba(148,163,184,0.08)]'
            )}
            style={
              isActive
                ? { background: 'rgba(245,158,11,0.12)' }
                : {}
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span
              className="text-[9px] font-medium leading-none tracking-wide uppercase"
              style={{ fontSize: '8px' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

export default SideRail;
