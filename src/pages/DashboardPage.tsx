import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import type { DashboardTab } from '../components/layout/SideRail';
import caseStudies from '../mocks/caseStudies';

// Lazy-load dashboard workspaces
const MapWorkspace = lazy(() => import('../components/dashboard/MapWorkspace'));
const CalendarWorkspace = lazy(() => import('../components/dashboard/CalendarWorkspace'));
const FRPStudio = lazy(() => import('../components/dashboard/FRPStudio'));
const SensitivityLab = lazy(() => import('../components/dashboard/SensitivityLab'));

function LoadingPane() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4"
      style={{ minHeight: '400px', color: '#64748B' }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(245,158,11,0.3)', borderTopColor: '#F59E0B' }}
      />
      <span className="text-sm font-medium">Loading workspace…</span>
    </div>
  );
}

function ErrorPane({ tab }: { tab: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-3 text-center p-8"
      style={{ minHeight: '400px', color: '#64748B' }}
    >
      <span className="text-4xl">🔧</span>
      <p className="text-sm" style={{ color: '#94A3B8' }}>
        <strong style={{ color: '#F8FAFC' }}>{tab}</strong> workspace is loading…
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
              <div style={{ height: 'calc(100vh - 56px)', position: 'relative' }}>
                <MapWorkspace />
              </div>
            </Suspense>
          </WorkspaceErrorBoundary>
        );
      case 'calendar':
        return (
          <WorkspaceErrorBoundary tab="Calendar Workspace">
            <Suspense fallback={<LoadingPane />}>
              <div className="p-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
                <CalendarWorkspace />
              </div>
            </Suspense>
          </WorkspaceErrorBoundary>
        );
      case 'frp':
        return (
          <WorkspaceErrorBoundary tab="FRP Studio">
            <Suspense fallback={<LoadingPane />}>
              <div className="p-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
                <FRPStudio />
              </div>
            </Suspense>
          </WorkspaceErrorBoundary>
        );
      case 'sensitivity':
        return (
          <WorkspaceErrorBoundary tab="Sensitivity Lab">
            <Suspense fallback={<LoadingPane />}>
              <div className="p-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
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
      {activeCaseObj && activeTab !== 'map' && (
        <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
              {activeCaseObj.badge} Active
            </span>
            <span>{activeCaseObj.title}</span>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-amber-400 hover:text-amber-200 underline font-medium cursor-pointer"
          >
            Switch to Footprint Map →
          </button>
        </div>
      )}
      {renderWorkspace()}
    </AppLayout>
  );
}
