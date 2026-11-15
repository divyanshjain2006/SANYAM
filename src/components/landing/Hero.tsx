import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative pt-12 pb-20 px-6 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50/50 to-white">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-blue-400/10 via-cyan-300/10 to-amber-300/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 bg-white border border-blue-200/80 shadow-sm text-blue-700 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span>NASA Space Apps 2026· Earth Observation Science</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mb-6">
          Synergetic Fire Discovery for{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Earth Observation
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-4">
          To harmonize multi-satellite thermal detections across MODIS (1 km) and VIIRS (375 m) into a unified, physical, and cross-calibrated fire record.
        </p>

        <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed mb-8">
          Addressing why <strong className="text-slate-800">3 MODIS hotspots vs 12 VIIRS hotspots</strong> does <strong className="text-slate-800">NOT</strong> mean 4× more fire, eliminating false trends from resolution mismatch, cloud obscuration, and overpass timing.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-14">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 no-underline"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#case-studies"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow active:scale-95 no-underline"
          >
            <span>Explore Case Studies</span>
          </a>
        </div>

        {/* Interactive Dashboard Browser Frame Mockup */}
        <div className="w-full max-w-5xl rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/80 to-slate-300/40 border border-slate-200 shadow-2xl relative">
          {/* Browser Window Chrome */}
          <div className="bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-sm text-left">
            {/* Window Header */}
            <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 text-xs font-mono text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200">
                  sanyam.nasa.gov/dashboard?case=cs1
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Live Preview
                </span>
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="p-4 sm:p-6 bg-slate-50/60">
              {/* Mockup KPI Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Total Hotspots</div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">29 Records</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-1">✓ MODIS + VIIRS Harmonized</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">MODIS 1km Detections</div>
                  <div className="text-xl font-bold text-amber-600 mt-0.5">2 Clusters</div>
                  <div className="text-[10px] text-slate-500 mt-1">Terra / Aqua Collection 6.1</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">VIIRS 375m Detections</div>
                  <div className="text-xl font-bold text-cyan-600 mt-0.5">27 Sub-Pixels</div>
                  <div className="text-[10px] text-slate-500 mt-1">S-NPP / NOAA-20 / NOAA-21</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Bipartite Overlap (Os)</div>
                  <div className="text-xl font-bold text-violet-600 mt-0.5">0.82 Avg</div>
                  <div className="text-[10px] text-slate-500 mt-1">IoU & Containment Filtered</div>
                </div>
              </div>

              {/* Mockup Data Table Preview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Harmonized Active Fire Observations Matrix (Case 1: Punjab Stubble Burning)
                    </span>
                  </div>
                  <Link
                    to="/dashboard?case=cs1"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 no-underline"
                  >
                    Open Full Table & Map <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Sensor & Platform</th>
                        <th className="py-2.5 px-3.5">Pixel Footprint</th>
                        <th className="py-2.5 px-3.5">Raw FRP</th>
                        <th className="py-2.5 px-3.5">Adjusted FRP</th>
                        <th className="py-2.5 px-3.5">Confidence</th>
                        <th className="py-2.5 px-3.5">Harmonization Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3.5 font-sans font-medium flex items-center gap-1.5 text-slate-800">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> MODIS Aqua (MYD14)
                        </td>
                        <td className="py-2.5 px-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
                            1.00 km² (Nadir)
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-800">42.8 MW</td>
                        <td className="py-2.5 px-3.5 font-bold text-blue-600">44.9 MW</td>
                        <td className="py-2.5 px-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-medium">
                            Nominal (85%)
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-violet-50 text-violet-700 border border-violet-200 font-medium">
                            Matched (6 VIIRS Sub-Pixels)
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3.5 font-sans font-medium flex items-center gap-1.5 text-slate-800">
                          <span className="w-2 h-2 rounded-full bg-cyan-500" /> VIIRS NOAA-20 (VJ114)
                        </td>
                        <td className="py-2.5 px-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-50 text-cyan-700 border border-cyan-200">
                            0.14 km² (I-Band)
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-800">7.4 MW</td>
                        <td className="py-2.5 px-3.5 font-bold text-blue-600">7.2 MW</td>
                        <td className="py-2.5 px-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-medium">
                            High (92%)
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-violet-50 text-violet-700 border border-violet-200 font-medium">
                            Co-Located (Os = 0.94)
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3.5 font-sans font-medium flex items-center gap-1.5 text-slate-800">
                          <span className="w-2 h-2 rounded-full bg-cyan-500" /> VIIRS S-NPP (VNP14)
                        </td>
                        <td className="py-2.5 px-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-50 text-cyan-700 border border-cyan-200">
                            0.14 km² (I-Band)
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-800">5.9 MW</td>
                        <td className="py-2.5 px-3.5 font-bold text-blue-600">5.8 MW</td>
                        <td className="py-2.5 px-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-medium">
                            High (90%)
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-violet-50 text-violet-700 border border-violet-200 font-medium">
                            Co-Located (Os = 0.88)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Displaying 3 of 29 harmonized detections</span>
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    NASA Earth Science Data Systems (ESDS) Verified Observations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
