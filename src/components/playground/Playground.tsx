'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RotateCcw } from 'lucide-react';

import { usePlaygroundState } from '@/hooks/usePlaygroundState';
import { SimpleResizablePreview } from './SimpleResizablePreview';

// function getRatioLabel(ratio: number): string {
//   const ratios: Record<string, string> = {
//     '1': '1:1',
//     '1.33': '4:3', 
//     '1.5': '3:2',
//     '1.78': '16:9',
//     '2': '2:1',
//     '0.75': '3:4',
//     '0.56': '9:16'
//   };
//   return ratios[ratio.toString()] || ratio.toFixed(2);
// }
// import { PanelTypeSelector } from './PanelTypeSelector'; // Temporarily disabled
import { SpringControls } from './SpringControls';
import { HandleControls } from './HandleControls';
import { ExportModal } from './ExportModal';

export function Playground() {
  const {
    state,
    updateState,
    setPreset,
    setSpringConfig,
    toggleHandle,
    resetToDefaults
  } = usePlaygroundState();

  const [exportModalOpen, setExportModalOpen] = useState(false);
  
  // Local state for pending constraint values
  const [pendingConstraints, setPendingConstraints] = useState<{
    minWidth: number | string;
    minHeight: number | string;
    maxWidth: number | string;
    maxHeight: number | string;
  }>({
    minWidth: state.constraints.min?.width || 100,
    minHeight: state.constraints.min?.height || 100,
    maxWidth: state.constraints.max?.width || 800,
    maxHeight: state.constraints.max?.height || 600
  });

  // Check if specific fields have pending changes
  const hasMinWidthChanges = pendingConstraints.minWidth !== (state.constraints.min?.width || 100);
  const hasMinHeightChanges = pendingConstraints.minHeight !== (state.constraints.min?.height || 100);
  const hasMaxWidthChanges = pendingConstraints.maxWidth !== (state.constraints.max?.width || 800);
  const hasMaxHeightChanges = pendingConstraints.maxHeight !== (state.constraints.max?.height || 600);

  const applyConstraints = () => {
    const newConstraints = {
      ...state.constraints,
      min: { 
        width: typeof pendingConstraints.minWidth === 'string' ? parseInt(pendingConstraints.minWidth) || 100 : pendingConstraints.minWidth, 
        height: typeof pendingConstraints.minHeight === 'string' ? parseInt(pendingConstraints.minHeight) || 100 : pendingConstraints.minHeight 
      },
      max: { 
        width: typeof pendingConstraints.maxWidth === 'string' ? parseInt(pendingConstraints.maxWidth) || 800 : pendingConstraints.maxWidth, 
        height: typeof pendingConstraints.maxHeight === 'string' ? parseInt(pendingConstraints.maxHeight) || 600 : pendingConstraints.maxHeight 
      }
    };

    updateState({
      constraints: newConstraints
    });

    // Note: Constraints will be enforced when user next drags a handle
    // Auto-resize would require deeper integration with the resz library
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resz Playground</h1>
            <p className="text-sm text-gray-600">
              Experiment with spring physics resizing for React
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setExportModalOpen(true)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Tabs */}
          <div className="flex-1 flex flex-col">
            <div className="border-b bg-white px-6 py-2">
              <div className="flex gap-2">
                <button
                  onClick={() => updateState({ 
                    panelType: 'modal',
                    visibleHandles: ['se', 'e', 's'] // Default handles for modal
                  })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    state.panelType === 'modal'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Modal
                </button>
                <button
                  onClick={() => updateState({ 
                    panelType: 'sidebar',
                    visibleHandles: ['e'] // Default handle for sidebar
                  })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    state.panelType === 'sidebar'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sidebar
                </button>
                <button
                  onClick={() => updateState({ 
                    panelType: 'toolbar',
                    visibleHandles: ['se', 'e', 's'] // Default handles for code editor
                  })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    state.panelType === 'toolbar'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Code Editor
                </button>
                <button
                  onClick={() => updateState({ 
                    panelType: 'window',
                    visibleHandles: ['se', 'e', 's'] // Default handles for window
                  })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    state.panelType === 'window'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Window
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
              <SimpleResizablePreview state={state} />
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-80 border-l bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Panel Type - Temporarily disabled */}
            {/* <PanelTypeSelector
              selectedType={state.panelType}
              onTypeChange={(type) => updateState({ panelType: type })}
            /> */}

            {/* Spring Controls */}
            <SpringControls
              preset={state.preset}
              config={state.springConfig}
              onPresetChange={setPreset}
              onConfigChange={setSpringConfig}
            />

            {/* Handle Controls */}
            <HandleControls
              visibleHandles={state.visibleHandles}
              onToggleHandle={toggleHandle}
            />

            {/* Size Constraints */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="text-sm font-medium">Size Constraints</div>
                
                {/* Min Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-600">Minimum Size</label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={state.useMinConstraints}
                        onCheckedChange={(checked) => updateState({ useMinConstraints: checked })}
                      />
                      <span className="text-xs text-gray-500">Enable</span>
                    </div>
                  </div>
                  <div className={`space-y-2 ${!state.useMinConstraints ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-6">W:</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={pendingConstraints.minWidth}
                          onChange={(e) => setPendingConstraints(prev => ({ 
                            ...prev, 
                            minWidth: e.target.value === '' ? '' : (parseInt(e.target.value) || 0)
                          }))}
                          className="w-full px-2 py-1 pr-12 text-xs border border-gray-200 rounded"
                          disabled={!state.useMinConstraints}
                          placeholder="100"
                        />
                        {hasMinWidthChanges && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={applyConstraints}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 px-2 text-xs text-gray-600 hover:text-gray-700"
                            disabled={!state.useMinConstraints}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-6">H:</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={pendingConstraints.minHeight}
                          onChange={(e) => setPendingConstraints(prev => ({ 
                            ...prev, 
                            minHeight: e.target.value === '' ? '' : (parseInt(e.target.value) || 0)
                          }))}
                          className="w-full px-2 py-1 pr-12 text-xs border border-gray-200 rounded"
                          disabled={!state.useMinConstraints}
                          placeholder="100"
                        />
                        {hasMinHeightChanges && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={applyConstraints}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 px-2 text-xs text-gray-600 hover:text-gray-700"
                            disabled={!state.useMinConstraints}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">px</span>
                    </div>
                  </div>
                </div>

                {/* Max Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-600">Maximum Size</label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={state.useMaxConstraints}
                        onCheckedChange={(checked) => updateState({ useMaxConstraints: checked })}
                      />
                      <span className="text-xs text-gray-500">Enable</span>
                    </div>
                  </div>
                  <div className={`space-y-2 ${!state.useMaxConstraints ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-6">W:</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={pendingConstraints.maxWidth}
                          onChange={(e) => setPendingConstraints(prev => ({ 
                            ...prev, 
                            maxWidth: e.target.value === '' ? '' : (parseInt(e.target.value) || 0)
                          }))}
                          className="w-full px-2 py-1 pr-12 text-xs border border-gray-200 rounded"
                          disabled={!state.useMaxConstraints}
                          placeholder="800"
                        />
                        {hasMaxWidthChanges && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={applyConstraints}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 px-2 text-xs text-gray-600 hover:text-gray-700"
                            disabled={!state.useMaxConstraints}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-6">H:</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={pendingConstraints.maxHeight}
                          onChange={(e) => setPendingConstraints(prev => ({ 
                            ...prev, 
                            maxHeight: e.target.value === '' ? '' : (parseInt(e.target.value) || 0)
                          }))}
                          className="w-full px-2 py-1 pr-12 text-xs border border-gray-200 rounded"
                          disabled={!state.useMaxConstraints}
                          placeholder="600"
                        />
                        {hasMaxHeightChanges && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={applyConstraints}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 px-2 text-xs text-gray-600 hover:text-gray-700"
                            disabled={!state.useMaxConstraints}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">px</span>
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-600">Aspect Ratio</label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={state.useAspectRatio}
                        onCheckedChange={(checked) => updateState({ useAspectRatio: checked })}
                      />
                      <span className="text-xs text-gray-500">Enable</span>
                    </div>
                  </div>
                  <div className={`${!state.useAspectRatio ? 'opacity-50' : ''}`}>
                    <Select
                      value={state.constraints.aspectRatio?.toString() || '1.33'}
                      onValueChange={(value) => updateState({ 
                        constraints: { 
                          ...state.constraints, 
                          aspectRatio: parseFloat(value)
                        }
                      })}
                      disabled={!state.useAspectRatio}
                    >
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Select ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1:1 (Square)</SelectItem>
                        <SelectItem value="1.33">4:3 (Standard)</SelectItem>
                        <SelectItem value="1.5">3:2 (Photo)</SelectItem>
                        <SelectItem value="1.78">16:9 (Widescreen)</SelectItem>
                        <SelectItem value="2">2:1 (Cinematic)</SelectItem>
                        <SelectItem value="0.75">3:4 (Portrait)</SelectItem>
                        <SelectItem value="0.56">9:16 (Mobile)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Snap to Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-600">Snap to Grid</label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!!state.snap}
                        onCheckedChange={(checked) => updateState({ 
                          snap: checked ? { increment: 10 } : undefined 
                        })}
                      />
                      <span className="text-xs text-gray-500">Enable</span>
                    </div>
                  </div>
                  
                  <div className={`space-y-1 ${!state.snap ? 'opacity-50' : ''}`}>
                    <label className="text-xs text-gray-600">Grid Size</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={state.snap?.increment || 10}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0 && state.snap) {
                            updateState({ 
                              snap: { 
                                increment: value 
                              }
                            });
                          }
                        }}
                        disabled={!state.snap}
                        className="flex-1 h-8 px-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
                      />
                      <span className="text-xs text-gray-400">px</span>
                    </div>
                    {state.snap && (
                      <div className="text-xs text-gray-500 italic">
                        Resize will snap to {state.snap.increment}px increments
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        state={state}
      />
    </div>
  );
}
