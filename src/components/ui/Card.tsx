import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className, style }: CardProps) {
  return (
    <div
      className={clsx('rounded-xl p-6', className)}
      style={{
        background: '#192234',
        border: '1px solid rgba(148,163,184,0.14)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
