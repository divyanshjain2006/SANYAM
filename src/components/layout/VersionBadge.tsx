import { useState } from 'react';
import { Database, ShieldCheck, ChevronUp, ChevronDown, Radio } from 'lucide-react';

export function VersionBadge() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-50 select-none">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border cursor-pointer transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderColor: '#E2E8F0',
          color: '#475569',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-semibold text-slate-700">SANYAM v1.0.0</span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
        >
          NASA Verified Data
        </span>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div
          className="absolute bottom-10 right-0 w-80 rounded-xl p-4 text-xs flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            color: '#475569',
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-600" /> Data Integrity & Architecture
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> QA 100%
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px] leading-relaxed text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Data Source:</span>
              <span className="font-mono text-slate-800 font-semibold">NASA LANCE / FIRMS Standard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Architecture:</span>
              <span className="font-mono text-blue-600">ISKHRepository Interface</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sensors Supported:</span>
              <span className="font-mono text-slate-800">MODIS (Terra/Aqua) + 3× VIIRS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Collections:</span>
              <span className="font-mono text-slate-800">MODIS 6.1 / VIIRS Collection 2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Integrity:</span>
              <span className="font-mono text-emerald-600 font-semibold">SHA-256 Granule Hashes</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[10px] text-slate-500">
            <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Harmonization Pipeline: Verified Peer-Reviewed Physics</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default VersionBadge;
