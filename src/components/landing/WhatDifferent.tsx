import React from 'react';
import { Eye, Network, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhatDifferent: React.FC = () => {
  const pillars = [
    {
      icon: <Eye className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      tag: 'Coverage Awareness',
      title: 'Observation-Opportunity Layer',
      description:
        'Every grid cell and day carries an explicit observation state: Valid Clear-Sky (green), Cloud-Obscured (slate), or Outside Swath. A day with 0 fires under 95% cloud cover is flagged as unobserved — never falsely logged as fire-free.',
      benefit: 'Eliminates false fire-free claims caused by monsoon and overcast skies.',
    },
    {
      icon: <Network className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      tag: 'Spatial Precision',
      title: 'Footprint-Aware Many-to-Many Matching',
      description:
        'Replaces naive centroid distance thresholds with actual ground footprint geometry (skewed off-nadir polygons) and the Smaller-Footprint Overlap (Os) metric. Accurately links 1 broad MODIS footprint to multiple VIIRS sub-pixels.',
      benefit: 'Accurately pairs nested sub-pixel fires without duplicate counting.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
      tag: 'Physical Calibration',
      title: 'Sensor-Aware FRP Observation Operators',
      description:
        'Adjusts raw Fire Radiative Power (MW) against sensor detection limit curves (Dp), diurnal burning cycles between Terra (~10:30) and Aqua (~13:30), and off-nadir pixel broadening for dependable emissions estimation.',
      benefit: 'Bridges raw sensor energy differences into an absolute physical metric.',
    },
  ];

  return (
    <section className="py-20 px-6 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Harmonization Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Makes SANYAM Different?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Conventional tools simply superimpose dots on a map. SANYAM is a physics-informed harmonization system built around three foundational innovations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${p.bg}`}>
                  {p.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {p.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-2">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>{p.benefit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors no-underline"
          >
            <span>Test These Capabilities in the Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatDifferent;
