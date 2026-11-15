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
      className={clsx('rounded-xl p-6 shadow-sm', className)}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
