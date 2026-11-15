import { useState, useMemo } from 'react';
import calendarData from '../../mocks/calendar';
import type { CalendarDay } from '../../types';
import { usePersona } from '../../store/personaStore';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
  AlertTriangle,
  CheckCircle,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOffset(year: number, month: number): number {
  // 0=Sun..6=Sat, convert to Mon-based: (day + 6) % 7
  return (new Date(year, month - 1, 1).getDay() + 6) % 7;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarWorkspace() {
  const { persona } = usePersona();
  const [currentYear, setCurrentYear] = useState<number>(2023);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // October
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysInMonth = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const firstDayOffset = useMemo(
    () => getFirstDayOffset(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  const monthData = useMemo(() => {
    return calendarData.filter((d) => d.date.startsWith(monthPrefix));
  }, [monthPrefix]);

  const getDayData = (dateStr: string): CalendarDay => {
    const found = calendarData.find((d) => d.date === dateStr);
    if (found) return found;
    return {
      date: dateStr,
      thermalActivityCount: 0,
      validAreaFraction: 0.7,
      cloudObscuredFraction: 0.2,
      outsideSwathFraction: 0.1,
      hotspots: [],
    };
  };

  const selectedDayData: CalendarDay | null = useMemo(() => {
    if (!selectedDate) return null;
    return getDayData(selectedDate);
  }, [selectedDate]);

  const getCellBg = (count: number): string => {
    if (count === 0) return '#1E293B';
    if (count <= 3) return 'rgba(245,158,11,0.3)';
    if (count <= 8) return 'rgba(245,158,11,0.6)';
    return '#F59E0B';
  };

  const formatDisplayDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Month stats for header
  const totalFiresInMonth = useMemo(() => {
    return monthData.reduce((acc, curr) => acc + curr.thermalActivityCount, 0);
  }, [monthData]);

  const avgClearSky = useMemo(() => {
    if (monthData.length === 0) return 0;
    const total = monthData.reduce((acc, curr) => acc + curr.validAreaFraction, 0);
    return Math.round((total / monthData.length) * 100);
  }, [monthData]);

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* Top Banner & Quick Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Coverage-Aware Burning-Activity Calendar
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Distinguish true non-burning days from satellite coverage gaps and cloud obscuration.
            Each day cell reflects thermal detections and sensor observation opportunity.
          </p>
        </div>

        {/* Quick Month Metrics & Benchmark Filters */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center gap-4">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Month Detections
              </span>
              <span className="text-amber-400 font-bold text-base">{totalFiresInMonth}</span>
            </div>
            <div className="w-px h-7 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Avg Clear-Sky
              </span>
              <span className="text-emerald-400 font-bold text-base">{avgClearSky}%</span>
            </div>
          </div>

          {currentYear === 2023 && currentMonth === 10 && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedDate('2023-10-28')}
                className="px-2.5 py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium transition-colors"
                title="Case Study 1: Cloud-obscured zero detection"
              >
                Oct 28 (Cloud Obscured)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('2023-10-27')}
                className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition-colors"
                title="Active burning peak (14 fires)"
              >
                Oct 27 (Peak Fires)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('2023-10-03')}
                className="px-2.5 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium transition-colors"
                title="Valid clear-sky non-detection"
              >
                Oct 03 (Valid Zero)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
        {/* Left Side: Calendar & Controls & Legend */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between bg-slate-900/70 border border-slate-800 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">
                {MONTH_NAMES[currentMonth - 1]} {currentYear}
              </h2>
              {currentYear !== 2023 || currentMonth !== 10 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentYear(2023);
                    setCurrentMonth(10);
                  }}
                  className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors"
                >
                  Back to Oct 2023
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-1.5 rounded-lg border border-slate-700/70 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-1.5 rounded-lg border border-slate-700/70 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7-Column Calendar Grid Container */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-md">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty offset slots */}
              {Array.from({ length: firstDayOffset }).map((_, idx) => (
                <div
                  key={`offset-${idx}`}
                  className="min-h-[58px] rounded-lg bg-slate-900/30 border border-slate-800/40 opacity-40 pointer-events-none"
                />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(
                  dayNum
                ).padStart(2, '0')}`;
                const dayData = getDayData(dateStr);
                const isSelected = selectedDate === dateStr;
                const cellBg = getCellBg(dayData.thermalActivityCount);
                const count = dayData.thermalActivityCount;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className="group relative min-h-[58px] p-1.5 rounded-lg text-left flex flex-col justify-between transition-all duration-150 cursor-pointer focus:outline-none hover:scale-[1.04] hover:z-20"
                    style={{
                      backgroundColor: cellBg,
                      border: isSelected
                        ? '2px solid #F59E0B'
                        : '1px solid rgba(226,232,240,0.8)',
                      boxShadow: isSelected
                        ? '0 0 14px rgba(245, 158, 11, 0.45)'
                        : undefined,
                    }}
                  >
                    {/* Top Row: Day Number & Small status cue */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-medium leading-none ${
                          count >= 9 ? 'text-slate-950 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Small Indicator if valid zero non-detection */}
                      {count === 0 && dayData.validAreaFraction > 0.8 && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-70 group-hover:opacity-100"
                          title="Valid Clear-Sky Non-Detection"
                        />
                      )}
                      {/* Small indicator if cloud obscured zero */}
                      {count === 0 && dayData.cloudObscuredFraction > 0.5 && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-70 group-hover:opacity-100"
                          title="Cloud Obscured Non-Detection"
                        />
                      )}
                    </div>

                    {/* Center: Hotspot count badge (amber if > 0) */}
                    {count > 0 ? (
                      <div className="flex-1 flex items-center justify-center my-0.5">
                        <span
                          className={`text-xs px-1.5 py-0.2 rounded-full font-bold shadow-sm leading-tight ${
                            count >= 9
                              ? 'text-slate-950 bg-white/70 font-black'
                              : 'text-amber-200 bg-amber-950/70 border border-amber-500/40'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* Bottom Colored Stripe (8px height, proportional bars) */}
                    <div className="h-2 w-full flex overflow-hidden rounded-b-md mt-auto">
                      <div
                        style={{
                          width: `${dayData.validAreaFraction * 100}%`,
                          backgroundColor: '#34D399',
                        }}
                        title={`Clear-Sky: ${(dayData.validAreaFraction * 100).toFixed(0)}%`}
                      />
                      <div
                        style={{
                          width: `${dayData.cloudObscuredFraction * 100}%`,
                          backgroundColor: '#64748B',
                        }}
                        title={`Cloud-Obscured: ${(dayData.cloudObscuredFraction * 100).toFixed(0)}%`}
                      />
                      <div
                        style={{
                          width: `${dayData.outsideSwathFraction * 100}%`,
                          backgroundColor: '#475569',
                        }}
                        title={`Outside Swath: ${(dayData.outsideSwathFraction * 100).toFixed(0)}%`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Row Legend */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 text-xs text-slate-300 flex flex-col gap-3">
            {/* Row 1: Thermal Activity */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] min-w-[130px]">
                Thermal Activity:
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1' }}
                />
                <span>0 fires</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.3)',
                    border: '1px solid rgba(245,158,11,0.4)',
                  }}
                />
                <span>1–3 fires</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.6)',
                    border: '1px solid rgba(245,158,11,0.7)',
                  }}
                />
                <span>4–8 fires</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }} />
                <span>9+ fires</span>
              </div>
            </div>

            {/* Row 2: Observation Opportunity */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-800/80 pt-2.5">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] min-w-[130px]">
                Opportunity Stripe:
              </span>
              <div className="flex items-center gap-2">
                <span className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: '#34D399' }} />
                <span>Valid Clear-Sky</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: '#64748B' }} />
                <span>Cloud-Obscured</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: '#475569' }} />
                <span>Outside Swath</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Daily Breakdown Panel (w-80, hidden when no selection) */}
        {selectedDayData && (
          <aside className="w-full lg:w-80 flex-shrink-0 bg-white border border-slate-800 rounded-xl p-5 flex flex-col gap-5 text-slate-200 shadow-xl transition-all">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Daily Observation Breakdown
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  {formatDisplayDate(selectedDayData.date)}
                </h3>
                <span className="text-xs text-slate-400 font-mono">{selectedDayData.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                aria-label="Close panel"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Activity Section */}
            <div className="flex flex-col gap-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                Thermal Activity
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-800">
                  {selectedDayData.thermalActivityCount}
                </span>
                {selectedDayData.thermalActivityCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Flame className="w-3.5 h-3.5" />
                    Active Fire Detections
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Zero active hotspots</span>
                )}
              </div>

              {/* Sensor Breakdown */}
              <div className="text-xs text-slate-300 font-mono bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800 mt-1">
                {selectedDayData.thermalActivityCount === 0 ? (
                  <span className="text-slate-400">MODIS: 0 | VIIRS: 0</span>
                ) : (
                  <>
                    <span className="text-amber-400 font-medium">
                      MODIS: {Math.max(1, Math.round(selectedDayData.thermalActivityCount * 0.25))}
                    </span>
                    <span className="text-slate-500 mx-2">|</span>
                    <span className="text-cyan-400 font-medium">
                      VIIRS:{' '}
                      {selectedDayData.thermalActivityCount -
                        Math.max(1, Math.round(selectedDayData.thermalActivityCount * 0.25))}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Observation Opportunity Section */}
            <div className="flex flex-col gap-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                Observation Opportunity
              </span>

              {/* Stacked Horizontal Bar */}
              <div className="w-full h-3 rounded-md overflow-hidden flex bg-slate-950 border border-slate-800">
                <div
                  style={{
                    width: `${selectedDayData.validAreaFraction * 100}%`,
                    backgroundColor: '#34D399',
                  }}
                  title={`Valid Clear-Sky: ${(selectedDayData.validAreaFraction * 100).toFixed(0)}%`}
                />
                <div
                  style={{
                    width: `${selectedDayData.cloudObscuredFraction * 100}%`,
                    backgroundColor: '#64748B',
                  }}
                  title={`Cloud-Obscured: ${(selectedDayData.cloudObscuredFraction * 100).toFixed(0)}%`}
                />
                <div
                  style={{
                    width: `${selectedDayData.outsideSwathFraction * 100}%`,
                    backgroundColor: '#475569',
                  }}
                  title={`Outside Swath: ${(selectedDayData.outsideSwathFraction * 100).toFixed(0)}%`}
                />
              </div>

              {/* Percentage breakdown labels below */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[11px]">
                <div className="flex flex-col">
                  <span className="text-emerald-400 font-bold">
                    {Math.round(selectedDayData.validAreaFraction * 100)}%
                  </span>
                  <span className="text-slate-400 text-[10px]">Clear-Sky</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-300 font-bold">
                    {Math.round(selectedDayData.cloudObscuredFraction * 100)}%
                  </span>
                  <span className="text-slate-400 text-[10px]">Cloud</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 font-bold">
                    {Math.round(selectedDayData.outsideSwathFraction * 100)}%
                  </span>
                  <span className="text-slate-500 text-[10px]">Outside</span>
                </div>
              </div>
            </div>

            {/* Persona Specific View */}
            {persona === 'scientist' ? (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 flex flex-col gap-1.5">
                <div className="text-[10px] uppercase font-sans font-bold tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Scientist Mode Metrics
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                  <span className="text-emerald-400">valid_area_fraction:</span>
                  <span className="font-semibold">
                    {selectedDayData.validAreaFraction.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                  <span className="text-slate-400">cloud_obscured_fraction:</span>
                  <span className="font-semibold">
                    {selectedDayData.cloudObscuredFraction.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-indigo-400">outside_swath_fraction:</span>
                  <span className="font-semibold">
                    {selectedDayData.outsideSwathFraction.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1">
                  Manager Mode Summary
                </div>
                <p>
                  <strong className="text-emerald-400 font-semibold">
                    {Math.round(selectedDayData.validAreaFraction * 100)}%
                  </strong>{' '}
                  of the area had clear skies during this day&apos;s satellite passes.
                </p>
              </div>
            )}

            {/* Status Box */}
            {selectedDayData.validAreaFraction > 0.8 &&
              selectedDayData.thermalActivityCount === 0 && (
                <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>✓ Valid Non-Detection</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 mt-1 leading-normal">
                    Both sensors had clear-sky coverage. Genuinely no active fire detected.
                  </p>
                </div>
              )}

            {selectedDayData.cloudObscuredFraction > 0.5 &&
              selectedDayData.thermalActivityCount === 0 && (
                <div className="p-3.5 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-200">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>⚠ Cloud-Obscured</span>
                  </div>
                  <p className="text-xs text-amber-200/90 mt-1 leading-normal">
                    More than 50% of the area was cloud-covered. Zero detections ≠ zero fire.
                  </p>
                </div>
              )}

            {selectedDayData.thermalActivityCount > 0 && (
              <div className="p-3.5 rounded-xl border border-amber-500/50 bg-amber-500/15 text-amber-100">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Flame className="w-4 h-4 flex-shrink-0" />
                  <span>🔥 Active Fire Detected</span>
                </div>
                <p className="text-xs text-amber-200/90 mt-1 leading-normal">
                  {selectedDayData.thermalActivityCount} thermal anomal
                  {selectedDayData.thermalActivityCount > 1 ? 'ies' : 'y'} detected across satellite
                  granules.
                </p>
              </div>
            )}

            {selectedDayData.thermalActivityCount === 0 &&
              selectedDayData.validAreaFraction <= 0.8 &&
              selectedDayData.cloudObscuredFraction <= 0.5 && (
                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-sm">
                    <span>ℹ Partial Coverage Non-Detection</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    No active hotspots observed. Partial swath coverage occurred during this window.
                  </p>
                </div>
              )}

            {/* Hotspot Granules Pill list (if any) */}
            {selectedDayData.hotspots && selectedDayData.hotspots.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Associated Hotspots ({selectedDayData.hotspots.length})
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {selectedDayData.hotspots.map((hs) => (
                    <span
                      key={hs}
                      className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {hs}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
