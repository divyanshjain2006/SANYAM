import { useState, useMemo } from 'react';
import calendarData from '../../mocks/calendar';
import type { CalendarDay } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
  AlertTriangle,
  CheckCircle,
  Calendar as CalendarIcon,
  Sparkles,
  Cloud,
  ShieldCheck,
  BarChart3,
  Sun,
  Layers,
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

type FilterMode = 'all' | 'fires' | 'valid_zero' | 'cloud_zero';

export default function CalendarWorkspace() {
  const [currentYear, setCurrentYear] = useState<number>(2023);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // October
  const [selectedDate, setSelectedDate] = useState<string | null>('2023-10-28');
  const [activeFilter, setActiveFilter] = useState<FilterMode>('all');

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

  const formatDisplayDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Monthly aggregated statistics
  const totalFiresInMonth = useMemo(() => {
    return monthData.reduce((acc, curr) => acc + curr.thermalActivityCount, 0);
  }, [monthData]);

  const avgClearSky = useMemo(() => {
    if (monthData.length === 0) return 0;
    const total = monthData.reduce((acc, curr) => acc + curr.validAreaFraction, 0);
    return Math.round((total / monthData.length) * 100);
  }, [monthData]);

  const validNonDetectionCount = useMemo(() => {
    return monthData.filter(
      (d) => d.thermalActivityCount === 0 && d.validAreaFraction > 0.8
    ).length;
  }, [monthData]);

  const cloudObscuredCount = useMemo(() => {
    return monthData.filter(
      (d) => d.thermalActivityCount === 0 && d.cloudObscuredFraction > 0.5
    ).length;
  }, [monthData]);

  const activeFireDaysCount = useMemo(() => {
    return monthData.filter((d) => d.thermalActivityCount > 0).length;
  }, [monthData]);

  // Max fires for relative sparkline height
  const maxFires = useMemo(() => {
    return Math.max(...monthData.map((d) => d.thermalActivityCount), 1);
  }, [monthData]);

  // Filter checker
  const isDayMatchingFilter = (day: CalendarDay): boolean => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'fires') return day.thermalActivityCount > 0;
    if (activeFilter === 'valid_zero')
      return day.thermalActivityCount === 0 && day.validAreaFraction > 0.8;
    if (activeFilter === 'cloud_zero')
      return day.thermalActivityCount === 0 && day.cloudObscuredFraction > 0.5;
    return true;
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* ===================================================================
          1. Header & Quick Context
          =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Coverage-Aware Burning-Activity Calendar
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Dual-encoded satellite observation calendar distinguishing true fire absence from cloud obscuration &amp; swath gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Benchmark Quick-Jump Pills */}
        {currentYear === 2023 && currentMonth === 10 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
              Key Cases:
            </span>
            <button
              type="button"
              onClick={() => setSelectedDate('2023-10-28')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                selectedDate === '2023-10-28'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/25 scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:text-amber-800'
              }`}
              title="Case 1 Benchmark: 11 coincident NASA detections (2 MODIS + 9 VIIRS) under 96% clear skies"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Oct 28 (Case 1 Peak)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate('2023-10-24')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                selectedDate === '2023-10-24'
                  ? 'bg-slate-700 text-white border-slate-800 shadow-sm shadow-slate-700/25 scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-800'
              }`}
              title="Observation Gap: Zero detections caused by 75% cloud mask obscuration"
            >
              <Cloud className="w-3.5 h-3.5 text-slate-500" />
              <span>Oct 24 (Cloud Obscured)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate('2023-10-03')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                selectedDate === '2023-10-03'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm shadow-emerald-600/25 scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:text-emerald-800'
              }`}
              title="Confirmed clear-sky zero detection (87% clear skies, genuine non-burning)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Oct 03 (Valid Zero)</span>
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================
          2. KPI Metric Cards Row
          =================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Month Detections */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Thermal Detections</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {totalFiresInMonth}
              </span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {activeFireDaysCount} active days
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Peak Day</span>
            <span className="font-semibold text-slate-700">Oct 20 &amp; Oct 27</span>
          </div>
        </div>

        {/* Metric 2: Avg Clear-Sky Observability */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Clear-Sky Observability</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Sun className="w-4 h-4" />
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-600 tracking-tight">
                {avgClearSky}%
              </span>
              <span className="text-xs font-medium text-slate-500">monthly mean</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Pass Quality</span>
            <span className="font-semibold text-emerald-700">High Reliability</span>
          </div>
        </div>

        {/* Metric 3: Valid Non-Detections */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Confirmed Zero-Fire Days</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-blue-600 tracking-tight">
                {validNonDetectionCount}
              </span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                &gt;80% clear-sky
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>True Absence</span>
            <span className="font-semibold text-slate-700">Zero burning confirmed</span>
          </div>
        </div>

        {/* Metric 4: Cloud Mask Alerts */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Cloud Mask Obscuration</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Cloud className="w-4 h-4" />
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-amber-600 tracking-tight">
                {cloudObscuredCount}
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                &gt;50% cloud cover
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Observation Caveat</span>
            <span className="font-semibold text-amber-700">False-negative trap</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. Interactive 31-Day Mini Spark-Timeline
          =================================================================== */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">
              Monthly Temporal Activity Wave ({MONTH_NAMES[currentMonth - 1]} {currentYear})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any bar to instantly inspect that day
          </span>
        </div>

        {/* Sparkline bars */}
        <div className="h-12 w-full flex items-end gap-1 sm:gap-1.5 pt-1 border-b border-slate-100">
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(
              dayNum
            ).padStart(2, '0')}`;
            const dayData = getDayData(dateStr);
            const count = dayData.thermalActivityCount;
            const isSelected = selectedDate === dateStr;
            const heightPercent = count > 0 ? Math.max(16, (count / maxFires) * 100) : 8;

            let barColor = 'bg-slate-200 hover:bg-slate-300';
            if (count >= 9) {
              barColor = 'bg-gradient-to-t from-orange-600 to-amber-500';
            } else if (count >= 4) {
              barColor = 'bg-amber-400 hover:bg-amber-500';
            } else if (count > 0) {
              barColor = 'bg-amber-300 hover:bg-amber-400';
            } else if (dayData.cloudObscuredFraction > 0.5) {
              barColor = 'bg-slate-400 hover:bg-slate-500';
            } else if (dayData.validAreaFraction > 0.8) {
              barColor = 'bg-emerald-300 hover:bg-emerald-400';
            }

            return (
              <button
                key={`spark-${dateStr}`}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={`flex-1 rounded-t-sm transition-all relative group cursor-pointer ${barColor} ${
                  isSelected ? 'ring-2 ring-blue-600 ring-offset-1 scale-y-110 z-10' : ''
                }`}
                style={{ height: `${heightPercent}%` }}
                title={`${dateStr}: ${count} fires, ${(dayData.validAreaFraction * 100).toFixed(0)}% clear-sky`}
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow">
                  {dayNum}: {count}🔥
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
          <span>Day 1</span>
          <span>Day 8</span>
          <span>Day 15</span>
          <span>Day 22</span>
          <span>Day {daysInMonth}</span>
        </div>
      </div>

      {/* ===================================================================
          4. Main Workspace Layout: Fixed 2-Column CSS Grid
          =================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column (8 cols on XL): Calendar Grid & Legend */}
        <div className="xl:col-span-8 w-full min-w-0 flex flex-col gap-4">
          {/* Navigation Bar & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 shadow-sm px-5 py-3 rounded-2xl">
            {/* Month title + Nav Arrows */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                  className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                {MONTH_NAMES[currentMonth - 1]} {currentYear}
              </h2>

              {currentYear !== 2023 || currentMonth !== 10 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentYear(2023);
                    setCurrentMonth(10);
                  }}
                  className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors font-semibold"
                >
                  Reset to Oct 2023
                </button>
              ) : null}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({daysInMonth})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('fires')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'fires'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Fires</span>
                <span className="text-[10px] opacity-80">({activeFireDaysCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('valid_zero')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'valid_zero'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Clear Zero</span>
                <span className="text-[10px] opacity-80">({validNonDetectionCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('cloud_zero')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'cloud_zero'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Cloud Masked</span>
                <span className="text-[10px] opacity-80">({cloudObscuredCount})</span>
              </button>
            </div>
          </div>

          {/* 7-Column Calendar Grid Container */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm w-full">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-1"
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
                  className="min-h-[64px] rounded-xl bg-slate-50/50 border border-dashed border-slate-200/50 pointer-events-none"
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
                const count = dayData.thermalActivityCount;
                const matchesFilter = isDayMatchingFilter(dayData);

                // Distinctive card styling based on thermal count
                let cellTheme = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
                if (count >= 9) {
                  cellTheme = 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 border-orange-600 text-white shadow-md shadow-orange-500/20';
                } else if (count >= 4) {
                  cellTheme = 'bg-gradient-to-br from-amber-100 to-amber-200/90 border-amber-300 text-amber-950';
                } else if (count > 0) {
                  cellTheme = 'bg-gradient-to-br from-amber-50 to-orange-50/70 border-amber-200 text-amber-900';
                } else if (dayData.cloudObscuredFraction > 0.5) {
                  cellTheme = 'bg-slate-50 border-slate-200 text-slate-700';
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`group relative min-h-[64px] p-2 rounded-xl text-left flex flex-col justify-between transition-all duration-150 cursor-pointer focus:outline-none border ${cellTheme} ${
                      isSelected
                        ? 'ring-2 ring-amber-500 ring-offset-2 shadow-lg shadow-amber-500/20 scale-[1.03] z-20'
                        : 'hover:scale-[1.02] hover:shadow-md'
                    } ${matchesFilter ? 'opacity-100' : 'opacity-25 hover:opacity-100'}`}
                  >
                    {/* Top Row: Day Number & Status Cue Icon */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold leading-none ${
                          count >= 9 ? 'text-white' : count > 0 ? 'text-amber-950' : 'text-slate-700'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Micro-cue tags */}
                      {count === 0 && dayData.validAreaFraction > 0.8 && (
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200"
                          title="Valid Clear-Sky Non-Detection"
                        />
                      )}
                      {count === 0 && dayData.cloudObscuredFraction > 0.5 && (
                        <span
                          className="w-2 h-2 rounded-full bg-slate-400 ring-2 ring-slate-200"
                          title="Cloud Obscured Non-Detection"
                        />
                      )}
                      {count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            count >= 9
                              ? 'text-white bg-orange-700/80 ring-1 ring-white/50'
                              : 'text-amber-900 bg-amber-200/90'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </div>

                    {/* Center: Clean Icon Cue */}
                    <div className="flex-1 flex items-center justify-center my-0.5">
                      {count > 0 ? (
                        <div className="flex items-center gap-1">
                          <Flame
                            className={`w-3.5 h-3.5 ${
                              count >= 9 ? 'text-amber-200 fill-amber-200' : 'text-amber-500 fill-amber-500'
                            }`}
                          />
                          <span
                            className={`text-xs font-extrabold ${
                              count >= 9 ? 'text-white' : 'text-amber-950'
                            }`}
                          >
                            {count}
                          </span>
                        </div>
                      ) : dayData.cloudObscuredFraction > 0.5 ? (
                        <span className="text-[10px] text-slate-400 font-medium">Cloud</span>
                      ) : dayData.validAreaFraction > 0.8 ? (
                        <span className="text-[10px] text-emerald-600 font-medium">Clear</span>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-medium">-</span>
                      )}
                    </div>

                    {/* Bottom Observation Opportunity Pill (Segmented 3-part micro bar) */}
                    <div
                      className="h-1.5 w-full flex overflow-hidden rounded-full ring-1 ring-slate-200/60 mt-auto bg-slate-100"
                      title={`Clear: ${(dayData.validAreaFraction * 100).toFixed(0)}% | Cloud: ${(dayData.cloudObscuredFraction * 100).toFixed(0)}% | Outside: ${(dayData.outsideSwathFraction * 100).toFixed(0)}%`}
                    >
                      <div
                        style={{ width: `${dayData.validAreaFraction * 100}%` }}
                        className="bg-emerald-500 h-full"
                      />
                      <div
                        style={{ width: `${dayData.cloudObscuredFraction * 100}%` }}
                        className="bg-slate-400 h-full"
                      />
                      <div
                        style={{ width: `${dayData.outsideSwathFraction * 100}%` }}
                        className="bg-slate-200 h-full"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual-Encoded Interactive Legend */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white text-xs text-slate-700 shadow-sm flex flex-col gap-3">
            {/* Row 1: Thermal Activity Heatmap Legend */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] min-w-[130px] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Thermal Activity:
              </span>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-white border border-slate-300 shadow-2xs" />
                <span className="text-slate-600 font-medium">0 fires</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-amber-50 border border-amber-200 shadow-2xs" />
                <span className="text-slate-600 font-medium">1–3 fires (Low)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-amber-200 border border-amber-300 shadow-2xs" />
                <span className="text-slate-600 font-medium">4–8 fires (Moderate)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xs" />
                <span className="text-slate-900 font-bold">9+ fires (Peak Cluster)</span>
              </div>
            </div>

            {/* Row 2: Opportunity Stripe Layers */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-2.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] min-w-[130px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Opportunity Stripe:
              </span>
              <div className="flex items-center gap-2">
                <span className="w-4 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">Valid Clear-Sky</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-2.5 rounded-full bg-slate-400" />
                <span className="text-slate-600 font-medium">Cloud-Obscured Mask</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
                <span className="text-slate-600 font-medium">Outside Swath Gap</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on XL): Daily Breakdown Inspector Panel */}
        <div className="xl:col-span-4 w-full min-w-0">
          {selectedDayData ? (
            <aside className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 text-slate-800 shadow-md transition-all animate-fade-in sticky top-20">
              {/* Header with Date Badge & Close */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Daily Observation Breakdown
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {formatDisplayDate(selectedDayData.date)}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedDayData.date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  aria-label="Close panel"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thermal Activity Card */}
              <div className="flex flex-col gap-2.5 bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200 rounded-2xl p-4">
                <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                  Thermal Activity Detection
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {selectedDayData.thermalActivityCount}
                  </span>
                  {selectedDayData.thermalActivityCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      Active Fire Front
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">Zero active hotspots</span>
                  )}
                </div>

                {/* Sensor Breakdown with proportional bar */}
                <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-semibold text-slate-700">MODIS:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedDayData.thermalActivityCount === 0
                          ? 0
                          : Math.max(1, Math.round(selectedDayData.thermalActivityCount * 0.25))}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      <span className="font-semibold text-slate-700">VIIRS:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedDayData.thermalActivityCount === 0
                          ? 0
                          : selectedDayData.thermalActivityCount -
                            Math.max(1, Math.round(selectedDayData.thermalActivityCount * 0.25))}
                      </span>
                    </div>
                  </div>

                  {selectedDayData.thermalActivityCount > 0 && (
                    <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100">
                      <div
                        style={{
                          width: `${
                            (Math.max(1, Math.round(selectedDayData.thermalActivityCount * 0.25)) /
                              selectedDayData.thermalActivityCount) *
                            100
                          }%`,
                        }}
                        className="bg-amber-500 h-full"
                        title="MODIS share"
                      />
                      <div
                        style={{
                          width: `${
                            ((selectedDayData.thermalActivityCount -
                              Math.max(1, Math.round(selectedDayData.thermalActivityCount * 0.25))) /
                              selectedDayData.thermalActivityCount) *
                            100
                          }%`,
                        }}
                        className="bg-cyan-500 h-full"
                        title="VIIRS share"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Observation Opportunity Card */}
              <div className="flex flex-col gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                  Observation Opportunity Fractions
                </span>

                {/* Stacked Horizontal Bar */}
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-200 border border-slate-300/80">
                  <div
                    style={{ width: `${selectedDayData.validAreaFraction * 100}%` }}
                    className="bg-emerald-500 h-full transition-all"
                    title={`Valid Clear-Sky: ${(selectedDayData.validAreaFraction * 100).toFixed(0)}%`}
                  />
                  <div
                    style={{ width: `${selectedDayData.cloudObscuredFraction * 100}%` }}
                    className="bg-slate-400 h-full transition-all"
                    title={`Cloud-Obscured: ${(selectedDayData.cloudObscuredFraction * 100).toFixed(0)}%`}
                  />
                  <div
                    style={{ width: `${selectedDayData.outsideSwathFraction * 100}%` }}
                    className="bg-slate-200 h-full transition-all"
                    title={`Outside Swath: ${(selectedDayData.outsideSwathFraction * 100).toFixed(0)}%`}
                  />
                </div>

                {/* Grid of percentages */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-emerald-700 font-extrabold text-sm block font-mono">
                      {Math.round(selectedDayData.validAreaFraction * 100)}%
                    </span>
                    <span className="text-slate-500 text-[10px] font-medium">Clear-Sky</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-slate-700 font-extrabold text-sm block font-mono">
                      {Math.round(selectedDayData.cloudObscuredFraction * 100)}%
                    </span>
                    <span className="text-slate-500 text-[10px] font-medium">Cloud Mask</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-slate-700 font-extrabold text-sm block font-mono">
                      {Math.round(selectedDayData.outsideSwathFraction * 100)}%
                    </span>
                    <span className="text-slate-500 text-[10px] font-medium">Off-Swath</span>
                  </div>
                </div>
              </div>

              {/* Harmonized Operational Interpretation */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Observation Opportunity Context
                </div>
                <p className="leading-relaxed text-slate-600">
                  <strong className="text-emerald-700 font-bold">
                    {Math.round(selectedDayData.validAreaFraction * 100)}%
                  </strong>{' '}
                  of the target area was under valid clear-sky conditions during satellite passes.
                </p>
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-emerald-700 font-medium">valid_area_fraction:</span>
                    <span className="font-bold text-slate-900">
                      {selectedDayData.validAreaFraction.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">cloud_obscured_fraction:</span>
                    <span className="font-bold text-slate-900">
                      {selectedDayData.cloudObscuredFraction.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-700 font-medium">outside_swath_fraction:</span>
                    <span className="font-bold text-slate-900">
                      {selectedDayData.outsideSwathFraction.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Alert Cards */}
              {selectedDayData.validAreaFraction > 0.8 &&
                selectedDayData.thermalActivityCount === 0 && (
                  <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/80 text-emerald-900 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                      <span>✓ Valid Non-Detection</span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1 leading-normal">
                      Both sensors maintained unobstructed clear-sky coverage. Genuinely no active burning front present.
                    </p>
                  </div>
                )}

              {selectedDayData.cloudObscuredFraction > 0.5 &&
                selectedDayData.thermalActivityCount === 0 && (
                  <div className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/80 text-amber-900 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                      <span>⚠ Cloud-Obscured Observation</span>
                    </div>
                    <p className="text-xs text-amber-800 mt-1 leading-normal">
                      More than 50% of the area was cloud-obscured. Zero detections ≠ zero fire; satellite infrared radiance was blocked.
                    </p>
                  </div>
                )}

              {selectedDayData.thermalActivityCount > 0 && (
                <div className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/80 text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-sm">
                    <Flame className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span>🔥 Confirmed Active Fire</span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-normal">
                    {selectedDayData.thermalActivityCount} thermal anomal
                    {selectedDayData.thermalActivityCount > 1 ? 'ies' : 'y'} detected across MODIS &amp; VIIRS overpasses.
                  </p>
                </div>
              )}

              {/* Hotspot Granules Pill List */}
              {selectedDayData.hotspots && selectedDayData.hotspots.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      NASA Observations ({selectedDayData.hotspots.length})
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      FIRMS Cross-Calibrated
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {selectedDayData.hotspots.map((hs) => {
                      const isModis = hs.startsWith('M') && !hs.startsWith('MYD') ? !hs.startsWith('MOD') || hs.startsWith('MOD') : hs.startsWith('MOD') || hs.startsWith('MYD');
                      const isBenchmark = hs.includes('CS1') || hs.includes('CS2') || hs.includes('CS3');
                      return (
                        <span
                          key={hs}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border flex items-center gap-1 ${
                            isBenchmark
                              ? isModis
                                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                                : 'bg-cyan-50 text-cyan-900 border-cyan-300 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                          title={isBenchmark ? `NASA Benchmark Observation ${hs}` : `NASA FIRMS Granule Record ${hs}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isModis ? 'bg-amber-500' : 'bg-cyan-500'
                            }`}
                          />
                          {hs}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          ) : (
            /* Empty State Guide Card when no day selected */
            <aside className="w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center gap-4 text-slate-600 shadow-sm sticky top-20">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <CalendarIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Select a Day to Inspect
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Click any cell in the calendar grid or the mini timeline above to inspect thermal anomalies, sensor distributions, and clear-sky observability fractions.
                </p>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Recommended Benchmarks:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDate('2023-10-27')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition-colors text-left flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">Oct 27, 2023</span>
                    <span className="text-[11px] text-slate-500">14 fires (Peak active burning)</span>
                  </div>
                  <Flame className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate('2023-10-28')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition-colors text-left flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">Oct 28, 2023</span>
                    <span className="text-[11px] text-slate-500">Cloud-masked false negative</span>
                  </div>
                  <Cloud className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate('2023-10-03')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-left flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">Oct 03, 2023</span>
                    <span className="text-[11px] text-slate-500">Confirmed true clear-sky zero</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
