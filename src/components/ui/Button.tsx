import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'amber';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 shadow-sm',
  amber:
    'bg-amber-500 text-slate-900 font-semibold hover:bg-amber-600 active:bg-amber-700 shadow-sm',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 shadow-sm',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
