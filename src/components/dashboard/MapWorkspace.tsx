import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, useMap } from 'react-leaflet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { X, Clock, Layers, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import hotspots from '../../mocks/hotspots';
import { Badge } from '../ui/Badge';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import type { HOTSpot } from '../../types';

// ===================================================================
// Case study configuration & bounds
// ===================================================================
interface CaseConfig {
  id: string;
  bannerText: string;
  bounds: [[number, number], [number, number]]; // [southWest, northEast]
  center: [number, number];
  zoom: number;
}

const CASE_CONFIGS: Record<string, CaseConfig> = {
  cs1: {
    id: 'cs1',
    bannerText: 'Viewing Case 1: Agricultural Burns, Punjab, India',
    bounds: [
      [30.2, 74.5],
      [31.0, 75.5],
    ],
    center: [30.62, 75.0],
    zoom: 11,
  },
  cs2: {
    id: 'cs2',
    bannerText: 'Viewing Case 2: Forest Fire & Cloud Obstruction, Mato Grosso, Brazil',
    bounds: [
      [-13.0, -55.0],
      [-11.8, -53.5],
    ],
    center: [-12.25, -54.31],
    zoom: 11,
  },
  cs3: {
    id: 'cs3',
    bannerText: 'Viewing Case 3: Prescribed Burn & Sub-Threshold Detection, California, USA',
    bounds: [
      [36.8, -120.5],
      [37.6, -119.2],
    ],
    center: [37.13, -119.84],
    zoom: 12,
  },
};

// ===================================================================
// Hardcoded candidate match lines for Case 1 (Punjab)
// ===================================================================
interface CandidateEdge {
  key: string;
  from: [number, number]; // MODIS centroid [lat, lon]
  to: [number, number];   // VIIRS centroid [lat, lon]
  modisId: string;
  viirsId: string;
}

const CANDIDATE_EDGES: CandidateEdge[] = [
  // M1-CS1-01 [30.612, 74.981] connections
  { key: 'M1-V1', modisId: 'M1-CS1-01', viirsId: 'V1-CS1-01', from: [30.612, 74.981], to: [30.608, 74.976] },
  { key: 'M1-V2', modisId: 'M1-CS1-01', viirsId: 'V2-CS1-02', from: [30.612, 74.981], to: [30.613, 74.983] },
  { key: 'M1-V3', modisId: 'M1-CS1-01', viirsId: 'V3-CS1-03', from: [30.612, 74.981], to: [30.619, 74.979] },
  // M2-CS1-02 [30.638, 75.023] connections
  { key: 'M2-V4', modisId: 'M2-CS1-02', viirsId: 'V4-CS1-04', from: [30.638, 75.023], to: [30.631, 75.018] },
  { key: 'M2-V5', modisId: 'M2-CS1-02', viirsId: 'V5-CS1-05', from: [30.638, 75.023], to: [30.636, 75.025] },
  { key: 'M2-V6', modisId: 'M2-CS1-02', viirsId: 'V6-CS1-06', from: [30.638, 75.023], to: [30.641, 75.021] },
  { key: 'M2-V7', modisId: 'M2-CS1-02', viirsId: 'V7-CS1-07', from: [30.638, 75.023], to: [30.615, 74.988] },
];

// CS1 match metrics per pair for drawer display
interface MatchDetail {
  viirsId: string;
  modisId: string;
  deltaTMinutes: number;
  centroidDistKm: number;
  iou: number;
  os: number;
}

type SelectedMatchDetails =
  | { type: 'modis_parent'; matches: MatchDetail[] }
  | { type: 'viirs_child'; parentModisId: string; match: MatchDetail };

