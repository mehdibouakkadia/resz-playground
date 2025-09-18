declare module 'resz' {
  import { ReactNode } from 'react';
  
  export interface ResizeProps {
    children?: ReactNode;
    preset?: 'gentle' | 'smooth' | 'snappy';
    config?: {
      tension?: number;
      friction?: number;
      mass?: number;
    };
    constraints?: {
      min?: { width?: number; height?: number };
      max?: { width?: number; height?: number };
      aspectRatio?: number;
    };
    initialWidth?: number;
    initialHeight?: number;
    onResize?: (data: { width: number; height: number; isDragging: boolean }) => void;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export interface PanelProps {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export interface HandleProps {
    dir: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
    render?: (props: { active: boolean; dragging: boolean }) => ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export const Resize: React.FC<ResizeProps> & {
    Panel: React.FC<PanelProps>;
    Handle: React.FC<HandleProps>;
  };
}
