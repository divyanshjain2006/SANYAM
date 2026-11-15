import { useState } from 'react';
import { Database, ShieldCheck, ChevronUp, ChevronDown, Radio } from 'lucide-react';
import { USE_MOCK_DATA } from '../../services/skhApi';

export function VersionBadge() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-50 select-none">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md cursor-pointer transition-all duration-200 shadow-lg"
        style={{
          background: 'rgba(25, 34, 52, 0.92)',
          borderColor: 'rgba(148, 163, 184, 0.2)',
          color: '#CBD5E1',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-medium text-slate-300">SANYAM v1.0.0</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
          {USE_MOCK_DATA ? 'Mock Engine' : 'PostGIS Live'}
        </span>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div
          className="absolute bottom-10 right-0 w-72 rounded-xl p-3.5 text-xs border backdrop-blur-lg flex flex-col gap-2.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150"
          style={{
            background: '#192234',
            borderColor: 'rgba(148, 163, 184, 0.2)',
            color: '#CBD5E1',
          }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
            <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" /> Backend Readiness
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> QA 100%
            </span>
          </div>

          <div className="flex flex-col gap-1 text-[11px] leading-relaxed text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Architecture:</span>
              <span className="font-mono text-slate-200">ISKHRepository</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">FastAPI Connector:</span>
              <span className="font-mono text-emerald-400">Ready (USE_MOCK_DATA=true)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sensors Supported:</span>
              <span className="font-mono text-cyan-300">MODIS + 3× VIIRS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Collections:</span>
              <span className="font-mono text-slate-200">MODIS 6.1 / VIIRS 2</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] text-slate-400">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Harmonization Pipeline Active</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default VersionBadge;
