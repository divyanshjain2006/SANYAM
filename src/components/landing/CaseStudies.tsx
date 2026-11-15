import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

interface CaseCardProps {
  caseNum: string;
  caseId: string;
  title: string;
  description: string;
  region: string;
  date: string;
  bullets: string[];
  modisLabel: string;
  viirsLabel: string;
}

const SensorPill: React.FC<{ label: string; color: string; bg: string }> = ({ label, color, bg }) => (
  <span
    className="px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: bg, color }}
  >
    {label}
  </span>
);

const CaseCard: React.FC<CaseCardProps> = ({
  caseNum, caseId, title, description, region, date, bullets, modisLabel, viirsLabel,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col gap-5 p-7 rounded-xl cursor-pointer group transition-all hover:scale-[1.02]"
      style={{
        background: '#192234',
        border: '1px solid rgba(148,163,184,0.14)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
        >
          {caseNum}
        </span>
        <div className="flex gap-2">
          <SensorPill label={modisLabel} color="#F59E0B" bg="rgba(245,158,11,0.15)" />
          <SensorPill label={viirsLabel} color="#22D3EE" bg="rgba(34,211,238,0.12)" />
        </div>
      </div>

      <h3 className="text-lg font-bold" style={{ color: '#F8FAFC' }}>{title}</h3>
      <p className="text-sm" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>{description}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#94A3B8' }}>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {region}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {date}
        </span>
      </div>

      {/* Bullets */}
      <ul className="flex flex-col gap-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#22D3EE' }} />
            {b}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => navigate(`/dashboard?case=${caseId}`)}
        className="mt-auto flex items-center gap-2 text-sm font-semibold transition-colors group-hover:gap-3"
        style={{ color: '#F59E0B', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Launch Case in Dashboard
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const CaseStudies: React.FC = () => {
  const cases: CaseCardProps[] = [
    {
      caseNum: 'Case 1',
      caseId: 'cs1',
      title: 'Agricultural Burning Cluster — Many-to-Many Overlap',
      description:
        'Two MODIS detections co-registered with nine VIIRS hotspots over a dense crop residue burning cluster. ' +
        'Demonstrates how footprint-aware bipartite matching reveals the true fire extent.',
      region: 'Punjab, India',
      date: 'Oct 2023',
      bullets: [
        '2 MODIS vs. 9 VIIRS detections — raw count ratio misleading without footprint context',
        'Os metric reveals all 9 VIIRS pixels overlap within the 2 MODIS footprints',
        'FRP observation operator corrects for 7× pixel-area difference',
      ],
      modisLabel: 'MODIS ×2',
      viirsLabel: 'VIIRS ×9',
    },
    {
      caseNum: 'Case 2',
      caseId: 'cs2',
      title: 'Cloud-Obscured MODIS Pass vs. VIIRS Detection',
      description:
        'A MODIS Terra pass reports zero hotspots; VIIRS SNPP detects active fire 40 minutes later. ' +
        'Valid non-detection revealed by cloud_obscured_fraction = 0.94 for the MODIS granule.',
      region: 'Mato Grosso, Brazil',
      date: 'Aug 2023',
      bullets: [
        'MODIS cloud_obscured_fraction = 0.94 — most of the granule obscured',
        'VIIRS valid clear-sky observation confirms active fire below cloud deck',
        'Observation-opportunity layer prevents false "fire-free" classification',
      ],
      modisLabel: 'MODIS ×0',
      viirsLabel: 'VIIRS ×4',
    },
    {
      caseNum: 'Case 3',
      caseId: 'cs3',
      title: 'Sub-Threshold Low-Intensity Fire below MODIS Detection Limit',
      description:
        'A low-intensity grass fire with FRP ~2.1 MW falls below MODIS 1-km detection threshold (~5.7 MW). ' +
        'VIIRS 375-m sensitivity captures it; MODIS valid clear-sky — genuine sensor capability difference.',
      region: 'California, USA',
      date: 'Mar 2024',
      bullets: [
        'Fire FRP ~2.1 MW — below MODIS 5.7 MW daytime detection limit',
        'MODIS valid clear-sky with 0 detections; VIIRS detects 1 hotspot',
        'FRP operator flags as sub-threshold rather than valid non-detection',
      ],
      modisLabel: 'MODIS ×0',
      viirsLabel: 'VIIRS ×1',
    },
  ];

  return (
    <section id="case-studies" className="py-20 px-6" style={{ background: '#111827' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#22D3EE' }}>
            Interactive Demos
          </p>
          <h2 className="text-4xl font-bold" style={{ color: '#F8FAFC' }}>Case Studies</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            Three real-world scenarios that showcase each type of MODIS–VIIRS discrepancy — click any card to explore it live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <CaseCard key={c.caseId} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
