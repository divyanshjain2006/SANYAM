import React, { useEffect } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, width = '440px' }: DrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out overflow-hidden shadow-2xl"
        style={{
          width,
          background: '#FFFFFF',
          borderLeft: '1px solid #E2E8F0',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-slate-200 bg-slate-50/80">
          {title && (
            <h2 className="text-slate-900 font-bold text-sm leading-tight">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-auto cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-white text-slate-700">
          {children}
        </div>
      </div>
    </>
  );
}

export default Drawer;
