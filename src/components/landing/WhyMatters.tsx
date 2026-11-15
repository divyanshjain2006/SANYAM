import React from 'react';

interface CardProps {
  icon: string;
  title: string;
  body: string;
}

const Card: React.FC<CardProps> = ({ icon, title, body }) => (
  <div
    className="relative flex flex-col gap-4 p-7 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group"
    style={{
      background: '#192234',
      border: '1px solid rgba(148,163,184,0.14)',
      borderLeft: '4px solid #F59E0B',
    }}
  >
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-105"
      style={{
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
      }}
    >
      <span role="img" aria-label={title}>{icon}</span>
    </div>
    <h3 className="text-xl font-semibold" style={{ color: '#F8FAFC' }}>
      {title}
    </h3>
    <p className="text-base" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
      {body}
    </p>
  </div>
);

const WhyMatters: React.FC = () => {
  const cards: CardProps[] = [
    {
      icon: '🔭',
      title: 'Resolution Mismatch (1 km vs. 375 m)',
      body:
        'MODIS pixels cover roughly 1 km × 1 km at nadir; VIIRS pixels cover 375 m × 375 m. ' +
        'That ~7× area difference means a single MODIS pixel can contain seven or more VIIRS pixels ' +
        'observing the same fire cluster. Raw hotspot counts across sensors are therefore fundamentally ' +
        'incomparable without footprint-aware reconciliation.',
    },
    {
      icon: '☁️',
      title: 'The Missing-Data Trap',
      body:
        '"0 hotspots detected" is not the same as "0 fire activity." Clouds can completely block a ' +
        'sensor pass, and orbital swath gaps leave entire regions unobserved. SANYAM tracks the ' +
        'observation-opportunity state (valid clear-sky, cloud-obscured, outside-swath) for every ' +
        'sensor granule so valid non-detections are never confused with true fire-free conditions.',
    },
    {
      icon: '📡',
      title: 'Measurement Discrepancies',
      body:
        'Raw Fire Radiative Power (FRP) values differ between sensors due to pixel size, detection ' +
        'thresholds (~5.7 MW for MODIS 1-km vs. ~1–3 MW for VIIRS 375-m), and overpass timing: ' +
        'Terra passes at ~10:30 LT, Aqua at ~13:30 LT, and JPSS satellites at different times. ' +
        'FRP observation operators correct for these biases, enabling fair cross-sensor comparison.',
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#111827' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>
            The Problem
          </p>
          <h2 className="text-4xl font-bold" style={{ color: '#F8FAFC' }}>Why This Matters</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            Three systematic sources of confusion make cross-sensor fire comparison hazardous without the right tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <Card key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMatters;
