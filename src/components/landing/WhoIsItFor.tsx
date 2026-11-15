import React from 'react';

interface PersonaCardProps {
  emoji: string;
  title: string;
  bullets: [string, string, string];
  accentColor: string;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ emoji, title, bullets, accentColor }) => (
  <div
    className="flex flex-col gap-5 p-7 rounded-xl h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
    style={{
      background: '#192234',
      border: '1px solid rgba(148,163,184,0.14)',
      borderTop: `3px solid ${accentColor}`,
    }}
  >
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform duration-300 group-hover:scale-105"
      style={{
        background: `${accentColor}18`,
        border: `1px solid ${accentColor}35`,
      }}
    >
      <span role="img" aria-label={title}>{emoji}</span>
    </div>
    <h3 className="text-xl font-bold" style={{ color: '#F8FAFC' }}>
      {title}
    </h3>
    <ul className="flex flex-col gap-2.5 mt-1 flex-1">
      {bullets.map((bullet, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-sm" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
          <span
            className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full"
            style={{ background: accentColor }}
          />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  </div>
);

const WhoIsItFor: React.FC = () => {
  const personas: PersonaCardProps[] = [
    {
      emoji: '🔬',
      title: 'Scientists & Researchers',
      bullets: [
        'Per-detection QA flags, granule IDs, and collection 6.1/2 provenance for complete reproducibility',
        'IoU and Smaller-Footprint Overlap (Os) metrics for quantitative cross-sensor spatial agreement',
        'FRP observation operators for bias-corrected cross-sensor fire radiative energy studies',
      ],
      accentColor: '#A78BFA', // Violet
    },
    {
      emoji: '🚒',
      title: 'Emergency Responders',
      bullets: [
        'Near-real-time active fire locations paired with precise satellite overpass timestamps',
        'Granule observation opportunity status — immediately know when cloud decks mask active burning',
        'Clear distinction between confirmed fires, cloud-obscured zones, and unobserved areas',
      ],
      accentColor: '#F87171', // Red
    },
    {
      emoji: '🌲',
      title: 'Fire & Land Managers',
      bullets: [
        'Multi-year burning activity calendar dual-encoded with satellite observation opportunity',
        'Seasonal fire regimes with valid non-detection days explicitly separated from missing data',
        'Export-ready GeoJSON/CSV datasets for seamless integration into GIS workflows and reporting',
      ],
      accentColor: '#F59E0B', // Amber
    },
    {
      emoji: '🎓',
      title: 'Students & Educators',
      bullets: [
        'Interactive real-world case studies with step-by-step visual explanations of satellite anomalies',
        'Accessible scientific FAQ detailing resolution mismatches, detection limits, and FRP operators',
        'Transparent end-to-end pipeline tracing raw orbital granules down to matched hotspot pairs',
      ],
      accentColor: '#22D3EE', // Cyan
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#111827' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>
            Audience
          </p>
          <h2 className="text-4xl font-bold" style={{ color: '#F8FAFC' }}>Who Is It For</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            SANYAM is built for everyone who needs to trust their fire data — from emergency incident commanders to academic researchers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p) => (
            <PersonaCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
