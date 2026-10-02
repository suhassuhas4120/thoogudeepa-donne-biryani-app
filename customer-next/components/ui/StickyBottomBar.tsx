'use client';

import React from 'react';

interface StickyBottomBarProps {
  label?: string;
  children: React.ReactNode;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ label, children }) => {
  return (
    <div className="sticky bottom-0 z-30 mt-auto border-t border-[#E8D5C3] bg-[#FFFCF7]/95 px-4 py-3 shadow-[0_-6px_20px_rgba(91,80,73,0.06)] backdrop-blur-md">
      {label && (
        <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-wider text-[#5B5049] font-mono text-center">
          {label}
        </div>
      )}
      {children}
    </div>
  );
};
