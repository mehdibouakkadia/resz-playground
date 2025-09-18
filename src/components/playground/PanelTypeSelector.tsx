'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PanelType, PANEL_STYLES } from '@/types/playground';

interface PanelTypeSelectorProps {
  selectedType: PanelType;
  onTypeChange: (type: PanelType) => void;
}

export function PanelTypeSelector({ selectedType, onTypeChange }: PanelTypeSelectorProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Panel Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(PANEL_STYLES) as [PanelType, typeof PANEL_STYLES[PanelType]][]).map(([type, config]) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                p-3 rounded-md border text-sm font-medium transition-all
                ${selectedType === type 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
