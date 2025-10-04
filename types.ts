import type React from 'react';
import type { IconType } from './assets/icons';

export interface AppConfig<T> {
  type: string;
  component: React.FC<{ data: T; windowId: string; }>;
}

export interface DesktopItem {
  id: string;
  name: string;
  icon: IconType;
  app: AppConfig<any>;
  data: any;
}

export interface WindowInstance {
  id: string;
  title: string;
  icon: IconType;
  app: AppConfig<any>;
  data: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
  isMaximized: boolean;
  preMaximizedState?: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}
