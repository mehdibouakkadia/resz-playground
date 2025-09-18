'use client';

import React from 'react';
import { Resize } from 'resz';
import 'resz/style.css';
import { Dithering } from '@paper-design/shaders-react';
import { PlaygroundState } from '@/types/playground';

function getRatioLabel(ratio: number): string {
  const ratios: Record<string, string> = {
    '1': '1:1',
    '1.33': '4:3', 
    '1.5': '3:2',
    '1.78': '16:9',
    '2': '2:1',
    '0.75': '3:4',
    '0.56': '9:16'
  };
  return ratios[ratio.toString()] || ratio.toFixed(2);
}

interface SimpleResizablePreviewProps {
  state: PlaygroundState;
  onResize?: (width: number, height: number, isDragging: boolean) => void;
}

export function SimpleResizablePreview({ state, onResize }: SimpleResizablePreviewProps) {
  const [currentSize, setCurrentSize] = React.useState({ 
    width: 400, 
    height: 300 
  });
  const [fileTreeWidth, setFileTreeWidth] = React.useState(200);
  
  // Update currentSize when initialWidth/Height changes
  React.useEffect(() => {
    if (state.initialWidth && state.initialHeight) {
      setCurrentSize({
        width: state.initialWidth,
        height: state.initialHeight
      });
    }
  }, [state.initialWidth, state.initialHeight]);

  // Note: Auto-resize when constraints change would be nice, but the resz library
  // doesn't support programmatic resizing. Users need to manually adjust the panel
  // after changing constraints. This is acceptable UX for now.

  const handleResize = (resizeData: { width: number; height: number; isDragging: boolean }) => {
    // The resz library passes a single object with width, height, and isDragging
    const { width, height, isDragging } = resizeData;
    
    if (width && height && !isNaN(width) && !isNaN(height)) {
      setCurrentSize({ width: Math.round(width), height: Math.round(height) });
    }
    
    onResize?.(width, height, isDragging);
  };

  return (
    <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg relative flex flex-col">
      {/* Info overlay - bottom right with mono font */}
      <div className="absolute bottom-4 right-4 z-10 font-mono text-sm text-gray-600 text-right">
        <div>{currentSize.width} × {currentSize.height}</div>
        <div className="text-xs text-gray-500">Spring: {state.preset}</div>
        <div className="text-xs text-gray-500">Handles: {state.visibleHandles.join(', ')}</div>
        <div className="text-xs text-gray-500">
          Min: {state.useMinConstraints ? `${state.constraints.min?.width || 100}×${state.constraints.min?.height || 100}` : 'None'} | 
          Max: {state.useMaxConstraints ? `${state.constraints.max?.width || 800}×${state.constraints.max?.height || 600}` : 'None'}
        </div>
        <div className="text-xs text-gray-500">
          Ratio: {state.useAspectRatio ? getRatioLabel(state.constraints.aspectRatio || 1.33) : 'Free'}
        </div>
        {state.snap && (
          <div className="text-xs text-gray-500">
            Snap: {state.snap.increment}px grid
          </div>
        )}
      </div>

      {/* Simple container - no extra divs that interfere with handles */}
      <div className="flex-1 p-8" style={{ position: 'relative' }}>
        {/* For code editor, render nested resizable layout */}
        {state.panelType === 'toolbar' ? (
          <Resize 
            key={`${state.useMinConstraints}-${state.useMaxConstraints}-${state.useAspectRatio}-${JSON.stringify(state.constraints)}-${JSON.stringify(state.snap)}-toolbar`}
            preset={state.preset !== 'custom' ? state.preset : undefined}
            config={state.preset === 'custom' ? state.springConfig : undefined}
            initialWidth={currentSize.width}
            initialHeight={currentSize.height}
            constraints={{
              min: state.useMinConstraints ? state.constraints.min : undefined,
              max: state.useMaxConstraints ? state.constraints.max : undefined,
              aspectRatio: state.useAspectRatio ? state.constraints.aspectRatio : undefined
            }}
            snap={state.snap}
            onResize={handleResize}
          >
            <Resize.Panel>
              <div className="w-full h-full bg-gray-100 border border-gray-300 rounded-md flex overflow-hidden">
                {/* Inner resizable for the file tree vs code editor split */}
                <div className="h-full">
                  <Resize
                    preset="smooth"
                    initialWidth={200}
                    constraints={{
                      min: { width: 120 },
                      max: { width: 400 }
                    }}
                    onResize={(resizeData: { width: number; height: number; isDragging: boolean }) => {
                      setFileTreeWidth(resizeData.width);
                    }}
                    style={{ height: '100%' }}
                  >
                  <Resize.Panel>
                    <div className="w-full h-full border-r border-gray-300 p-3 flex flex-col gap-1 bg-gray-50">
                      <div className="text-xs font-semibold text-gray-600 mb-2">Files</div>
                      {/* Folder: src */}
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-sm flex-shrink-0" />
                        {fileTreeWidth > 150 ? (
                          <div className="h-3 bg-gray-300 rounded" style={{ width: '30px' }} />
                        ) : (
                          <div className="h-3 bg-gray-300 rounded" style={{ width: '20px' }} />
                        )}
                      </div>
                      {/* Files in src - responsive text */}
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-300 rounded-sm flex-shrink-0" />
                          {fileTreeWidth > 180 ? (
                            <div className="h-3 bg-gray-300 rounded" style={{ width: '65px' }} />
                          ) : fileTreeWidth > 150 ? (
                            <div className="h-3 bg-gray-300 rounded" style={{ width: '45px' }} />
                          ) : (
                            <div className="h-3 bg-gray-300 rounded" style={{ width: '25px' }} />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-300 rounded-sm flex-shrink-0" />
                          {fileTreeWidth > 180 ? (
                            <div className="h-3 bg-gray-300 rounded" style={{ width: '55px' }} />
                          ) : fileTreeWidth > 150 ? (
                            <div className="h-3 bg-gray-300 rounded" style={{ width: '35px' }} />
                          ) : (
                            <div className="h-3 bg-gray-300 rounded" style={{ width: '20px' }} />
                          )}
                        </div>
                      </div>
                      {/* Folder: public */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-sm flex-shrink-0" />
                        {fileTreeWidth > 150 ? (
                          <div className="h-3 bg-gray-300 rounded" style={{ width: '50px' }} />
                        ) : (
                          <div className="h-3 bg-gray-300 rounded" style={{ width: '30px' }} />
                        )}
                      </div>
                    </div>
                  </Resize.Panel>
                  <Resize.Handle dir="e" />
                </Resize>
                </div>
                
                {/* Code editor area - fills remaining space */}
                <div className="flex-1 h-full p-3 bg-white flex flex-col">
                  <div className="text-xs text-gray-600 mb-2">main.tsx</div>
                  <div className="flex-1 space-y-1 font-mono text-xs">
                    <div className="h-3 bg-gray-300 rounded" style={{ width: '120px' }} />
                    <div className="h-3 bg-gray-300 rounded" style={{ width: '160px' }} />
                    <div className="h-3 bg-gray-300 rounded ml-4" style={{ width: '100px' }} />
                    <div className="h-3 bg-gray-300 rounded ml-8" style={{ width: '140px' }} />
                    <div className="h-3 bg-gray-300 rounded ml-4" style={{ width: '40px' }} />
                    <div className="h-3 bg-gray-300 rounded" style={{ width: '20px' }} />
                  </div>
                </div>
              </div>
            </Resize.Panel>
            
            {/* Render handles based on user selection */}
            {state.visibleHandles.map(direction => (
              <Resize.Handle key={direction} dir={direction} />
            ))}
          </Resize>
        ) : (
          /* All other panel types use the single resizable component */
          <Resize 
            key={`${state.useMinConstraints}-${state.useMaxConstraints}-${state.useAspectRatio}-${JSON.stringify(state.constraints)}-${JSON.stringify(state.snap)}`}
            preset={state.preset !== 'custom' ? state.preset : undefined}
            config={state.preset === 'custom' ? state.springConfig : undefined}
            initialWidth={currentSize.width}
            initialHeight={currentSize.height}
            constraints={{
              min: state.useMinConstraints ? state.constraints.min : undefined,
              max: state.useMaxConstraints ? state.constraints.max : undefined,
              aspectRatio: state.useAspectRatio ? state.constraints.aspectRatio : undefined
            }}
            snap={state.snap}
            onResize={handleResize}
          >
          <Resize.Panel>
            {/* Modal - Keep shader background */}
            {state.panelType === 'modal' && (
              <Dithering 
                colorBack="#00000000" 
                colorFront="#868686" 
                speed={0.67} 
                shape="warp" 
                type="4x4" 
                pxSize={1.5} 
                scale={0.59} 
                frame={508199.828999933}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  backgroundColor: '#000000',
                  borderRadius: '8px'
                }} 
              />
            )}
            
            {/* Sidebar - SaaS dashboard style */}
            {state.panelType === 'sidebar' && (
              <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-md p-4 flex flex-col overflow-hidden">
                {/* Brand header - fixed height */}
                <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-900 rounded" />
                  {currentSize.width > 180 && (
                    <div className="font-semibold text-gray-900">Grimoire</div>
                  )}
                </div>
                
                {/* Navigation items - takes remaining space */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-3 px-2 py-2 rounded ${i === 1 ? 'bg-gray-200' : ''}`}
                      >
                        <div className="w-5 h-5 bg-gray-400 rounded" />
                        {currentSize.width > 180 && (
                          <div className="h-3 bg-gray-300 rounded-full" style={{ width: `${80 - i * 5}px` }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Profile section - fixed at bottom */}
                <div className="border-t border-gray-200 pt-3 mt-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                    {currentSize.width > 180 && (
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900">John Doe</div>
                        <div className="text-xs text-gray-500">john@grimoire.inc</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            
            {/* Window - macOS style */}
            {state.panelType === 'window' && (
              <div className="w-full h-full bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
                {/* Window chrome */}
                <div className="h-8 bg-gray-100 rounded-t-lg border-b border-gray-300 flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="flex-1 text-center text-xs text-gray-600">Window Title</div>
                </div>
                {/* Window content */}
                <div className="flex-1 p-4">
                  <div className="h-full bg-gray-50 rounded" />
                </div>
              </div>
            )}
          </Resize.Panel>
          
          {/* Render handles based on user selection */}
          {state.visibleHandles.map(direction => (
            <Resize.Handle key={direction} dir={direction} />
          ))}
        </Resize>
        )}
      </div>
    </div>
  );
}