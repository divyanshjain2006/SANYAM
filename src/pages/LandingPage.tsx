import { TopBar } from '../components/layout/TopBar';
import Hero from '../components/landing/Hero';
import WhyMatters from '../components/landing/WhyMatters';
import WhatDifferent from '../components/landing/WhatDifferent';
import WhoIsItFor from '../components/landing/WhoIsItFor';
import HowItWorks from '../components/landing/HowItWorks';
import ProposedSolution from '../components/landing/ProposedSolution';
import CaseStudies from '../components/landing/CaseStudies';
import ScienceHighlights from '../components/landing/ScienceHighlights';
import SensorComparison from '../components/landing/SensorComparison';
import FAQ from '../components/landing/FAQ';
import { Flame, Satellite, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <TopBar />
      {/* Offset content below fixed TopBar (64px) */}
      <div style={{ paddingTop: '64px' }}>
        <Hero />
        <WhyMatters />
        <WhatDifferent />
        <WhoIsItFor />
        <HowItWorks />
        <ProposedSolution />
        <CaseStudies />
        <ScienceHighlights />
        <SensorComparison />
        <FAQ />

        {/* Clean, Modern SpaceGenes+ Inspired Footer */}
        <footer className="py-16 px-6 bg-slate-900 text-slate-300">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
              {/* Brand & Project Info */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">SANYAM</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    v1.0.0
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400 max-w-md">
                  Harmonization of MODIS and VIIRS active fire observations. Resolving resolution mismatches,
                  observation-opportunity gaps, and FRP variations for trustworthy cross-sensor fire science.
                </p>

                {/* NASA Space Apps Badge */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-amber-400">
                    <span role="img" aria-label="rocket">🚀</span>
                    <span>NASA International Space Apps Challenge 2026</span>
                  </div>
                </div>
              </div>

              {/* Supported Sensor Products */}
              <div className="md:col-span-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Satellite className="w-4 h-4 text-cyan-400" />
                  <span>Sensor Products & Collections</span>
                </div>
                <div className="flex flex-col gap-2.5 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80">
                    <span className="font-semibold text-amber-400">MODIS (EOS Terra & Aqua):</span>
                    <div className="mt-1 text-slate-400 font-mono text-[11px]">
                      MOD14 (Terra) · MYD14 (Aqua) · Collection 6.1 (1 km nadir)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80">
                    <span className="font-semibold text-cyan-400">VIIRS (S-NPP, NOAA-20 & NOAA-21):</span>
                    <div className="mt-1 text-slate-400 font-mono text-[11px]">
                      VNP14IMG · VJ114IMG · VJ214IMG · Collection 2 (375 m I-band)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80">
                    <span className="font-semibold text-emerald-400">Burned Area Alignment:</span>
                    <div className="mt-1 text-slate-400 font-mono text-[11px]">
                      MODIS MCD64A1 · VIIRS VNP64A1 post-fire validation linkages
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links & Resources */}
              <div className="md:col-span-3 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <span>Navigation & Links</span>
                </div>
                <div className="flex flex-col gap-2 text-xs text-slate-400">
                  <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5 no-underline">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>Analytical Dashboard</span>
                  </Link>
                  <a href="#case-studies" className="hover:text-white transition-colors flex items-center gap-1.5 no-underline">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>Real Research Scenarios</span>
                  </a>
                  <a href="#science-highlights" className="hover:text-white transition-colors flex items-center gap-1.5 no-underline">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>Scientific Formulations</span>
                  </a>
                  <a href="#faq" className="hover:text-white transition-colors flex items-center gap-1.5 no-underline">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>Frequently Asked Questions</span>
                  </a>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" /> QA 100% Tested
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div>
                © 2026 SANYAM Project · Developed for NASA International Space Apps Challenge.
              </div>
              <div className="flex items-center gap-4">
                <span>EOS Terra & Aqua</span>
                <span>•</span>
                <span>Suomi-NPP</span>
                <span>•</span>
                <span>JPSS-1 & JPSS-2</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
