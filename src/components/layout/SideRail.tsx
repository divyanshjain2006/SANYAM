import clsx from 'clsx';
import { Map, Calendar, BarChart2, Sliders } from 'lucide-react';

export type DashboardTab = 'map' | 'calendar' | 'frp' | 'sensitivity';

interface TabItem {
  id: DashboardTab;
  icon: React.ReactNode;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'map', icon: <Map className="w-5 h-5" />, label: 'Hotspot Map' },
  { id: 'calendar', icon: <Calendar className="w-5 h-5" />, label: 'Activity Calendar' },
  { id: 'frp', icon: <BarChart2 className="w-5 h-5" />, label: 'FRP Studio' },
  { id: 'sensitivity', icon: <Sliders className="w-5 h-5" />, label: 'Sensitivity Lab' },
];

interface SideRailProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function SideRail({ activeTab, onTabChange }: SideRailProps) {
  return (
    <aside
      className="fixed top-[64px] left-0 bottom-0 z-40 flex flex-col pt-4 pb-4 gap-1 overflow-y-auto"
      style={{
        width: '220px',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
      }}
    >
      {/* Section Label */}
      <div className="px-4 pb-2">
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: '#94A3B8' }}
        >
          Workspaces
        </span>
      </div>

      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer text-left w-auto',
              isActive
                ? 'text-[#2563EB]'
                : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
            )}
            style={
              isActive
                ? { background: '#EFF6FF' }
                : {}
            }
          >
            <span
              className="flex-shrink-0 transition-colors"
              style={{ color: isActive ? '#2563EB' : '#94A3B8' }}
            >
              {tab.icon}
            </span>
            <span className="truncate">{tab.label}</span>
            {isActive && (
              <span
                className="ml-auto w-1.5 h-5 rounded-full flex-shrink-0"
                style={{ background: '#2563EB' }}
              />
            )}
          </button>
        );
      })}

      {/* Sensor Legend */}
      <div
        className="mt-auto mx-3 p-3 rounded-xl"
        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
      >
        <p
          className="text-[10px] uppercase tracking-widest font-semibold mb-2.5"
          style={{ color: '#94A3B8' }}
        >
          Sensor Legend
        </p>
        <div className="flex flex-col gap-2">
          {[
            { color: '#F59E0B', label: 'MODIS (1 km)' },
            { color: '#06B6D4', label: 'VIIRS (375 m)' },
            { color: '#7C3AED', label: 'Candidate Match' },
            { color: '#10B981', label: 'Valid Clear-Sky' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-[11px]" style={{ color: '#475569' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SideRail;
