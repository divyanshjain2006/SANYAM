import React from 'react';
import { Network, GitMerge, FlaskConical } from 'lucide-react';

interface PillarProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Pillar: React.FC<PillarProps> = ({ number, icon, title, description }) => (
  <div
    className="relative flex flex-col gap-5 p-8 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5 group"
    style={{
      background: '#192234',
      border: '1px solid rgba(148,163,184,0.14)',
      borderTop: '4px solid #A78BFA',
    }}
  >
    <div className="flex items-start justify-between">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{
          background: 'rgba(167, 139, 250, 0.15)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          color: '#A78BFA',
        }}
      >
        {icon}
      </div>
      <span
        className="font-mono text-5xl font-bold select-none tracking-tight"
        style={{ color: '#22D3EE', opacity: 0.3, lineHeight: 1 }}
      >
        {number}
      </span>
    </div>
    <div
      className="h-0.5 w-10 rounded-full"
      style={{ background: '#A78BFA' }}
    />
    <h3 className="text-xl font-bold" style={{ color: '#F8FAFC' }}>
      {title}
    </h3>
    <p className="text-sm md:text-base" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
      {description}
    </p>
  </div>
);

const WhatDifferent: React.FC = () => {
  const pillars: PillarProps[] = [
    {
      number: '01',
      icon: <Network className="w-6 h-6" />,
      title: 'Observation-Opportunity Layer',
      description:
        'For every sensor granule, SANYAM computes valid_area_fraction, cloud_obscured_fraction, ' +
        'and outside_swath_fraction over any region of interest. This turns "no data" from an ' +
        'ambiguous absence into a precisely classified observation state — essential for unbiased ' +
        'fire-frequency statistics and trend analysis.',
    },
    {
      number: '02',
      icon: <GitMerge className="w-6 h-6" />,
      title: 'Footprint-Aware Many-to-Many Matching',
      description:
        'Instead of naive nearest-centroid matching, SANYAM computes actual ground footprint polygons ' +
        'for each detection and runs bipartite subgraph matching across sensor pairs. Two overlap metrics ' +
        'capture spatial agreement: IoU (Intersection over Union) and Os (Smaller-Footprint Overlap) — ' +
        'Os being especially informative for asymmetric MODIS/VIIRS pairs where IoU is structurally small.',
    },
    {
      number: '03',
      icon: <FlaskConical className="w-6 h-6" />,
      title: 'Sensor-Aware FRP Observation Operators',
      description:
        'Raw FRP cannot be compared across sensors without correction. SANYAM applies observation operators ' +
        'that account for pixel area, per-sensor detection limits Dp (5.7 MW MODIS vs. 1–3 MW VIIRS), ' +
        'and day/night sensitivity differences. The result is a corrected, apples-to-apples FRP estimate ' +
        'suitable for quantitative fire radiative energy studies.',
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: 'rgba(25,34,52,0.4)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#22D3EE' }}>
            The Approach
          </p>
          <h2 className="text-4xl font-bold" style={{ color: '#F8FAFC' }}>What Makes SANYAM Different</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            Three methodological pillars that go beyond existing fire data portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <Pillar key={p.number} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatDifferent;
