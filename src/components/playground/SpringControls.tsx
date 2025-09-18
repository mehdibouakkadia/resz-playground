'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SpringPreset, SpringConfig, SPRING_PRESETS } from '@/types/playground';

interface SpringControlsProps {
  preset: SpringPreset | 'custom';
  config: SpringConfig;
  onPresetChange: (preset: SpringPreset | 'custom') => void;
  onConfigChange: (config: Partial<SpringConfig>) => void;
}

export function SpringControls({ 
  preset, 
  config, 
  onPresetChange, 
  onConfigChange 
}: SpringControlsProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Label className="text-sm font-medium">Spring Physics</Label>
        
        {/* Presets */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Presets</Label>
          <div className="flex gap-2">
            {(['gentle', 'smooth', 'snappy'] as SpringPreset[]).map((presetName) => (
              <Button
                key={presetName}
                variant={preset === presetName ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPresetChange(presetName)}
                className="capitalize text-xs"
              >
                {presetName}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-gray-600">Tension</Label>
              <span className="text-xs text-gray-500">{config.tension}</span>
            </div>
            <Slider
              value={[config.tension]}
              onValueChange={([value]) => onConfigChange({ tension: value })}
              min={50}
              max={500}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-gray-600">Friction</Label>
              <span className="text-xs text-gray-500">{config.friction}</span>
            </div>
            <Slider
              value={[config.friction]}
              onValueChange={([value]) => onConfigChange({ friction: value })}
              min={5}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-gray-600">Mass</Label>
              <span className="text-xs text-gray-500">{config.mass}</span>
            </div>
            <Slider
              value={[config.mass]}
              onValueChange={([value]) => onConfigChange({ mass: value })}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

      </div>
    </Card>
  );
}
