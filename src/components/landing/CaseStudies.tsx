import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import caseStudies from '../../mocks/caseStudies';

export const CaseStudies = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseStudies[0].id);
  const activeCase = caseStudies.find((c) => c.id === selectedCaseId) || caseStudies[0];

  return (
    <section id="case-studies" className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Real Research Scenarios
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Harmonization in Action
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Select a real-world scenario to see how SANYAM resolves satellite observation conflicts across diverse ecosystems.
          </p>
        </div>

        {/* Scenario Pill Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {caseStudies.map((cs) => {
            const isSelected = cs.id === selectedCaseId;
            return (
              <button
                key={cs.id}
                onClick={() => setSelectedCaseId(cs.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cs.badge}</span>
                <span className="hidden sm:inline">· {cs.title.split('—')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Showcase Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Details & Narrative */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-800">
                  {activeCase.badge}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Region: [{activeCase.prefilterRegion.join(', ')}]
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {activeCase.prefilterDate}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {activeCase.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {activeCase.description}
              </p>

              {/* Highlights list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {activeCase.highlights.map((h, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-snug">{h}</span>
                  </div>
                ))}
              </div>

              <div>
                <Link
                  to={`/dashboard?case=${activeCase.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 no-underline"
                >
                  <span>Launch Case in Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Metrics Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Harmonization Context</span>
                  <span className="text-[10px] text-blue-600 font-mono font-normal">NASA Challenge Anchor</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Scenario Class:</span>
                    <span className="font-mono font-medium text-slate-800 uppercase">
                      {activeCase.scenarioType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Prefilter Date:</span>
                    <span className="font-mono font-bold text-amber-600">
                      {activeCase.prefilterDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Spatial Bounds:</span>
                    <span className="font-mono font-bold text-cyan-600">
                      {activeCase.prefilterRegion[0]}°, {activeCase.prefilterRegion[1]}°
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Harmonization Metric:</span>
                    <span className="font-mono font-semibold text-violet-600">
                      {activeCase.id === 'cs1'
                        ? 'Os ≥ 0.50 (Bipartite Overlap)'
                        : activeCase.id === 'cs2'
                        ? 'Cloud Fraction = 0.94 Mask'
                        : 'Dp Cutoff = 5.7 MW Limit'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  Clicking "Launch Case in Dashboard" applies regional coordinates and date filters automatically.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
