'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AnchorDirection } from '@/types/playground';

interface AnchorControlsProps {
  anchor: AnchorDirection;
  onAnchorChange: (anchor: AnchorDirection) => void;
}

const ANCHOR_POSITIONS: Record<AnchorDirection, { label: string; position: string; icon: string }> = {
  n: { label: 'North', position: 'top-1 left-1/2 transform -translate-x-1/2', icon: '↑' },
  s: { label: 'South', position: 'bottom-1 left-1/2 transform -translate-x-1/2', icon: '↓' },
  e: { label: 'East', position: 'right-1 top-1/2 transform -translate-y-1/2', icon: '→' },
  w: { label: 'West', position: 'left-1 top-1/2 transform -translate-y-1/2', icon: '←' },
  ne: { label: 'Northeast', position: 'top-1 right-1', icon: '↗' },
  nw: { label: 'Northwest', position: 'top-1 left-1', icon: '↖' },
  se: { label: 'Southeast', position: 'bottom-1 right-1', icon: '↘' },
  sw: { label: 'Southwest', position: 'bottom-1 left-1', icon: '↙' },
  center: { label: 'Center', position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2', icon: '⊙' }
};

export function AnchorControls({ anchor, onAnchorChange }: AnchorControlsProps) {
  return (
    <Card className="p-4 relative">
      {/* Coming Soon Overlay - 80% opacity covering entire card */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          Coming Soon
        </div>
      </div>
      
      <div className="space-y-3">
        <Label className="text-sm font-medium">Anchor Direction</Label>
        <p className="text-xs text-gray-600">
          Controls how the panel grows when resized
        </p>
        
        {/* Visual anchor selector */}
        <div className="relative w-24 h-16 bg-gray-100 border border-gray-200 rounded mx-auto">
          {(Object.entries(ANCHOR_POSITIONS) as [AnchorDirection, typeof ANCHOR_POSITIONS[AnchorDirection]][]).map(([direction, config]) => (
            <button
              key={direction}
              onClick={() => onAnchorChange(direction)}
              className={`
                absolute w-4 h-4 rounded-sm border text-sm flex items-center justify-center
                transition-all ${config.position}
                ${anchor === direction
                  ? 'bg-green-500 border-green-600 text-white shadow-sm'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }
              `}
              title={`Anchor to ${config.label}`}
            >
              {config.icon}
            </button>
          ))}
        </div>
        
        {/* Current selection */}
        <div className="text-center">
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            {ANCHOR_POSITIONS[anchor].icon} {ANCHOR_POSITIONS[anchor].label}
          </span>
        </div>
      </div>
    </Card>
  );
}
