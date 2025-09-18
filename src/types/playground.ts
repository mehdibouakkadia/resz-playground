export type PanelType = 'panel' | 'sidebar' | 'toolbar' | 'window' | 'modal';

export type HandleDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export type AnchorDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'center';

export type SpringPreset = 'gentle' | 'smooth' | 'snappy';

export interface SpringConfig {
  tension: number;
  friction: number;
  mass: number;
}

export interface PlaygroundState {
  // Panel configuration
  panelType: PanelType;
  initialWidth: number;
  initialHeight: number;
  
  // Spring physics
  preset: SpringPreset | 'custom';
  springConfig: SpringConfig;
  
  // Handles
  visibleHandles: HandleDirection[];
  
  // Anchor
  anchor: AnchorDirection;
  
  // Constraints
  constraints: {
    min?: { width?: number; height?: number };
    max?: { width?: number; height?: number };
    aspectRatio?: number;
  };
  
  // Constraint options
  useMinConstraints: boolean;
  useMaxConstraints: boolean;
  useAspectRatio: boolean;
  
  // Snap
  snap?: {
    increment: number;
  };
  
  // Custom handle code
  customHandleCode?: string;
  useCustomHandles: boolean;
  
  // Workspace mode
  workspaceMode: 'visual' | 'code';
}

export const SPRING_PRESETS: Record<SpringPreset, SpringConfig> = {
  gentle: { tension: 120, friction: 14, mass: 1 },
  smooth: { tension: 170, friction: 26, mass: 1 },
  snappy: { tension: 300, friction: 30, mass: 1 }
};

export const PANEL_STYLES: Record<PanelType, { className: string; label: string }> = {
  panel: {
    className: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    label: 'Panel'
  },
  sidebar: {
    className: 'bg-gray-50 border-r border-gray-200',
    label: 'Sidebar'
  },
  toolbar: {
    className: 'bg-gray-100 border border-gray-300 rounded-md',
    label: 'Toolbar'
  },
  window: {
    className: 'bg-white border border-gray-300 rounded-lg shadow-lg',
    label: 'Window'
  },
  modal: {
    className: 'bg-white border border-gray-200 rounded-xl shadow-2xl',
    label: 'Modal'
  }
};
