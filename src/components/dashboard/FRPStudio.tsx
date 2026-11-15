import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import frpData from '../../mocks/frpData';
import { usePersona } from '../../store/personaStore';
import { Flame, Activity, Zap, TrendingUp, Info, ShieldCheck } from 'lucide-react';

export function FRPStudio() {
  const { persona } = usePersona();

  // Split MODIS and VIIRS records for Chart 1
  const modisData = useMemo(
    () => frpData.filter((d) => d.sensor.includes('MODIS')),
    []
  );
  const viirsData = useMemo(
    () => frpData.filter((d) => d.sensor.includes('VIIRS')),
    []
  );

  // Chart 2: FRP Distribution Histogram
  // Bin frpData into: 0-10, 10-25, 25-50, 50-100, 100+ MW
  const histogramData = useMemo(() => {
    const bins = ['0-10', '10-25', '25-50', '50-100', '100+'] as const;

    const getBin = (val: number): string => {
      if (val < 10) return '0-10';
      if (val < 25) return '10-25';
      if (val < 50) return '25-50';
      if (val < 100) return '50-100';
      return '100+';
    };

    return bins.map((bin) => {
      const modisCount = frpData.filter(
        (d) => d.sensor.includes('MODIS') && getBin(d.adjustedFRP) === bin
      ).length;
      const viirsCount = frpData.filter(
        (d) => d.sensor.includes('VIIRS') && getBin(d.adjustedFRP) === bin
      ).length;

      return {
        bin,
        MODIS: modisCount,
        VIIRS: viirsCount,
      };
    });
  }, []);

  // Chart 3: Detection Limit Curves
  // Generate data points for pixelArea 0.05 to 1.5 km² (25 points)
  // MODIS_DAY: Dp = 5.7 * sqrt(a / 1.0)
  // MODIS_NIGHT: Dp = 1.5 * sqrt(a / 1.0)
  // VIIRS_DAY: Dp = 1.5 * sqrt(a / 0.141)
  // VIIRS_NIGHT: Dp = 0.4 * sqrt(a / 0.141)
  const detectionLimitData = useMemo(() => {
    const points = [];
    const count = 25;
    const minA = 0.05;
    const maxA = 1.5;

    for (let i = 0; i <= count; i++) {
      const a = Number((minA + (i / count) * (maxA - minA)).toFixed(3));
      const modisDay = Number((5.7 * Math.sqrt(a / 1.0)).toFixed(2));
      const modisNight = Number((1.5 * Math.sqrt(a / 1.0)).toFixed(2));
      const viirsDay = Number((1.5 * Math.sqrt(a / 0.141)).toFixed(2));
      const viirsNight = Number((0.4 * Math.sqrt(a / 0.141)).toFixed(2));

      points.push({
        pixelArea: a,
        MODIS_DAY: modisDay,
        MODIS_NIGHT: modisNight,
        VIIRS_DAY: viirsDay,
        VIIRS_NIGHT: viirsNight,
      });
    }
    return points;
  }, []);

  // Summary Metrics computed from frpData
  const metrics = useMemo(() => {
    const n = frpData.length || 1;
    const meanBias =
      frpData.reduce((acc, d) => acc + (d.adjustedFRP - d.rawFRP), 0) / n;
    const mae =
      frpData.reduce((acc, d) => acc + Math.abs(d.adjustedFRP - d.rawFRP), 0) /
      n;
    const rmse = Math.sqrt(
      frpData.reduce((acc, d) => acc + (d.adjustedFRP - d.rawFRP) ** 2, 0) / n
    );
    const srd =
      (frpData.reduce(
        (acc, d) =>
          acc +
          (2 * Math.abs(d.adjustedFRP - d.rawFRP)) / (d.adjustedFRP + d.rawFRP),
        0
      ) /
        n) *
      100;

    return {
      meanBias,
      mae,
      rmse,
      srd,
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#F59E0B]">
              <Flame className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              FRP Harmonization Studio
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Analyzing raw vs sensor-adjusted Fire Radiative Power (MW) and cross-sensor detection thresholds across MODIS & VIIRS.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white border border-slate-200 text-slate-600 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: persona === 'scientist' ? '#A78BFA' : '#34D399',
              }}
            />
            {persona === 'scientist' ? 'Scientist / Research Mode' : 'Policy / Manager Mode'}
          </span>
        </div>
      </div>

      {/* Two-Column Top Section: Charts 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Raw vs Adjusted FRP Scatter */}
        <div
          className="rounded-xl p-5 flex flex-col justify-between"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#F59E0B]" />
                Raw vs Adjusted FRP Scatter
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates sensor-level point spread against identity baseline
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#F59E0B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> MODIS
              </span>
              <span className="flex items-center gap-1 text-[#22D3EE]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" /> VIIRS
              </span>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  dataKey="rawFRP"
                  name="Raw FRP"
                  unit=" MW"
                  stroke="#94A3B8"
                  fontSize={12}
                  label={{
                    value: 'Raw FRP (MW)',
                    position: 'insideBottom',
                    offset: -10,
                    fill: '#94A3B8',
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="adjustedFRP"
                  name="Adj FRP"
                  unit=" MW"
                  stroke="#94A3B8"
                  fontSize={12}
                  label={{
                    value: 'Adjusted FRP (MW)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 5,
                    fill: '#94A3B8',
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          className="rounded-lg p-2.5 shadow-xl text-xs space-y-1"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            color: '#1E293B',
                          }}
                        >
                          <div className="font-semibold text-sm flex items-center justify-between gap-3">
                            <span
                              style={{
                                color: data.sensor.includes('MODIS') ? '#F59E0B' : '#22D3EE',
                              }}
                            >
                              {data.sensor} ({data.dayNight === 'D' ? 'Day' : 'Night'})
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">
                              ID: {data.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-600 pt-1 border-t border-slate-200">
                            <span>Raw FRP:</span>
                            <span className="font-mono text-right font-medium">
                              {data.rawFRP} MW
                            </span>
                            <span>Adjusted FRP:</span>
                            <span className="font-mono text-right font-medium text-[#34D399]">
                              {data.adjustedFRP} MW
                            </span>
                            <span>Pixel Area:</span>
                            <span className="font-mono text-right">
                              {data.pixelArea} km²
                            </span>
                            <span>Detection Limit:</span>
                            <span className="font-mono text-right">
                              {data.detectionLimit} MW
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                <Scatter name="MODIS" data={modisData} fill="#F59E0B" fillOpacity={0.85} />
                <Scatter name="VIIRS" data={viirsData} fill="#22D3EE" fillOpacity={0.85} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>MODIS Samples: {modisData.length}</span>
            <span>VIIRS Samples: {viirsData.length}</span>
            <span className="text-slate-600">Adjusted calibration ratio ~1.05×</span>
          </div>
        </div>

        {/* Chart 2: FRP Distribution Histogram */}
        <div
          className="rounded-xl p-5 flex flex-col justify-between"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#22D3EE]" />
                FRP Distribution Histogram
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fire detection count binned by radiative intensity (MW)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#F59E0B]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> MODIS
              </span>
              <span className="flex items-center gap-1 text-[#22D3EE]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#22D3EE]" /> VIIRS
              </span>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={histogramData}
                margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="bin"
                  stroke="#94A3B8"
                  fontSize={12}
                  label={{
                    value: 'FRP Range (MW)',
                    position: 'insideBottom',
                    offset: -10,
                    fill: '#94A3B8',
                    fontSize: 12,
                  }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  label={{
                    value: 'Detections Count',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 5,
                    fill: '#94A3B8',
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#1E293B',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="MODIS"
                  fill="#F59E0B"
                  name="MODIS"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="VIIRS"
                  fill="#22D3EE"
                  name="VIIRS"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Peak VIIRS Density: 0–25 MW</span>
            <span>Peak MODIS Density: 10–50 MW</span>
            <span className="text-[#34D399]">High-res VIIRS captures low-FRP fires</span>
          </div>
        </div>
      </div>

      {/* Chart 3: Detection Limit Curves (Full Width) */}
      <div
        className="rounded-xl p-5"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#A78BFA]" />
              Theoretical Sensor Detection Limit Curves (Dₚ vs Pixel Area)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Minimum Fire Radiative Power (MW) required for positive detection as scan angle expands instantaneous pixel area (Aₚ)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <span className="w-3 h-0.5 bg-[#F59E0B]" /> MODIS Day
            </span>
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <span className="w-3 h-0.5 border-b border-dashed border-[#F59E0B]" /> MODIS Night
            </span>
            <span className="flex items-center gap-1 text-[#22D3EE]">
              <span className="w-3 h-0.5 bg-[#22D3EE]" /> VIIRS Day
            </span>
            <span className="flex items-center gap-1 text-[#22D3EE]">
              <span className="w-3 h-0.5 border-b border-dashed border-[#22D3EE]" /> VIIRS Night
            </span>
          </div>
        </div>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={detectionLimitData}
              margin={{ top: 20, right: 30, bottom: 25, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="pixelArea"
                stroke="#94A3B8"
                fontSize={12}
                unit=" km²"
                label={{
                  value: 'Ground Pixel Area Aₚ (km²)',
                  position: 'insideBottom',
                  offset: -12,
                  fill: '#94A3B8',
                  fontSize: 12,
                }}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                unit=" MW"
                domain={[0, 25]}
                label={{
                  value: 'Detection Limit Dₚ (MW)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 5,
                  fill: '#94A3B8',
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#1E293B',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: number, name: string) => [`${val} MW`, name]}
                labelFormatter={(label) => `Pixel Area: ${label} km²`}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />

              {/* Labeled Reference Lines */}
              <ReferenceLine
                x={1.0}
                stroke="#F59E0B"
                strokeDasharray="3 3"
                label={{
                  value: 'MODIS Nadir 1.0 km² (5.7 MW)',
                  fill: '#F59E0B',
                  position: 'insideTopLeft',
                  fontSize: 11,
                }}
              />
              <ReferenceLine
                x={0.141}
                stroke="#22D3EE"
                strokeDasharray="3 3"
                label={{
                  value: 'VIIRS Nadir 0.141 km² (1.5 MW)',
                  fill: '#22D3EE',
                  position: 'insideTopRight',
                  fontSize: 11,
                }}
              />

              <Line
                type="monotone"
                dataKey="MODIS_DAY"
                name="MODIS Day"
                stroke="#F59E0B"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="MODIS_NIGHT"
                name="MODIS Night"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="VIIRS_DAY"
                name="VIIRS Day"
                stroke="#22D3EE"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="VIIRS_NIGHT"
                name="VIIRS Night"
                stroke="#22D3EE"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Persona adaptive explanation under Chart 3 */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          {persona === 'scientist' ? (
            <div className="p-3.5 rounded-lg bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.25)] flex items-start gap-3">
              <Info className="w-5 h-5 text-[#A78BFA] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wide">
                    Analytical Physical Formula
                  </span>
                  <code className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(15,23,42,0.6)] text-slate-800 border border-[rgba(167,139,250,0.3)]">
                    Dₚ = 5.7 × √(Aₚ / A_ref) [MW]
                  </code>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Theoretical minimum detectable Fire Radiative Power (MW) scales with the square root of instantaneous ground pixel area <span className="font-mono text-slate-800">Aₚ</span>. For MODIS, off-nadir scan distortion causes pixel area expansion from 1.0 km² up to ~4.8 km² at swath edge, raising detection threshold from 5.7 MW to &gt;12 MW. VIIRS 375m pixel aggregation constrains scan expansion to ~2× (0.141 km² to ~0.3 km²), preserving sub-2 MW daytime detection sensitivity across nearly the full 3040 km swath.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.25)] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wide">
                  Executive Operational Takeaway
                </span>
                <p className="text-sm font-medium text-slate-800">
                  VIIRS detects fires 4× smaller than MODIS can see.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Small crop-residue burns (1.5 to 5.0 MW) will frequently trigger VIIRS alerts while remaining completely invisible to MODIS. SANYAM harmonizes these differences so zero detections in MODIS are never misinterpreted as the absence of fire.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mean Bias Card */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Mean Bias</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[rgba(226,232,240,0.8)]">
              Adj - Raw
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-slate-800">
                {metrics.meanBias >= 0 ? `+${metrics.meanBias.toFixed(2)}` : metrics.meanBias.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">MW</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-[rgba(226,232,240,0.6)] pt-2">
            Average systematic adjustment shift
          </div>
        </div>

        {/* MAE Card */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Mean Absolute Error</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[rgba(226,232,240,0.8)]">
              MAE
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#F59E0B]">
                {metrics.mae.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">MW</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-[rgba(226,232,240,0.6)] pt-2">
            Average magnitude of FRP calibration
          </div>
        </div>

        {/* RMSE Card */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Root Mean Square Error</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[rgba(226,232,240,0.8)]">
              RMSE
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#22D3EE]">
                {metrics.rmse.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">MW</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-[rgba(226,232,240,0.6)] pt-2">
            Sensitivity to high-energy outliers
          </div>
        </div>

        {/* SRD Card */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Symmetric Relative Diff</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[rgba(226,232,240,0.8)]">
              SRD
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#34D399]">
                {metrics.srd.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-[rgba(226,232,240,0.6)] pt-2">
            Normalized relative disparity index
          </div>
        </div>
      </div>
    </div>
  );
}

export default FRPStudio;
