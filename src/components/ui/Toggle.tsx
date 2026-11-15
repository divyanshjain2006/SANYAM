import clsx from 'clsx';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: [ToggleOption, ToggleOption];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Toggle({ options, value, onChange, className }: ToggleProps) {
  return (
    <div
      className={clsx('inline-flex rounded-full p-0.5', className)}
      style={{
        background: 'rgba(148,163,184,0.08)',
        border: '1px solid rgba(148,163,184,0.14)',
      }}
      role="group"
      aria-label="Toggle"
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
              isActive
                ? 'text-[#111827]'
                : 'text-[#94A3B8] hover:text-[#CBD5E1]'
            )}
            style={
              isActive
                ? { background: '#F59E0B' }
                : { background: 'transparent' }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default Toggle;
