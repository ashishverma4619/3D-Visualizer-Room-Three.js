import React from 'react';
import { 
  Sofa, 
  Bed, 
  Armchair, 
  Table, 
  Tv, 
  Library, 
  TreePine, 
  Lamp, 
  Square, 
  Plus, 
  Trash2, 
  RotateCw, 
  Copy, 
  Sun, 
  Moon, 
  Sunset, 
  Eye, 
  Settings, 
  Sliders, 
  Package, 
  Camera, 
  RotateCcw, 
  Sparkles,
  Maximize2,
  Move,
  Layers
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name.toLowerCase()) {
    case 'sofa': return <Sofa className={className} />;
    case 'bed': return <Bed className={className} />;
    case 'armchair': return <Armchair className={className} />;
    case 'table': return <Table className={className} />;
    case 'tv': return <Tv className={className} />;
    case 'library': return <Library className={className} />;
    case 'tree': return <TreePine className={className} />;
    case 'lamp': return <Lamp className={className} />;
    case 'square': return <Square className={className} />;
    case 'plus': return <Plus className={className} />;
    case 'trash2': return <Trash2 className={className} />;
    case 'rotatecw': return <RotateCw className={className} />;
    case 'copy': return <Copy className={className} />;
    case 'sun': return <Sun className={className} />;
    case 'moon': return <Moon className={className} />;
    case 'sunset': return <Sunset className={className} />;
    case 'eye': return <Eye className={className} />;
    case 'settings': return <Settings className={className} />;
    case 'sliders': return <Sliders className={className} />;
    case 'package': return <Package className={className} />;
    case 'camera': return <Camera className={className} />;
    case 'rotateccw': return <RotateCcw className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'maximize2': return <Maximize2 className={className} />;
    case 'move': return <Move className={className} />;
    case 'layers': return <Layers className={className} />;
    default: return <Package className={className} />;
  }
};
