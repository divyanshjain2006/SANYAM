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
  modis: { background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' },
  viirs: { background: '#ECFEFF', color: '#0E7490', border: '1px solid #A5F3FC' },
  candidate: { background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' },
  valid: { background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' },
  cloud: { background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' },
  swath: { background: '#F8FAFC', color: '#64748B', border: '1px dashed #94A3B8' },
  standard: { background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0' },
  nrt: { background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' },
  pass: { background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' },
  flag: { background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' },
  fail: { background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' },
};

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold leading-none',
        className
      )}
      style={variantStyles[variant]}
    >
      {label}
    </span>
  );
}

export default Badge;
