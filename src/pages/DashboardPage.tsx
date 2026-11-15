import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import type { DashboardTab } from '../components/layout/SideRail';
import caseStudies from '../mocks/caseStudies';
import hotspots from '../mocks/hotspots';
import candidateMatches from '../mocks/candidateMatches';
import {
  Flame,
  Layers,
  Link as LinkIcon,
  Satellite,
  TrendingUp,
  X,
} from 'lucide-react';

// Lazy-load dashboard workspaces
const MapWorkspace = lazy(() => import('../components/dashboard/MapWorkspace'));
const CalendarWorkspace = lazy(() => import('../components/dashboard/CalendarWorkspace'));
const FRPStudio = lazy(() => import('../components/dashboard/FRPStudio'));
const SensitivityLab = lazy(() => import('../components/dashboard/SensitivityLab'));

function LoadingPane() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4"
      style={{ minHeight: '400px', color: '#94A3B8' }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(37,99,235,0.2)', borderTopColor: '#2563EB' }}
      />
      <span className="text-sm font-medium text-slate-500">Loading workspace…</span>
    </div>
  );
}

function ErrorPane({ tab }: { tab: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-3 text-center p-8"
      style={{ minHeight: '400px' }}
    >
      <span className="text-4xl">🔧</span>
      <p className="text-sm text-slate-500">
        <strong className="text-slate-700">{tab}</strong> workspace is loading…
      </p>
      <p className="text-xs max-w-xs text-slate-400">
        Please check your network or try refreshing the dashboard workspace.
      </p>
    </div>
  );
}

class WorkspaceErrorBoundary extends React.Component<
  { children: React.ReactNode; tab: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; tab: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <ErrorPane tab={this.props.tab} />;
    }
    return this.props.children;
  }
}

// KPI summary cards
function KpiCards() {
  const totalHotspots = hotspots.length;
  const modisCount = hotspots.filter((h) => h.sensor.includes('MODIS')).length;
  const viirsCount = hotspots.filter((h) => h.sensor.includes('VIIRS')).length;
  const matchCount = candidateMatches.length;

  const cards = [
    {
      label: 'Total Hotspots',
      value: totalHotspots,
      icon: <Flame className="w-5 h-5" />,
      color: '#F59E0B',
      bg: '#FFFBEB',
      border: '#FDE68A',
    },
    {
      label: 'MODIS Detections',
      value: modisCount,
      icon: <Satellite className="w-5 h-5" />,
      color: '#D97706',
      bg: '#FEF3C7',
      border: '#FCD34D',
    },
    {
      label: 'VIIRS Detections',
      value: viirsCount,
      icon: <Layers className="w-5 h-5" />,
      color: '#0891B2',
      bg: '#ECFEFF',
      border: '#A5F3FC',
    },
    {
      label: 'Candidate Matches',
      value: matchCount,
      icon: <LinkIcon className="w-5 h-5" />,
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
    },
    {
      label: 'Case Studies',
      value: caseStudies.length,
      icon: <TrendingUp className="w-5 h-5" />,
      color: '#059669',
      bg: '#F0FDF4',
      border: '#A7F3D0',
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl p-4 flex items-center gap-3 transition-shadow hover:shadow-md"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
            style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
          >
            {c.icon}
          </div>
          <div className="min-w-0">
            <div
              className="text-2xl font-bold leading-none mb-0.5"
              style={{ color: '#1E293B' }}
            >
              {c.value}
            </div>
            <div className="text-xs leading-tight" style={{ color: '#64748B' }}>
              {c.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('map');
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case');

  useEffect(() => {
    if (caseId) {
      setActiveTab('map');
    }
  }, [caseId]);

  const activeCaseObj = caseStudies.find((c) => c.id === caseId);

  const renderWorkspace = () => {
    switch (activeTab) {
      case 'map':
        return (
          <WorkspaceErrorBoundary tab="Map Workspace">
            <Suspense fallback={<LoadingPane />}>
              <div style={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
                <MapWorkspace />
              </div>
            </Suspense>
          </WorkspaceErrorBoundary>
        );
      case 'calendar':
        return (
          <WorkspaceErrorBoundary tab="Calendar Workspace">
            <Suspense fallback={<LoadingPane />}>
              <div className="p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <CalendarWorkspace />
              </div>
            </Suspense>
          </WorkspaceErrorBoundary>
        );
      case 'frp':
        return (
          <WorkspaceErrorBoundary tab="FRP Studio">
            <Suspense fallback={<LoadingPane />}>
              <div className="p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <KpiCards />
                <FRPStudio />
              </div>
            </Suspense>
          </WorkspaceErrorBoundary>
        );
      case 'sensitivity':
        return (
          <WorkspaceErrorBoundary tab="Sensitivity Lab">
            <Suspense fallback={<LoadingPane />}>
              <div className="p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <KpiCards />
                <SensitivityLab />
              </div>
            </Suspense>
          </WorkspaceErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Case Study Banner */}
      {activeCaseObj && activeTab !== 'map' && (
        <div
          className="px-6 py-2.5 flex items-center justify-between text-sm"
          style={{
            background: '#EFF6FF',
            borderBottom: '1px solid #BFDBFE',
            color: '#1D4ED8',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded text-xs"
              style={{ background: '#DBEAFE', color: '#1D4ED8' }}
            >
              {activeCaseObj.badge} Active
            </span>
            <span>{activeCaseObj.title}</span>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
          >
            Switch to Footprint Map →
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {renderWorkspace()}
    </AppLayout>
  );
}
