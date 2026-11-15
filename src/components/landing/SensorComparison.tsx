export const SensorComparison = () => {
  return (
    <section className="py-20 px-6 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Instrument Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            MODIS vs. VIIRS Sensor Specifications
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Side-by-side comparison of spatial resolution, nominal detection limits, overpass times, and swath coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MODIS Card */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  M
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">MODIS</h3>
                  <p className="text-xs text-slate-500">EOS Terra & Aqua Platforms</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                1 km Nadir
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Active Fire Products:</span>
                <span className="font-mono font-medium text-slate-800">MOD14 (Terra) · MYD14 (Aqua)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nominal Footprint Area:</span>
                <span className="font-mono font-medium text-slate-800">1.00 km² (up to 9.8 km² at edge)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Swath Width:</span>
                <span className="font-mono font-medium text-slate-800">2,330 km (cross-track)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Daytime FRP Detection Limit:</span>
                <span className="font-mono font-medium text-amber-600 font-bold">~5.7 MW</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Local Overpass Times:</span>
                <span className="font-mono font-medium text-slate-800">Terra ~10:30 · Aqua ~13:30</span>
              </div>
            </div>
          </div>

          {/* VIIRS Card */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyan-500" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  V
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">VIIRS</h3>
                  <p className="text-xs text-slate-500">S-NPP, NOAA-20 & NOAA-21</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">
                375 m I-Band
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Active Fire Products:</span>
                <span className="font-mono font-medium text-slate-800">VNP14IMG · VJ114IMG · VJ214IMG</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nominal Footprint Area:</span>
                <span className="font-mono font-medium text-slate-800">0.14 km² (pixel aggregation)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Swath Width:</span>
                <span className="font-mono font-medium text-slate-800">3,060 km (no swath gaps)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Daytime FRP Detection Limit:</span>
                <span className="font-mono font-medium text-cyan-600 font-bold">~1.5 MW</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Local Overpass Times:</span>
                <span className="font-mono font-medium text-slate-800">S-NPP ~13:30 · NOAA-20 ~12:40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SensorComparison;
