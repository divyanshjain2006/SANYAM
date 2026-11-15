import React from 'react';
import { Layers } from 'lucide-react';

interface SensorColumn {
  key: string;
  name: string;
  platform: string;
  sensorType: 'modis' | 'viirs';
}

interface SpecRow {
  feature: string;
  terra: string;
  aqua: string;
  snpp: string;
  noaa20: string;
  noaa21: string;
  tooltip?: string;
}

const SensorComparison: React.FC = () => {
  const columns: SensorColumn[] = [
    { key: 'terra', name: 'Terra', platform: 'MODIS EOS', sensorType: 'modis' },
    { key: 'aqua', name: 'Aqua', platform: 'MODIS EOS', sensorType: 'modis' },
    { key: 'snpp', name: 'S-NPP', platform: 'VIIRS Suomi', sensorType: 'viirs' },
    { key: 'noaa20', name: 'NOAA-20', platform: 'VIIRS JPSS-1', sensorType: 'viirs' },
    { key: 'noaa21', name: 'NOAA-21', platform: 'VIIRS JPSS-2', sensorType: 'viirs' },
  ];

  const rows: SpecRow[] = [
    {
      feature: 'Resolution',
      terra: '1 km',
      aqua: '1 km',
      snpp: '375 m',
      noaa20: '375 m',
      noaa21: '375 m',
    },
    {
      feature: 'Product',
      terra: 'MOD14',
      aqua: 'MYD14',
      snpp: 'VNP14IMG',
      noaa20: 'VJ114IMG',
      noaa21: 'VJ214IMG',
    },
    {
      feature: 'Overpass (Day)',
      terra: '~10:30 UTC',
      aqua: '~13:30 UTC',
      snpp: '~13:30 UTC',
      noaa20: '~13:00 UTC',
      noaa21: '~12:30 UTC',
    },
    {
      feature: 'Collection',
      terra: '6.1',
      aqua: '6.1',
      snpp: '2',
      noaa20: '2',
      noaa21: '2',
    },
    {
      feature: 'FRP Limit (Day)',
      terra: '~5.7 MW (1km)',
      aqua: '~5.7 MW (1km)',
      snpp: '~1.5 MW (375m)',
      noaa20: '~1.5 MW (375m)',
      noaa21: '~1.5 MW (375m)',
    },
    {
      feature: 'Confidence',
      terra: '0–100 scale',
      aqua: '0–100 scale',
      snpp: 'l / n / h',
      noaa20: 'l / n / h',
      noaa21: 'l / n / h',
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: 'rgba(25,34,52,0.3)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              color: '#22D3EE',
              border: '1px solid rgba(34, 211, 238, 0.25)',
            }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cross-Sensor Matrix</span>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: '#F8FAFC' }}>
            Sensor Specifications at a Glance
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            Key physical, radiometric, and orbital characteristics distinguishing the MODIS and VIIRS satellite active fire constellations.
          </p>
        </div>

        {/* Table Container Card */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#192234',
            border: '1px solid rgba(148,163,184,0.16)',
          }}
        >
          {/* Constellation Header Banner */}
          <div className="grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-center border-b border-slate-700/60">
            <div className="col-span-12 sm:col-span-3 py-3 px-4 text-left font-mono text-slate-400 bg-slate-900/40">
              Sensor Constellation
            </div>
            <div
              className="col-span-12 sm:col-span-3 py-3 px-4 border-t sm:border-t-0 sm:border-l border-slate-700/60 flex items-center justify-center gap-2"
              style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}
            >
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>MODIS (NASA EOS Constellation)</span>
            </div>
            <div
              className="col-span-12 sm:col-span-6 py-3 px-4 border-t sm:border-t-0 sm:border-l border-slate-700/60 flex items-center justify-center gap-2"
              style={{ background: 'rgba(34,211,238,0.08)', color: '#22D3EE' }}
            >
              <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
              <span>VIIRS (NASA / NOAA JPSS Constellation)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 text-sm">
                  <th className="py-4 px-6 font-semibold text-slate-400 w-1/4 bg-slate-900/30">
                    Feature
                  </th>
                  {columns.map((col) => {
                    const isModis = col.sensorType === 'modis';
                    return (
                      <th
                        key={col.key}
                        className="py-4 px-4 font-semibold text-center"
                        style={{
                          background: isModis ? 'rgba(245, 158, 11, 0.05)' : 'rgba(34, 211, 238, 0.05)',
                          borderLeft: '1px solid rgba(148, 163, 184, 0.1)',
                        }}
                      >
                        <div
                          className="font-bold text-base"
                          style={{ color: isModis ? '#F59E0B' : '#22D3EE' }}
                        >
                          {col.sensorType === 'modis' ? 'MODIS' : 'VIIRS'} {col.name}
                        </div>
                        <div className="text-xs font-normal text-slate-400 mt-0.5 font-mono">
                          {col.platform}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {rows.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className="transition-colors hover:bg-slate-800/30"
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.25)' }}
                  >
                    <td className="py-3.5 px-6 font-medium text-[#F8FAFC] bg-slate-900/20">
                      {row.feature}
                    </td>

                    {/* MODIS Terra */}
                    <td
                      className="py-3.5 px-4 text-center font-mono font-medium"
                      style={{
                        color: '#FDE68A',
                        background: 'rgba(245, 158, 11, 0.03)',
                        borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
                      }}
                    >
                      {row.terra}
                    </td>

                    {/* MODIS Aqua */}
                    <td
                      className="py-3.5 px-4 text-center font-mono font-medium"
                      style={{
                        color: '#FDE68A',
                        background: 'rgba(245, 158, 11, 0.03)',
                        borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
                      }}
                    >
                      {row.aqua}
                    </td>

                    {/* VIIRS S-NPP */}
                    <td
                      className="py-3.5 px-4 text-center font-mono font-medium"
                      style={{
                        color: '#A5F3FC',
                        background: 'rgba(34, 211, 238, 0.03)',
                        borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
                      }}
                    >
                      {row.snpp}
                    </td>

                    {/* VIIRS NOAA-20 */}
                    <td
                      className="py-3.5 px-4 text-center font-mono font-medium"
                      style={{
                        color: '#A5F3FC',
                        background: 'rgba(34, 211, 238, 0.03)',
                        borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
                      }}
                    >
                      {row.noaa20}
                    </td>

                    {/* VIIRS NOAA-21 */}
                    <td
                      className="py-3.5 px-4 text-center font-mono font-medium"
                      style={{
                        color: '#A5F3FC',
                        background: 'rgba(34, 211, 238, 0.03)',
                        borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
                      }}
                    >
                      {row.noaa21}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div
            className="p-4 sm:px-6 bg-slate-900/50 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              <span>Amber: MODIS 1-km EOS Products (MOD14 / MYD14)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
              <span>Cyan: VIIRS 375-m I-Band Products (VNP14IMG / VJ114IMG / VJ214IMG)</span>
            </div>
            <div className="font-mono text-slate-400">
              Area Ratio: ~7:1 (1 km² vs. 0.14 km²)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SensorComparison;
