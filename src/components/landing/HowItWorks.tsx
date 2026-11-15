import React from 'react';
import { Database, GitMerge, FileCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '1',
      icon: <Database className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      title: 'Source-Preserving Ingestion & QC',
      subtitle: 'Native Granules + Rigorous Flags',
      description:
        'Raw MODIS (MOD14/MYD14 Col 6.1) and VIIRS (VNP14IMG/VJ114IMG Col 2) granules are ingested preserving pixel coordinates, scan angles, brightness temperatures, and QA flags without lossy aggregation.',
    },
    {
      step: '2',
      icon: <GitMerge className="w-6 h-6 text-violet-600" />,
      bg: 'bg-violet-50 border-violet-200',
      title: 'Observation Opportunity & Footprint Matching',
      subtitle: 'IoU & Smaller-Footprint Overlap (Os)',
      description:
        'Computes clear-sky opportunity masks and constructs a spatiotemporal bipartite graph. Pairs nested VIIRS 375 m detections to parent MODIS 1 km footprints via geometric intersection rather than crude point-radius circles.',
    },
    {
      step: '3',
      icon: <FileCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      title: 'Coverage-Aware Synthesis & Export',
      subtitle: 'FRP Operators & Full Cryptographic Lineage',
      description:
        'Applies sensor-specific FRP observation operators, generates dual-encoded monthly calendars, and exports verified GeoJSON, CSV, and JSON packages with SHA-256 provenance hashes.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Workflow Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            3 Simple Steps for Effortless Harmonization
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From raw NASA telemetry to publication-grade, cross-sensor reconciled fire intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.bg}`}>
                    {s.icon}
                  </div>
                  <span className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center">
                    {s.step}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  {s.subtitle}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Automated Pipeline Stage
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
