export type FurnitureType = 
  | 'sofa'
  | 'bed'
  | 'table'
  | 'chair'
  | 'bookshelf'
  | 'plant'
  | 'rug'
  | 'tv_stand'
  | 'lamp';

export interface FurnitureTemplate {
  type: FurnitureType;
  name: string;
  category: 'seating' | 'surfaces' | 'storage' | 'decor';
  icon: string;
  defaultWidth: number; // in meters/units
  defaultHeight: number;
  defaultDepth: number;
  defaultColor: string;
  secondaryColor?: string;
  description: string;
}

export interface PlacedFurniture {
  id: string;
  type: FurnitureType;
  name: string;
  x: number; // position X
  y: number; // position Y (elevation)
  z: number; // position Z
  rotation: number; // angle in radians around Y axis
  width: number;
  height: number;
  depth: number;
  color: string;
  secondaryColor?: string;
}

export interface RoomConfig {
  width: number; // X axis size
  length: number; // Z axis size
  wallHeight: number; // Y axis size
  wallColor: string;
  floorColor: string;
  floorStyle: 'wood' | 'carpet' | 'tile' | 'concrete';
  showFrontWall: boolean;
  showRightWall: boolean;
}

export interface LightingState {
  timeOfDay: number; // 0 to 24
  preset: 'day' | 'sunset' | 'night';
  indoorLightsOn: boolean;
  shadows: boolean;
}
