import clsx from 'clsx';

export type SensorVariant =
  | 'modis-terra'
  | 'modis-aqua'
  | 'viirs-snpp'
  | 'viirs-noaa20'
  | 'viirs-noaa21'
  | 'modis'
  | 'viirs';

export interface SensorPillProps {
  sensor: SensorVariant | string;
  size?: 'xs' | 'sm';
  className?: string;
}

export function SensorPill({ sensor, size = 'sm', className }: SensorPillProps) {
  const norm = sensor.toLowerCase().replace(/[\s_-]+/g, '');

  const isTerra = norm.includes('terra') || norm.startsWith('mod14');
  const isAqua = norm.includes('aqua') || norm.startsWith('myd14');
  const isSnpp = norm.includes('snpp') || norm.includes('npp') || norm.startsWith('vnp');
  const isNoaa20 = norm.includes('noaa20') || norm.includes('j01') || norm.startsWith('vj1');
  const isNoaa21 = norm.includes('noaa21') || norm.includes('j02') || norm.startsWith('vj2');
  const isModis = norm.includes('modis') || isTerra || isAqua;

  let label = sensor;
  if (isTerra) label = 'MODIS Terra';
  else if (isAqua) label = 'MODIS Aqua';
  else if (norm === 'modis') label = 'MODIS';
  else if (isSnpp) label = 'VIIRS S-NPP';
  else if (isNoaa20) label = 'VIIRS NOAA-20';
  else if (isNoaa21) label = 'VIIRS NOAA-21';
  else if (norm === 'viirs') label = 'VIIRS';

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium font-mono rounded-full border transition-colors',
        size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
        isModis
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-cyan-50 text-cyan-800 border-cyan-200',
        className
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          isModis ? 'bg-amber-500' : 'bg-cyan-500'
        )}
      />
      {label}
    </span>
  );
}

export default SensorPill;
