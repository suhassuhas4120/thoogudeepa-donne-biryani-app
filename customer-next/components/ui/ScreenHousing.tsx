'use client';

import React from 'react';

interface ScreenHousingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  screenNumber?: number;
  screenTitle?: string;
}

export const ScreenHousing: React.FC<ScreenHousingProps> = ({
  children,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`w-full max-w-md mx-auto min-h-screen sm:min-h-[100dvh] flex flex-col bg-[#FFFCF7] text-[#5B5049] relative shadow-2xl sm:border-x sm:border-[#E8D5C3] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
