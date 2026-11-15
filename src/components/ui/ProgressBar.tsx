export interface ProgressBarProps {
  value: number;      // 0.0 to 1.0
  color?: string;     // hex color, default #F59E0B
  height?: number;    // px, default 6
  label?: string;
  showPercent?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  color = '#F59E0B',
  height = 6,
  label,
  showPercent = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value * 100));

  return (
    <div className="flex flex-col gap-1 w-full">
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-slate-400">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-mono">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div
        className="rounded-full overflow-hidden"
        style={{ height: `${height}px`, background: 'rgba(148,163,184,0.1)' }}
      >
        <div
          className={animated ? 'transition-all duration-700 ease-out rounded-full' : 'rounded-full'}
          style={{ width: `${percentage}%`, height: '100%', background: color }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