const CS1_MATCH_DETAILS: Record<string, MatchDetail[]> = {
  'M1-CS1-01': [
    { viirsId: 'V1-CS1-01', modisId: 'M1-CS1-01', deltaTMinutes: 102, centroidDistKm: 0.62, iou: 0.42, os: 0.64 },
    { viirsId: 'V2-CS1-02', modisId: 'M1-CS1-01', deltaTMinutes: 102, centroidDistKm: 0.41, iou: 0.68, os: 0.82 },
    { viirsId: 'V3-CS1-03', modisId: 'M1-CS1-01', deltaTMinutes: 102, centroidDistKm: 0.88, iou: 0.35, os: 0.51 },
  ],
  'M2-CS1-02': [
    { viirsId: 'V4-CS1-04', modisId: 'M2-CS1-02', deltaTMinutes: 24, centroidDistKm: 0.84, iou: 0.48, os: 0.62 },
    { viirsId: 'V5-CS1-05', modisId: 'M2-CS1-02', deltaTMinutes: 24, centroidDistKm: 0.47, iou: 0.61, os: 0.77 },
    { viirsId: 'V6-CS1-06', modisId: 'M2-CS1-02', deltaTMinutes: 24, centroidDistKm: 0.58, iou: 0.52, os: 0.69 },
    { viirsId: 'V7-CS1-07', modisId: 'M2-CS1-02', deltaTMinutes: 61, centroidDistKm: 1.14, iou: 0.31, os: 0.45 },
  ],
};

// ===================================================================
// Satellite Overpass schedule data for UTC Timeline Scrubber
// ===================================================================
interface OverpassSchedule {
  id: string;
  satellite: string;
  sensor: 'MODIS' | 'VIIRS';
  timeLabel: string;
  minutes: number; // 0 to 1440
  color: string;
}

const OVERPASS_SCHEDULE: OverpassSchedule[] = [
  { id: 'noaa21-night', satellite: 'NOAA-21 VIIRS', sensor: 'VIIRS', timeLabel: '00:30 UTC', minutes: 30, color: '#22D3EE' },
  { id: 'noaa20-night', satellite: 'NOAA-20 VIIRS', sensor: 'VIIRS', timeLabel: '01:00 UTC', minutes: 60, color: '#22D3EE' },
  { id: 'snpp-night',   satellite: 'S-NPP VIIRS',   sensor: 'VIIRS', timeLabel: '01:30 UTC', minutes: 90, color: '#22D3EE' },
  { id: 'terra-modis',  satellite: 'Terra MODIS',   sensor: 'MODIS', timeLabel: '10:30 UTC', minutes: 630, color: '#F59E0B' },
  { id: 'noaa21-day',   satellite: 'NOAA-21 VIIRS', sensor: 'VIIRS', timeLabel: '12:30 UTC', minutes: 750, color: '#22D3EE' },
  { id: 'noaa20-day',   satellite: 'NOAA-20 VIIRS', sensor: 'VIIRS', timeLabel: '13:00 UTC', minutes: 780, color: '#22D3EE' },
  { id: 'aqua-modis',   satellite: 'Aqua MODIS',    sensor: 'MODIS', timeLabel: '13:30 UTC', minutes: 810, color: '#F59E0B' },
  { id: 'snpp-day',     satellite: 'S-NPP VIIRS',   sensor: 'VIIRS', timeLabel: '13:30 UTC', minutes: 810, color: '#22D3EE' },
];

// Helper: parse HHMM to minutes
function parseHHMM(timeStr: string): number {
  if (!timeStr || timeStr.length < 4) return 0;
  const h = parseInt(timeStr.slice(0, 2), 10) || 0;
  const m = parseInt(timeStr.slice(2, 4), 10) || 0;
  return h * 60 + m;
}

// Helper: compute deltaT between two HHMM timestamps
function computeDeltaT(timeA: string, timeB: string): number {
  const minA = parseHHMM(timeA);
  const minB = parseHHMM(timeB);
  return Math.abs(minB - minA);
}

// ===================================================================
// MapFitter Component: auto-fits map to case study bounds
// ===================================================================
interface MapFitterProps {
  bounds: [[number, number], [number, number]] | null;
}

function MapFitter({ bounds }: MapFitterProps) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 12,
        animate: true,
      });
    } else {
      map.setView([20, 0], 2, { animate: true });
    }
  }, [map, bounds]);

  return null;
}

