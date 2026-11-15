import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Flame } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScrollToCase = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('case-studies');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.08) 0%, #111827 65%)`,
      }}
    >
      {/* Floating icons */}
      <div className="absolute top-24 left-12 opacity-20 animate-pulse">
        <Satellite className="w-16 h-16" style={{ color: '#22D3EE' }} />
      </div>
      <div className="absolute bottom-32 right-16 opacity-20 animate-pulse">
        <Flame className="w-12 h-12" style={{ color: '#F59E0B' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
          <span>🛰️</span>
          <span>NASA Space Apps Challenge · MODIS × VIIRS Harmonization</span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-6xl font-bold leading-tight mb-6"
          style={{ color: '#F8FAFC', lineHeight: 1.15 }}
        >
          Making Satellite Fire
          <br />
          <span style={{ color: '#F59E0B' }}>Observations</span> Meaningful
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-4 max-w-3xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
          "3 MODIS hotspots vs. 12 VIIRS hotspots" does <strong style={{ color: '#F8FAFC' }}>NOT</strong> mean
          4× more fire. MODIS pixels are 1 km wide; VIIRS pixels are 375 m — a single MODIS pixel can contain
          seven or more VIIRS detections of the same flame.
        </p>
        <p className="text-lg mb-10 max-w-3xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
          Cloud cover, swath gaps, and sensor overpass timing further distort raw counts. SANYAM resolves these
          discrepancies through footprint-aware matching, observation-opportunity tracking, and sensor-aware
          FRP observation operators — giving you apples-to-apples fire data.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-8 py-3 rounded-lg font-semibold text-base transition-all hover:opacity-90 hover:scale-105 no-underline"
            style={{ background: '#F59E0B', color: '#111827' }}
          >
            Explore Interactive Dashboard →
          </Link>
          <a
            href="#case-studies"
            onClick={handleScrollToCase}
            className="px-8 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105 no-underline"
            style={{
              border: '1.5px solid rgba(148,163,184,0.4)',
              color: '#F8FAFC',
              background: 'transparent',
            }}
          >
            View Case Studies
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 8l5 5 5-5" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
