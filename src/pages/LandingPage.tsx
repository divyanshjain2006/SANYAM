import { TopBar } from '../components/layout/TopBar';
import Hero from '../components/landing/Hero';
import SensorComparison from '../components/landing/SensorComparison';
import WhyMatters from '../components/landing/WhyMatters';
import WhatDifferent from '../components/landing/WhatDifferent';
import WhoIsItFor from '../components/landing/WhoIsItFor';
import HowItWorks from '../components/landing/HowItWorks';
import CaseStudies from '../components/landing/CaseStudies';
import FAQ from '../components/landing/FAQ';
import { Github, ExternalLink, Flame, Satellite, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#111827', color: '#CBD5E1' }}>
      <TopBar />
      {/* Offset content below fixed TopBar (56px) */}
      <div style={{ paddingTop: '56px' }}>
        <Hero />
        <SensorComparison />
        <WhyMatters />
        <WhatDifferent />
        <WhoIsItFor />
        <HowItWorks />
        <CaseStudies />
        <FAQ />

        {/* Footer */}
        <footer
          className="py-14 px-6"
          style={{
            background: '#192234',
            borderTop: '1px solid rgba(148, 163, 184, 0.14)',
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
              {/* Brand & Project Info */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">SANYAM</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    v1.0.0
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300 max-w-md">
                  Harmonization of MODIS and VIIRS active fire observations. Resolving resolution mismatches,
                  observation-opportunity gaps, and FRP variations for trustworthy cross-sensor fire science.
                </p>

                {/* NASA Space Apps Badge */}
                <div className="pt-2">
                  <div
                    className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderColor: 'rgba(245, 158, 11, 0.3)',
                      color: '#F59E0B',
                    }}
                  >
                    <span role="img" aria-label="rocket">🚀</span>
                    <span>NASA International Space Apps Challenge 2024</span>
                  </div>
                </div>
              </div>

              {/* Supported Sensor Products */}
              <div className="md:col-span-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  <Satellite className="w-4 h-4 text-cyan-400" />
                  <span>Sensor Products & Collections</span>
                </div>
                <div className="flex flex-col gap-2.5 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="font-semibold text-amber-400">MODIS (EOS Terra & Aqua):</span>
                    <div className="mt-1 text-slate-400 font-mono">
                      MOD14 (Terra) · MYD14 (Aqua) · Collection 6.1 (1 km nadir)
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="font-semibold text-cyan-400">VIIRS (S-NPP, NOAA-20 & NOAA-21):</span>
                    <div className="mt-1 text-slate-400 font-mono">
                      VNP14IMG · VJ114IMG · VJ214IMG · Collection 2 (375 m I-band)
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="font-semibold text-emerald-400">Burned Area Alignment:</span>
                    <div className="mt-1 text-slate-400 font-mono">
                      MODIS MCD64A1 · VIIRS VNP64A1 post-fire validation linkages
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links & Resources */}
              <div className="md:col-span-3 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <span>Navigation & Links</span>
                </div>
                <ul className="flex flex-col gap-2 text-sm text-slate-300">
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>Interactive Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#case-studies"
                      className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>Case Studies</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub Repository</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </li>
                  <li className="pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Full Provenance & SHA-256 Hashes</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p>
                © 2024 SANYAM Team · Developed for the NASA Space Apps Challenge · Open Science & Reproducible Research
              </p>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Built with React + TypeScript + Vite</span>
                <span>•</span>
                <span className="font-mono text-amber-500/80">MODIS × VIIRS</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
