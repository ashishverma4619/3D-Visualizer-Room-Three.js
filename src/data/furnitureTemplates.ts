import { FurnitureTemplate } from '../types';

export const FURNITURE_TEMPLATES: FurnitureTemplate[] = [
  {
    type: 'sofa',
    name: 'Modern 3-Seater Sofa',
    category: 'seating',
    icon: 'Sofa',
    defaultWidth: 2.2,
    defaultHeight: 0.85,
    defaultDepth: 0.9,
    defaultColor: '#3b82f6', // bright blue
    secondaryColor: '#1e293b', // dark legs
    description: 'Comfortable fabric sofa with sturdy armrests and soft back support.'
  },
  {
    type: 'bed',
    name: 'Queen Size Bed',
    category: 'seating',
    icon: 'Bed',
    defaultWidth: 1.6,
    defaultHeight: 0.9,
    defaultDepth: 2.1,
    defaultColor: '#e2e8f0', // mattress/sheets
    secondaryColor: '#854d0e', // wooden frame
    description: 'Cozy queen bed with soft pillows and elegant headboard.'
  },
  {
    type: 'chair',
    name: 'Minimalist Dining Chair',
    category: 'seating',
    icon: 'Armchair',
    defaultWidth: 0.55,
    defaultHeight: 0.9,
    defaultDepth: 0.55,
    defaultColor: '#f59e0b', // orange fabric/plastic
    secondaryColor: '#334155', // metal legs
    description: 'Sleek chair perfect for work desks or dining tables.'
  },
  {
    type: 'table',
    name: 'Wooden Dining Table',
    category: 'surfaces',
    icon: 'Table',
    defaultWidth: 1.8,
    defaultHeight: 0.75,
    defaultDepth: 1.0,
    defaultColor: '#b45309', // natural oak
    secondaryColor: '#1c1917', // support frame
    description: 'Solid wood table suitable for four to six people.'
  },
  {
    type: 'tv_stand',
    name: 'Low Media Console & TV',
    category: 'surfaces',
    icon: 'Tv',
    defaultWidth: 1.8,
    defaultHeight: 1.1, // includes TV height
    defaultDepth: 0.45,
    defaultColor: '#1f2937', // dark grey cabinet
    secondaryColor: '#030712', // black TV screen
    description: 'Modern low-profile entertainment unit with integrated widescreen monitor.'
  },
  {
    type: 'bookshelf',
    name: 'Tall Bookcase',
    category: 'storage',
    icon: 'Library',
    defaultWidth: 1.0,
    defaultHeight: 1.9,
    defaultDepth: 0.35,
    defaultColor: '#475569', // frame
    secondaryColor: '#cbd5e1', // inner shelf back
    description: 'Multi-tiered storage rack for books, boxes, and home accessories.'
  },
  {
    type: 'plant',
    name: 'Potted Fiddle Leaf Fig',
    category: 'decor',
    icon: 'Tree',
    defaultWidth: 0.5,
    defaultHeight: 1.3,
    defaultDepth: 0.5,
    defaultColor: '#15803d', // lush green leaves
    secondaryColor: '#d97706', // terracotta pot
    description: 'Fresh indoor plant to bring vivid vitality to room corners.'
  },
  {
    type: 'lamp',
    name: 'Elegant Floor Lamp',
    category: 'decor',
    icon: 'Lamp',
    defaultWidth: 0.4,
    defaultHeight: 1.7,
    defaultDepth: 0.4,
    defaultColor: '#fbbf24', // golden yellow warm glow/shade
    secondaryColor: '#475569', // metallic pole
    description: 'Tall accent light that casts soft ambient illumination.'
  },
  {
    type: 'rug',
    name: 'Geometric Area Rug',
    category: 'decor',
    icon: 'Square',
    defaultWidth: 2.5,
    defaultHeight: 0.02,
    defaultDepth: 1.8,
    defaultColor: '#94a3b8', // subtle slate grey
    secondaryColor: '#f1f5f9', // pattern details
    description: 'Soft woven carpet to bind furniture arrangements together.'
  }
];

