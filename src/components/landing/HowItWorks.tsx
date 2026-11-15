import React from 'react';
import { ArrowRight, ArrowDown, Download, GitMerge, CalendarDays } from 'lucide-react';

interface StepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
}

const Step: React.FC<StepProps> = ({ number, icon, title, description, tags }) => (
  <div
    className="flex flex-col gap-5 p-8 rounded-xl flex-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
    style={{
      background: '#192234',
      border: '1px solid rgba(148,163,184,0.14)',
    }}
  >
    {/* Top row with Amber Numbered Circle + Icon */}
    <div className="flex items-center justify-between">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shrink-0 shadow-md"
        style={{
          background: '#F59E0B',
          color: '#0F172A',
          boxShadow: '0 0 16px rgba(245, 158, 11, 0.3)',
        }}
      >
        {number}
      </div>

      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-colors"
        style={{ background: 'rgba(148,163,184,0.08)' }}
      >
        {icon}
      </div>
    </div>

    <h3 className="text-xl font-bold" style={{ color: '#F8FAFC' }}>
      {title}
    </h3>

    <p className="text-sm flex-1" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
      {description}
    </p>

    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-slate-800/80">
      {tags.map((t) => (
        <span
          key={t}
          className="px-2 py-0.5 rounded text-xs font-mono"
          style={{
            background: 'rgba(148,163,184,0.08)',
            color: '#94A3B8',
            border: '1px solid rgba(148,163,184,0.14)',
          }}
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const steps: StepProps[] = [
    {
      number: '1',
      icon: <Download className="w-5 h-5" />,
      title: 'Source-Preserving Ingestion & QC',
      description:
        'Raw MODIS MOD14/MYD14 and VIIRS VNP14IMG, VJ114IMG, VJ214IMG granules are ingested with ' +
        'full metadata preservation. Granule IDs, collection numbers (6.1 for MODIS, 2 for VIIRS), ' +
        'QA flags, and processing type (Standard vs. NRT) are retained verbatim to ensure auditability ' +
        'and reproducibility from raw archive to final matched record.',
      tags: ['MOD14', 'MYD14', 'VNP14IMG', 'VJ114IMG', 'VJ214IMG', 'QA-flags', 'SHA-256'],
    },
    {
      number: '2',
      icon: <GitMerge className="w-5 h-5" />,
      title: 'Observation Opportunity & Footprint Matching',
      description:
        'Cloud fraction is assessed per granule to classify each pixel as valid clear-sky, cloud-obscured, ' +
        'or outside swath. Actual ground footprint polygons are computed for each detection (not just ' +
        'centroids). A many-to-many bipartite matching algorithm then pairs MODIS and VIIRS detections ' +
        'using IoU and the Smaller-Footprint Overlap (Os) metric.',
      tags: ['valid_area_fraction', 'cloud_obscured', 'outside_swath', 'IoU', 'Os', 'bipartite'],
    },
    {
      number: '3',
      icon: <CalendarDays className="w-5 h-5" />,
      title: 'Coverage-Aware Calendar & Evidence',
      description:
        'Daily thermal activity is dual-encoded with observation-opportunity state in an interactive ' +
        'calendar. Provenance manifests include SHA-256 file hashes for every source granule. Results ' +
        'are exportable as GeoJSON and CSV. FRP observation operators are applied to produce ' +
        'bias-corrected, apples-to-apples radiative power estimates across sensors.',
      tags: ['FRP-operators', 'GeoJSON', 'CSV', 'SHA-256', 'provenance', 'calendar'],
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: 'rgba(25,34,52,0.4)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>
            Pipeline
          </p>
          <h2 className="text-4xl font-bold" style={{ color: '#F8FAFC' }}>How It Works</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            Three rigorous stages transform raw satellite granules into scientifically trustworthy matched hotspot pairs.
          </p>
        </div>

        {/* Steps row with arrow connectors */}
        <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <Step {...step} />
              {idx < steps.length - 1 && (
                <>
                  {/* Desktop arrow connector (horizontal) */}
                  <div className="hidden md:flex items-center justify-center shrink-0 self-center px-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border transition-transform duration-300 hover:scale-110 shadow-sm"
                      style={{
                        background: '#192234',
                        borderColor: 'rgba(245, 158, 11, 0.4)',
                        color: '#F59E0B',
                      }}
                      title="Next Stage"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Mobile arrow connector (pointing down) */}
                  <div className="flex md:hidden items-center justify-center py-2 self-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border shadow-sm"
                      style={{
                        background: '#192234',
                        borderColor: 'rgba(245, 158, 11, 0.4)',
                        color: '#F59E0B',
                      }}
                      title="Next Stage"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
