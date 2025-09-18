'use client';

import React, { useEffect, useState } from 'react';
import { PlaygroundState, PANEL_STYLES } from '@/types/playground';

interface ActualResizablePreviewProps {
  state: PlaygroundState;
  onResize?: (width: number, height: number, isDragging: boolean) => void;
}

// Define a type for the Resize component from resz library
interface ResizeComponentType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: any): React.ReactElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Panel: React.ComponentType<any>;
  Handle: React.ComponentType<{ dir: string }>;
}

export function ActualResizablePreview({ state, onResize }: ActualResizablePreviewProps) {
  const [ResizeComponent, setResizeComponent] = useState<ResizeComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentSize, setCurrentSize] = useState({ 
    width: state.initialWidth, 
    height: state.initialHeight 
  });
  
  const panelStyle = PANEL_STYLES[state.panelType];

  // Dynamically import the resz library
  useEffect(() => {
    const loadResize = async () => {
      try {
        const { Resize } = await import('resz');
        setResizeComponent(() => Resize as ResizeComponentType);
        setIsLoading(false);
      } catch {
        // Failed to load resz library
        setLoadError('Failed to load resz library. Using mock preview instead.');
        setResizeComponent(null);
        setIsLoading(false);
      }
    };
    
    loadResize();
  }, []);

  const handleResize = (width: number, height: number, isDragging: boolean) => {
    setCurrentSize({ width, height });
    onResize?.(width, height, isDragging);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Loading resz...</div>
        </div>
      </div>
    );
  }

  // If resz library loaded successfully, use it
  if (ResizeComponent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resizeProps: Record<string, any> = {
      initialWidth: state.initialWidth,
      initialHeight: state.initialHeight,
      onResize: handleResize,
    };

    // Add preset or config
    if (state.preset !== 'custom') {
      resizeProps.preset = state.preset;
    } else {
      resizeProps.config = state.springConfig;
    }

    // Add anchor if not center
    if (state.anchor !== 'center') {
      resizeProps.anchor = state.anchor;
    }

    // Add constraints if they exist
    if (state.constraints.min || state.constraints.max || state.constraints.aspectRatio) {
      resizeProps.constraints = state.constraints;
    }

    // Add snap if it exists
    if (state.snap) {
      resizeProps.snap = state.snap;
    }

    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg min-h-[400px]">
        <ResizeComponent {...resizeProps}>
          <ResizeComponent.Panel>
            <div className={`${panelStyle.className} p-6`}>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {panelStyle.label}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {Math.round(currentSize.width)} × {Math.round(currentSize.height)}
                </p>
                <div className="text-xs text-gray-500">
                  <div>Spring: {state.preset}</div>
                  <div>Anchor: {state.anchor}</div>
                  <div>Handles: {state.visibleHandles.join(', ')}</div>
                </div>
              </div>
            </div>
          </ResizeComponent.Panel>
          
          {/* Render handles */}
          {state.visibleHandles.map(direction => (
            <ResizeComponent.Handle key={direction} dir={direction} />
          ))}
        </ResizeComponent>
      </div>
    );
  }

  // Fallback to mock component
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg min-h-[400px]">
      <div className="relative">
        {/* Mock resizable panel */}
        <div 
          className={`${panelStyle.className} p-6 relative transition-all duration-200`}
          style={{
            width: state.initialWidth,
            height: state.initialHeight,
          }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {panelStyle.label} (Mock)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {state.initialWidth} × {state.initialHeight}
            </p>
            <div className="text-xs text-gray-500">
              <div>Spring: {state.preset}</div>
              <div>Anchor: {state.anchor}</div>
              <div>Handles: {state.visibleHandles.join(', ')}</div>
            </div>
            <div className="mt-2 text-xs text-orange-600">
              {loadError ? 'Mock Preview (resz not available)' : 'Install resz to see live preview'}
            </div>
          </div>
          
          {/* Mock handles */}
          {state.visibleHandles.map(direction => (
            <div
              key={direction}
              className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-sm shadow-sm ${getHandlePosition(direction)}`}
              style={{ cursor: getHandleCursor(direction) }}
            />
          ))}
        </div>
        
        {/* Anchor direction indicator */}
        {state.anchor !== 'center' && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Anchor:</span>
              <AnchorArrow direction={state.anchor} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getHandlePosition(direction: string): string {
  const positions: Record<string, string> = {
    n: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    s: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2',
    e: 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2',
    w: 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
    ne: 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2',
    nw: 'top-0 left-0 transform -translate-x-1/2 -translate-y-1/2',
    se: 'bottom-0 right-0 transform translate-x-1/2 translate-y-1/2',
    sw: 'bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2'
  };
  return positions[direction] || '';
}

function getHandleCursor(direction: string): string {
  const cursors: Record<string, string> = {
    n: 'ns-resize',
    s: 'ns-resize',
    e: 'ew-resize',
    w: 'ew-resize',
    ne: 'nesw-resize',
    nw: 'nwse-resize',
    se: 'nwse-resize',
    sw: 'nesw-resize'
  };
  return cursors[direction] || 'default';
}

function AnchorArrow({ direction }: { direction: string }) {
  const getArrowPath = (dir: string) => {
    switch (dir) {
      case 'n': return 'M12 5l-7 7h14l-7-7z';
      case 's': return 'M12 19l7-7H5l7 7z';
      case 'e': return 'M19 12l-7-7v14l7-7z';
      case 'w': return 'M5 12l7-7v14l-7-7z';
      case 'ne': return 'M7 7h10v10M7 7l10 10';
      case 'nw': return 'M17 7H7v10M17 7L7 17';
      case 'se': return 'M7 17h10V7M7 17L17 7';
      case 'sw': return 'M17 17H7V7M17 17L7 7';
      default: return '';
    }
  };

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
      <path d={getArrowPath(direction)} />
    </svg>
  );
}