export const ROOM_PRESETS = [
  {
    name: 'Cozy Living Room',
    config: {
      width: 6,
      length: 5,
      wallHeight: 2.8,
      wallColor: '#f8fafc',
      floorColor: '#d97706',
      floorStyle: 'wood' as const,
      showFrontWall: false,
      showRightWall: false,
    },
    items: [
      {
        id: '1',
        type: 'sofa' as const,
        name: 'Modern 3-Seater Sofa',
        x: 0,
        y: 0,
        z: 0.8,
        rotation: 0,
        width: 2.2,
        height: 0.85,
        depth: 0.9,
        color: '#0284c7', // cool sea blue
        secondaryColor: '#0f172a'
      },
      {
        id: '2',
        type: 'tv_stand' as const,
        name: 'Low Media Console & TV',
        x: 0,
        y: 0,
        z: -2.0,
        rotation: Math.PI,
        width: 1.8,
        height: 1.1,
        depth: 0.45,
        color: '#334155',
        secondaryColor: '#030712'
      },
      {
        id: '3',
        type: 'rug' as const,
        name: 'Geometric Area Rug',
        x: 0,
        y: 0.005,
        z: -0.5,
        rotation: 0,
        width: 2.5,
        height: 0.02,
        depth: 1.8,
        color: '#e2e8f0'
      },
      {
        id: '4',
        type: 'plant' as const,
        name: 'Potted Fiddle Leaf Fig',
        x: -2.4,
        y: 0,
        z: -2.0,
        rotation: 0,
        width: 0.5,
        height: 1.3,
        depth: 0.5,
        color: '#16a34a',
        secondaryColor: '#b45309'
      },
      {
        id: '5',
        type: 'lamp' as const,
        name: 'Elegant Floor Lamp',
        x: 2.3,
        y: 0,
        z: -2.1,
        rotation: 0,
        width: 0.4,
        height: 1.7,
        depth: 0.4,
        color: '#facc15',
        secondaryColor: '#475569'
      },
      {
        id: '6',
        type: 'bookshelf' as const,
        name: 'Tall Bookcase',
        x: -2.5,
        y: 0,
        z: 0.5,
        rotation: Math.PI / 2,
        width: 1.0,
        height: 1.9,
        depth: 0.35,
        color: '#64748b',
        secondaryColor: '#f1f5f9'
      }
    ]
  },
  {
    name: 'Comfortable Bedroom',
    config: {
      width: 4.5,
      length: 5,
      wallHeight: 2.7,
      wallColor: '#ede9fe', // soft violet tint
      floorColor: '#e2e8f0', // carpet tint
      floorStyle: 'carpet' as const,
      showFrontWall: false,
      showRightWall: false,
    },
    items: [
      {
        id: 'bed-1',
        type: 'bed' as const,
        name: 'Queen Size Bed',
        x: 0,
        y: 0,
        z: -1.2,
        rotation: 0, // facing forward
        width: 1.6,
        height: 0.9,
        depth: 2.1,
        color: '#c084fc', // purple bedsheets
        secondaryColor: '#581c87' // dark base
      },
      {
        id: 'chair-1',
        type: 'chair' as const,
        name: 'Minimalist Dining Chair',
        x: 1.5,
        y: 0,
        z: 1.2,
        rotation: -Math.PI / 4,
        width: 0.55,
        height: 0.9,
        depth: 0.55,
        color: '#f43f5e', // rose color
        secondaryColor: '#1e293b'
      },
      {
        id: 'rug-1',
        type: 'rug' as const,
        name: 'Geometric Area Rug',
        x: 0,
        y: 0.005,
        z: 0.5,
        rotation: Math.PI / 2,
        width: 2.2,
        height: 0.02,
        depth: 1.6,
        color: '#f8fafc'
      },
      {
        id: 'lamp-1',
        type: 'lamp' as const,
        name: 'Elegant Floor Lamp',
        x: -1.2,
        y: 0,
        z: -2.0,
        rotation: 0,
        width: 0.4,
        height: 1.7,
        depth: 0.4,
        color: '#fde047',
        secondaryColor: '#334155'
      }
    ]
  },
  {
    name: 'Empty Room Studio',
    config: {
      width: 5,
      length: 5,
      wallHeight: 3.0,
      wallColor: '#f1f5f9',
      floorColor: '#cbd5e1',
      floorStyle: 'tile' as const,
      showFrontWall: false,
      showRightWall: false,
    },
    items: []
  }
];
