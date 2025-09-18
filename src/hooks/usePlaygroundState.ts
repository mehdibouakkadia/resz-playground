'use client';

import { useState, useCallback } from 'react';
import { PlaygroundState, SPRING_PRESETS } from '@/types/playground';

const initialState: PlaygroundState = {
  panelType: 'modal',
  initialWidth: 400,
  initialHeight: 300,
  preset: 'smooth',
  springConfig: SPRING_PRESETS.smooth,
  visibleHandles: ['se', 'e', 's'], // Start with more handles visible
  anchor: 'center',
  constraints: {
    min: { width: 200, height: 150 },
    max: { width: 800, height: 600 },
    aspectRatio: undefined
  },
  useMinConstraints: false,
  useMaxConstraints: false,
  useAspectRatio: false,
  customHandleCode: '',
  useCustomHandles: false,
  workspaceMode: 'visual'
};

export function usePlaygroundState() {
  const [state, setState] = useState<PlaygroundState>(initialState);

  const updateState = useCallback((updates: Partial<PlaygroundState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setPreset = useCallback((preset: PlaygroundState['preset']) => {
    if (preset === 'custom') {
      updateState({ preset });
    } else {
      updateState({ 
        preset, 
        springConfig: SPRING_PRESETS[preset] 
      });
    }
  }, [updateState]);

  const setSpringConfig = useCallback((config: Partial<PlaygroundState['springConfig']>) => {
    setState(prev => ({
      ...prev,
      preset: 'custom',
      springConfig: { ...prev.springConfig, ...config }
    }));
  }, []);

  const toggleHandle = useCallback((handle: PlaygroundState['visibleHandles'][0]) => {
    setState(prev => ({
      ...prev,
      visibleHandles: prev.visibleHandles.includes(handle)
        ? prev.visibleHandles.filter(h => h !== handle)
        : [...prev.visibleHandles, handle]
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    updateState,
    setPreset,
    setSpringConfig,
    toggleHandle,
    resetToDefaults
  };
}
