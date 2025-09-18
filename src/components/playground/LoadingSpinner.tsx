'use client';

import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="mt-2 text-sm text-gray-600 text-center">Loading resz...</div>
      </div>
    </div>
  );
}
