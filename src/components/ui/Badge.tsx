import React from 'react';
import clsx from 'clsx';

export type BadgeVariant =
  | 'modis'
  | 'viirs'
  | 'candidate'
  | 'valid'
  | 'cloud'
  | 'swath'
  | 'standard'
  | 'nrt'
  | 'pass'
  | 'flag'
  | 'fail';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  modis: { background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.4)' },
  viirs: { background: 'rgba(34,211,238,0.15)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.4)' },
  candidate: { background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.4)' },
  valid: { background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.4)' },
  cloud: { background: 'rgba(100,116,139,0.15)', color: '#94A3B8', border: '1px solid rgba(100,116,139,0.4)' },
  swath: { background: 'transparent', color: '#64748B', border: '1px dashed #475569' },
  standard: { background: 'rgba(148,163,184,0.1)', color: '#CBD5E1', border: '1px solid rgba(148,163,184,0.3)' },
  nrt: { background: 'rgba(251,146,60,0.15)', color: '#FB923C', border: '1px solid rgba(251,146,60,0.4)' },
  pass: { background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.4)' },
  flag: { background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.4)' },
  fail: { background: 'rgba(248,113,113,0.15)', color: '#F87171', border: '1px solid rgba(248,113,113,0.4)' },
};

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium leading-none',
        className
      )}
      style={variantStyles[variant]}
    >
      {label}
    </span>
  );
}

export default Badge;
