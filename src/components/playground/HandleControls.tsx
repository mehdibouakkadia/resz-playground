'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { HandleDirection } from '@/types/playground';

interface HandleControlsProps {
  visibleHandles: HandleDirection[];
  onToggleHandle: (handle: HandleDirection) => void;
}

const HANDLE_POSITIONS: Record<HandleDirection, { label: string; position: string }> = {
  n: { label: 'N', position: 'top-1 left-1/2 transform -translate-x-1/2' },
  s: { label: 'S', position: 'bottom-1 left-1/2 transform -translate-x-1/2' },
  e: { label: 'E', position: 'right-1 top-1/2 transform -translate-y-1/2' },
  w: { label: 'W', position: 'left-1 top-1/2 transform -translate-y-1/2' },
  ne: { label: 'NE', position: 'top-1 right-1' },
  nw: { label: 'NW', position: 'top-1 left-1' },
  se: { label: 'SE', position: 'bottom-1 right-1' },
  sw: { label: 'SW', position: 'bottom-1 left-1' }
};

export function HandleControls({ visibleHandles, onToggleHandle }: HandleControlsProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Resize Handles</Label>
        
        {/* Visual handle selector - increased width for better readability */}
        <div className="relative w-32 h-20 bg-gray-100 border border-gray-200 rounded mx-auto">
          {(Object.entries(HANDLE_POSITIONS) as [HandleDirection, typeof HANDLE_POSITIONS[HandleDirection]][]).map(([direction, config]) => (
            <button
              key={direction}
              onClick={() => onToggleHandle(direction)}
              className={`
                absolute w-5 h-5 rounded-sm border text-xs font-bold flex items-center justify-center
                transition-all ${config.position}
                ${visibleHandles.includes(direction)
                  ? 'bg-blue-500 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }
              `}
              style={{ fontSize: '8px' }}
              title={`Toggle ${direction.toUpperCase()} handle`}
            >
              {config.label}
            </button>
          ))}
        </div>
        
      </div>
    </Card>
  );
}