// ===================================================================
// Main MapWorkspace Component
// ===================================================================
export function MapWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active case study param from URL: ?case=cs1|cs2|cs3
  const rawCase = searchParams.get('case')?.toLowerCase();
  const currentCase = rawCase && CASE_CONFIGS[rawCase] ? CASE_CONFIGS[rawCase] : null;

  // Layer toggles
  const [showModis, setShowModis] = useState<boolean>(true);
  const [showViirs, setShowViirs] = useState<boolean>(true);
  const [showCandidateEdges, setShowCandidateEdges] = useState<boolean>(true);
  const [showOpportunityGrid, setShowOpportunityGrid] = useState<boolean>(false);

  // Hotspot drawer state
  const [selectedHotspot, setSelectedHotspot] = useState<HOTSpot | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Hovered overpass state for timeline scrubber
  const [hoveredOverpass, setHoveredOverpass] = useState<OverpassSchedule | null>(null);

  // Clear case study filter and return to global view
  const handleClearCase = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('case');
    setSearchParams(nextParams);
    navigate('/dashboard');
  };

  // Filter hotspots based on case study and layer toggles
  const visibleHotspots = useMemo(() => {
    return hotspots.filter((h) => {
      // If a case study is active, filter to that case study's hotspots
      if (currentCase) {
        if (!h.id.toLowerCase().includes(currentCase.id)) {
          return false;
        }
      }

      const isModis = h.sensor.includes('MODIS');
      const isViirs = h.sensor.includes('VIIRS');

      if (isModis && !showModis) return false;
      if (isViirs && !showViirs) return false;

      return true;
    });
  }, [currentCase, showModis, showViirs]);

  // Opportunity Grid cells (generated around case regions or default)
  const opportunityGridCells = useMemo(() => {
    if (!showOpportunityGrid) return [];

    // Region 1: Punjab grid cells
    const punjabCells = [
      {
        id: 'grid-cs1-01',
        bounds: [[30.55, 74.92], [30.68, 75.08]] as [[number, number], [number, number]],
        status: 'valid_clear_sky',
        label: 'Punjab Sector 01 (Clear-Sky Opp = 1.0)',
      },
      {
        id: 'grid-cs1-02',
        bounds: [[30.40, 74.75], [30.55, 74.92]] as [[number, number], [number, number]],
        status: 'valid_clear_sky',
        label: 'Punjab Sector 02 (Clear-Sky Opp = 1.0)',
      },
    ];

    // Region 2: Brazil cells with cloud mask
    const brazilCells = [
      {
        id: 'grid-cs2-01',
        bounds: [[-12.35, -54.40], [-12.20, -54.25]] as [[number, number], [number, number]],
        status: 'cloud_obscured',
        label: 'Mato Grosso MODIS Swath (Cloud Frac = 0.94)',
      },
      {
        id: 'grid-cs2-02',
        bounds: [[-12.20, -54.40], [-12.05, -54.25]] as [[number, number], [number, number]],
        status: 'valid_clear_sky',
        label: 'VIIRS Overpass Window (Partial Clearance Opp = 0.42)',
      },
    ];

    // Region 3: California chaparral
    const califCells = [
      {
        id: 'grid-cs3-01',
        bounds: [[37.05, -119.92], [37.20, -119.78]] as [[number, number], [number, number]],
        status: 'valid_clear_sky',
        label: 'Chaparral Prescribed Zone (Clear-Sky Opp = 1.0)',
      },
    ];

    if (currentCase?.id === 'cs1') return punjabCells;
    if (currentCase?.id === 'cs2') return brazilCells;
    if (currentCase?.id === 'cs3') return califCells;
    return [...punjabCells, ...brazilCells, ...califCells];
  }, [showOpportunityGrid, currentCase]);

  // Candidate edges visible logic
  const isEdgesVisible = showCandidateEdges && (!currentCase || currentCase.id === 'cs1');

  // Match details for the selected hotspot in Drawer
  const selectedMatchDetails = useMemo<SelectedMatchDetails | null>(() => {
    if (!selectedHotspot) return null;

    // Direct match if selected is M1 or M2
    if (CS1_MATCH_DETAILS[selectedHotspot.id]) {
      return {
        type: 'modis_parent',
        matches: CS1_MATCH_DETAILS[selectedHotspot.id],
      };
    }

    // Check if selected is one of the VIIRS matches
    for (const [modisId, matches] of Object.entries(CS1_MATCH_DETAILS)) {
      const found = matches.find((m) => m.viirsId === selectedHotspot.id);
      if (found) {
        return {
          type: 'viirs_child',
          parentModisId: modisId,
          match: found,
        };
      }
    }

    return null;
  }, [selectedHotspot]);

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col bg-canvas select-none overflow-hidden font-sans">
      {/* ===================================================================
          1. Layer Pill Bar (Floating, Top Center)
          =================================================================== */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border-soft shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-1.5 pr-2 mr-1 border-r border-border-soft text-xs text-slate-600/70 font-semibold uppercase tracking-wider">
          <Layers size={13} className="text-candidate-violet" />
          <span>Layers</span>
        </div>

        {/* MODIS Toggle */}
        <button
          type="button"
          onClick={() => setShowModis(!showModis)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showModis
              ? 'bg-[#F59E0B] text-slate-950 shadow-md font-bold'
              : 'bg-transparent text-slate-400 border border-slate-600/70 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] border border-black/30" />
          MODIS
        </button>

        {/* VIIRS Toggle */}
        <button
          type="button"
          onClick={() => setShowViirs(!showViirs)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showViirs
              ? 'bg-[#22D3EE] text-slate-950 shadow-md font-bold'
              : 'bg-transparent text-slate-400 border border-slate-600/70 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#22D3EE] border border-black/30" />
          VIIRS
        </button>

        {/* Candidate Edges Toggle */}
        <button
          type="button"
          onClick={() => setShowCandidateEdges(!showCandidateEdges)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showCandidateEdges
              ? 'bg-[#A78BFA] text-slate-950 shadow-md font-bold'
              : 'bg-transparent text-slate-400 border border-slate-600/70 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#A78BFA] border border-black/30" />
          Candidate Edges
        </button>

        {/* Opportunity Grid Toggle */}
        <button
          type="button"
          onClick={() => setShowOpportunityGrid(!showOpportunityGrid)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showOpportunityGrid
              ? 'bg-[#34D399] text-slate-950 shadow-md font-bold'
              : 'bg-transparent text-slate-400 border border-slate-600/70 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#34D399] border border-black/30" />
          Opportunity Grid
        </button>
      </div>

      {/* ===================================================================
          2. Case Study Banner (Floating, below Pill Bar)
          =================================================================== */}
      {currentCase && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[999] flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl bg-white/95 border border-[#F59E0B]/50 shadow-2xl backdrop-blur-md min-w-[380px] max-w-xl pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse ring-4 ring-[#F59E0B]/20" />
            <span className="text-xs sm:text-sm font-semibold text-slate-100">
              {currentCase.bannerText}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearCase}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear case study and return to all regions"
            aria-label="Clear case study"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ===================================================================
          3. Leaflet Map Container
          =================================================================== */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%', background: '#0B0F17' }}
          zoomControl={true}
        >
          {/* Base Dark Tiles from CartoDB */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Auto-fit map to case study bounds */}
          <MapFitter bounds={currentCase ? currentCase.bounds : null} />

          {/* Opportunity Grid Polygons */}
          {showOpportunityGrid &&
            opportunityGridCells.map((cell) => {
              const isCloud = cell.status === 'cloud_obscured';
              return (
                <Polygon
                  key={cell.id}
                  positions={[
                    [cell.bounds[0][0], cell.bounds[0][1]],
                    [cell.bounds[1][0], cell.bounds[0][1]],
                    [cell.bounds[1][0], cell.bounds[1][1]],
                    [cell.bounds[0][0], cell.bounds[1][1]],
                  ]}
                  pathOptions={{
                    color: isCloud ? '#64748B' : '#34D399',
                    fillColor: isCloud ? '#64748B' : '#34D399',
                    fillOpacity: isCloud ? 0.22 : 0.08,
                    weight: 1.5,
                    dashArray: '5 5',
                  }}
                />
              );
            })}

          {/* Hardcoded Candidate Match Lines */}
          {isEdgesVisible &&
            CANDIDATE_EDGES.map((edge) => (
              <Polyline
                key={edge.key}
                positions={[edge.from, edge.to]}
                pathOptions={{
                  color: '#A78BFA',
                  weight: 2,
                  dashArray: '6 4',
                  opacity: 0.85,
                }}
              />
            ))}

          {/* Hotspot Footprint Polygons */}
          {visibleHotspots.map((hotspot) => {
            const rawCoords = (hotspot.footprintGeoJSON as any)?.geometry?.coordinates?.[0] as
              | [number, number][]
              | undefined;

            if (!rawCoords || !Array.isArray(rawCoords)) return null;

            // GeoJSON coordinates are [lon, lat], convert to Leaflet [lat, lon]
            const positions: [number, number][] = rawCoords.map(([lon, lat]: [number, number]) => [
              lat,
              lon,
            ]);

            const isModis = hotspot.sensor.includes('MODIS');
            const isSelected = selectedHotspot?.id === hotspot.id;

            const color = isModis ? '#F59E0B' : '#22D3EE';
            const fillOpacity = isSelected ? 0.7 : isModis ? 0.4 : 0.3;
            const weight = isSelected ? 3 : isModis ? 2 : 1.5;

            return (
              <Polygon
                key={hotspot.id}
                positions={positions}
                pathOptions={{
                  color: isSelected ? '#FFFFFF' : color,
                  fillColor: color,
                  fillOpacity,
                  weight,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedHotspot(hotspot);
                    setDrawerOpen(true);
                  },
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* ===================================================================
          4. UTC Timeline Scrubber (Floating Bottom)
          =================================================================== */}
      <div className="absolute bottom-4 left-4 right-4 z-[990] bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-border-soft shadow-2xl pointer-events-auto flex flex-col gap-2">
        {/* Scrubber Header & Legend */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium">
            <Clock size={14} className="text-[#F59E0B]" />
            <span className="font-semibold text-slate-800">
              24-Hour Satellite Overpass Scrubber (UTC)
            </span>
            <span className="text-slate-400 hidden sm:inline">
              — MODIS & VIIRS Sun-Synchronous Orbits
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-slate-600">MODIS (10:30, 13:30)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
              <span className="text-slate-600">VIIRS (00:30, 01:00, 01:30, 12:30, 13:00, 13:30)</span>
            </div>
          </div>
        </div>

        {/* Timeline Track with Day/Night gradient */}
        <div className="relative w-full h-5 rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 overflow-visible flex items-center px-1">
          {/* Day / Night bands */}
          <div
            className="absolute top-0 bottom-0 bg-amber-500/10 border-x border-amber-500/20"
            style={{ left: `${(6 * 60 / 1440) * 100}%`, width: `${(12 * 60 / 1440) * 100}%` }}
            title="Solar Daylight Window (06:00 - 18:00 UTC)"
          />

          {/* Major Hour Markers (00, 06, 12, 18, 24) */}
          {[0, 6, 12, 18, 24].map((hour) => (
            <div
              key={hour}
              className="absolute top-0 bottom-0 flex flex-col items-center justify-between pointer-events-none"
              style={{ left: `${(hour / 24) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-[1px] h-full bg-slate-600/50" />
            </div>
          ))}

          {/* Overpass Pins along the track */}
          {OVERPASS_SCHEDULE.map((op) => {
            const percent = (op.minutes / 1440) * 100;
            const isHovered = hoveredOverpass?.id === op.id;

            return (
              <div
                key={op.id}
                onMouseEnter={() => setHoveredOverpass(op)}
                onMouseLeave={() => setHoveredOverpass(null)}
                className="absolute top-0 bottom-0 flex items-center justify-center cursor-pointer group z-20"
                style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
              >
                {/* Vertical tick */}
                <div
                  className="w-[2px] h-full transition-all group-hover:scale-y-125"
                  style={{ backgroundColor: op.color }}
                />

                {/* Circular indicator */}
                <div
                  className="absolute w-3 h-3 rounded-full border-2 border-[#192234] shadow-md transition-transform group-hover:scale-125"
                  style={{ backgroundColor: op.color }}
                />

                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-7 px-2.5 py-1 rounded-md bg-[#0F172A] border border-slate-700 text-[11px] text-white shadow-xl whitespace-nowrap z-50 flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: op.color }}
                    />
                    <span className="font-semibold">{op.satellite}</span>
                    <span className="text-slate-400">({op.timeLabel})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Time labels */}
        <div className="relative w-full flex justify-between text-[10px] font-mono text-slate-400 px-1 pt-0.5">
          <span>00:00 (Night)</span>
          <span>06:00 (Dawn)</span>
          <span>12:00 (Solar Noon)</span>
          <span>18:00 (Dusk)</span>
          <span>24:00 (Night)</span>
        </div>
      </div>

      {/* ===================================================================
          5. Evidence Drawer (Right Slide-over)
          =================================================================== */}
      <Drawer
        isOpen={drawerOpen && !!selectedHotspot}
        onClose={() => setDrawerOpen(false)}
        title="Hotspot Pixel Evidence & Cross-Sensor Match"
        width="440px"
      >
        {selectedHotspot && (
          <div className="flex flex-col gap-5 text-sm text-slate-600 pb-6">
            {/* Header / Primary Identifiers */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={selectedHotspot.sensor.includes('MODIS') ? 'modis' : 'viirs'}
                  label={selectedHotspot.sensor.replace('_', ' ')}
                />
                <Badge
                  variant={selectedHotspot.processing === 'Standard' ? 'standard' : 'nrt'}
                  label={selectedHotspot.processing}
                />
                <Badge variant="standard" label={`Col ${selectedHotspot.collection}`} />
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Granule ID
                </div>
                <div className="font-mono text-xs text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 break-all select-text">
                  {selectedHotspot.granuleId}
                </div>
              </div>
            </div>

            {/* Core Thermal & Detection Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">
                  Brightness Temp (BT)
                </span>
                <span className="text-xl font-bold font-mono text-slate-800">
                  {selectedHotspot.brightness}{' '}
                  <span className="text-xs font-normal text-slate-400">K</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">
                  Raw Fire Radiative Power
                </span>
                <span className="text-xl font-bold font-mono text-modis-amber">
                  {selectedHotspot.frp}{' '}
                  <span className="text-xs font-normal text-slate-400">MW</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">
                  Confidence Score
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {typeof selectedHotspot.confidence === 'number'
                    ? `${selectedHotspot.confidence}%`
                    : selectedHotspot.confidence.toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">
                  Overpass Timing
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {selectedHotspot.acqDate} •{' '}
                  <span className="font-mono">
                    {selectedHotspot.acqTime.slice(0, 2)}:{selectedHotspot.acqTime.slice(2, 4)} UTC
                  </span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedHotspot.dayNight === 'D' ? '☀️ Daytime Pass' : '🌙 Nighttime Pass'}
                </span>
              </div>
            </div>

            {/* Opportunity State */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-valid-green flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-valid-green">
                    Opportunity State: Valid Clear-Sky
                  </span>
                  <Badge variant="valid" label="✓ Valid Clear-Sky" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Both surface emissivity and cloud mask confirm cloud-free ground line-of-sight. Fire detection is physically observable and eligible for cross-sensor pairing.
                </p>
              </div>
            </div>

            {/* Many-to-Many Bipartite Subgraph Section */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu size={15} className="text-candidate-violet" />
                  <span className="font-semibold text-slate-800 text-xs tracking-wide uppercase">
                    Many-to-Many Bipartite Subgraph
                  </span>
                </div>
                <Badge variant="candidate" label="Spatial-Temporal Overlap" />
              </div>

              {selectedMatchDetails?.type === 'modis_parent' && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-600">
                    MODIS 1-km pixel <span className="font-mono font-semibold text-modis-amber">{selectedHotspot.id}</span> associates with{' '}
                    <span className="font-bold text-slate-800">{selectedMatchDetails.matches.length} VIIRS 375-m pixels</span>:
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {selectedMatchDetails.matches.map((m) => {
                      const dynamicDeltaT = computeDeltaT(selectedHotspot.acqTime, '0712');
                      const displayDeltaT = m.deltaTMinutes || dynamicDeltaT;

                      return (
                        <div
                          key={m.viirsId}
                          className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-viirs-cyan">
                              {m.viirsId}
                            </span>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">Δt:</span>
                              <span className="font-mono text-slate-200">{displayDeltaT} min</span>
                              <span className="text-slate-600">|</span>
                              <span className="text-slate-400">Dist:</span>
                              <span className="font-mono text-slate-200">{m.centroidDistKm} km</span>
                            </div>
                          </div>

                          {/* Progress bars for IoU and Os */}
                          <div className="flex flex-col gap-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-600 font-mono">IoU (Intersection-over-Union):</span>
                              <span className="font-mono font-bold text-purple-700">
                                {(m.iou * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${m.iou * 100}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className="text-slate-600 font-mono">Os (Smaller Footprint Overlap):</span>
                              <span className="font-mono font-bold text-emerald-700">
                                {(m.os * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 rounded-full"
                                style={{ width: `${m.os * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedMatchDetails?.type === 'viirs_child' && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-600">
                    VIIRS 375-m pixel is nested within MODIS 1-km parent cluster:
                  </p>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700">
                        Parent: {selectedMatchDetails.parentModisId}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-medium">Δt:</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {selectedMatchDetails.match.deltaTMinutes} min
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 font-medium">Dist:</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {selectedMatchDetails.match.centroidDistKm} km
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-mono">IoU:</span>
                        <span className="font-mono font-bold text-purple-700">
                          {(selectedMatchDetails.match.iou * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${selectedMatchDetails.match.iou * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-600 font-mono">Os (Containment):</span>
                        <span className="font-mono font-bold text-emerald-700">
                          {(selectedMatchDetails.match.os * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${selectedMatchDetails.match.os * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!selectedMatchDetails && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  {selectedHotspot.sensor.includes('MODIS')
                    ? 'No coincident VIIRS detections occurred within the ±3 hour spatial-temporal window.'
                    : 'Isolated VIIRS detection during overpass; no coincident daytime MODIS pixel exceeded the local sensor detection threshold.'}
                </div>
              )}
            </div>

            {/* Harmonization Diagnostics & QA Verification */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Harmonization Diagnostics &amp; QA Verification
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-600 font-bold font-sans">
                  Overlap Metric Formulation:
                </span>
                <div className="p-3 rounded-lg bg-white border border-slate-200 font-serif text-xs text-slate-800 flex items-center gap-2 shadow-sm">
                  <span className="font-bold italic text-purple-700 text-sm">O<sub>s</sub></span>
                  <span className="text-slate-400">=</span>
                  <div className="inline-flex flex-col items-center text-center font-sans">
                    <span className="border-b border-slate-700 px-2 font-semibold text-blue-800">Area(A ∩ B)</span>
                    <span className="font-semibold text-cyan-800">min( Area(A), Area(B) )</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Normalizing by min(Area(A), Area(B)) rather than union prevents artificial penalty from the 7× areal disparity between MODIS (1 km²) and VIIRS (0.14 km²) footprint geometries.
                </p>
              </div>

              <div className="flex flex-col gap-1 border-t border-indigo-200/60 pt-2.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-600 font-bold font-mono">
                  QA Status Flag Verification:
                </span>
                <div className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                  QA: PASS [0x00000000] — Scan angle: 14.2° (nominal, no bow-tie distortion), cloud fraction &lt; 0.05, water mask: land.
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="w-full text-xs"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default MapWorkspace;
