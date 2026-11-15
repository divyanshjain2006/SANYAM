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
      className={clsx('inline-flex rounded-lg p-0.5', className)}
      style={{
        background: '#F1F5F9',
        border: '1px solid #E2E8F0',
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
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer',
              isActive
                ? 'text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#1E293B]'
            )}
            style={
              isActive
                ? { background: '#2563EB' }
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
