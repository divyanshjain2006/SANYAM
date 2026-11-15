import clsx from 'clsx';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  unit?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  className,
  unit = '',
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#94A3B8]">{label}</span>
          <span className="text-sm font-semibold text-[#F8FAFC]">
            {value}
            {unit}
          </span>
        </div>
      )}
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div
          className="w-full h-1.5 rounded-full"
          style={{ background: 'rgba(148,163,184,0.2)' }}
        >
          {/* Fill */}
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: '#F59E0B' }}
          />
        </div>
        {/* Native input (transparent, on top) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 1 }}
        />
        {/* Thumb indicator */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-[#F59E0B] bg-[#192234] pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

export default Slider;
