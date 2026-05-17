import React from 'react';
import { PlacedFurniture, RoomConfig } from '../types';
import { FURNITURE_TEMPLATES } from '../data/furnitureTemplates';
import { Icon } from './Icon';

interface ItemDetailsProps {
  item: PlacedFurniture | null;
  roomConfig: RoomConfig;
  onUpdateItem: (updated: PlacedFurniture) => void;
  onDuplicate: (item: PlacedFurniture) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({
  item,
  roomConfig,
  onUpdateItem,
  onDuplicate,
  onDelete,
  onClose
}) => {
  if (!item) return null;

  const template = FURNITURE_TEMPLATES.find(t => t.type === item.type);

  // Convert radian rotation to degrees for intuitive sliding
  const rotationDeg = Math.round((item.rotation * 180) / Math.PI) % 360;
  const normalizedDeg = rotationDeg < 0 ? rotationDeg + 360 : rotationDeg;

  const handleRotateDeg = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    onUpdateItem({ ...item, rotation: rad });
  };

  const handleRotateIncrement = (deltaDeg: number) => {
    const newDeg = (normalizedDeg + deltaDeg) % 360;
    handleRotateDeg(newDeg);
  };

  // Safe clamping bounds
  const maxX = roomConfig.width / 2 - 0.1;
  const maxZ = roomConfig.length / 2 - 0.1;

  return (
    <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl flex flex-col z-30 select-none overflow-hidden max-h-[calc(100%-2rem)] animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Drawer Header */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${item.color}20`, color: item.color }}
          >
            <Icon name={template?.icon || 'package'} className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-800 truncate">{item.name}</h3>
            <span className="text-[10px] text-slate-500 capitalize">{template?.category || item.type}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition-colors"
          title="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Body Options */}
      <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar text-xs">
        {/* Position Setup */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Icon name="move" className="w-3.5 h-3.5 text-blue-500" />
              <span>Placement Coordinates</span>
            </span>
            <button
              onClick={() => onUpdateItem({ ...item, x: 0, z: 0, y: 0 })}
              className="text-[10px] text-blue-600 hover:underline font-normal"
            >
              Center Item
            </button>
          </div>

          {/* X coordinate slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Left / Right (X)</span>
              <span className="font-mono text-slate-800">{item.x.toFixed(2)}m</span>
            </div>
            <input
              type="range"
              min={-maxX}
              max={maxX}
              step="0.05"
              value={item.x}
              onChange={(e) => onUpdateItem({ ...item, x: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Z coordinate slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Front / Back (Z)</span>
              <span className="font-mono text-slate-800">{item.z.toFixed(2)}m</span>
            </div>
            <input
              type="range"
              min={-maxZ}
              max={maxZ}
              step="0.05"
              value={item.z}
              onChange={(e) => onUpdateItem({ ...item, z: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Y coordinate elevation */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Elevation (Y)</span>
              <span className="font-mono text-slate-800">{item.y.toFixed(2)}m</span>
            </div>
            <input
              type="range"
              min="0"
              max={roomConfig.wallHeight - item.height}
              step="0.05"
              value={item.y}
              onChange={(e) => onUpdateItem({ ...item, y: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Orientation Rotation */}
        <div className="space-y-2.5">
          <span className="block font-semibold text-slate-700">Rotation Angle</span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRotateIncrement(-45)}
              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700 flex-1 font-medium"
            >
              -45°
            </button>
            <button
              onClick={() => handleRotateIncrement(45)}
              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700 flex-1 font-medium"
            >
              +45°
            </button>
            <button
              onClick={() => handleRotateIncrement(90)}
              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700 flex-1 font-medium"
            >
              +90°
            </button>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1 mt-2">
              <span className="text-slate-500">Angle Slider</span>
              <span className="font-mono text-slate-800">{normalizedDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              step="1"
              value={normalizedDeg}
              onChange={(e) => handleRotateDeg(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Customization Colors */}
        <div className="space-y-2.5">
          <span className="block font-semibold text-slate-700">Custom Colors</span>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block text-[10px] text-slate-500 mb-1">Primary Material</span>
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => onUpdateItem({ ...item, color: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0 bg-transparent shrink-0"
                />
                <span className="text-[10px] font-mono text-slate-600 uppercase truncate">{item.color}</span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] text-slate-500 mb-1">Accent / Base</span>
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <input
                  type="color"
                  value={item.secondaryColor || '#334155'}
                  onChange={(e) => onUpdateItem({ ...item, secondaryColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0 bg-transparent shrink-0"
                />
                <span className="text-[10px] font-mono text-slate-600 uppercase truncate">
                  {item.secondaryColor || '#334155'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Curated Color Palette pills */}
          <div className="pt-1">
            <span className="block text-[10px] text-slate-400 mb-1">Preset Themes</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                '#8b5cf6', '#ec4899', '#64748b', '#1e293b', '#f8fafc'
              ].map((hex) => (
                <button
                  key={hex}
                  onClick={() => onUpdateItem({ ...item, color: hex })}
                  className="w-5 h-5 rounded-full border border-slate-300/60 shadow-2xs hover:scale-110 transition-transform"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Stretch Dimensions */}
        <div className="space-y-2">
          <span className="block font-semibold text-slate-700">Scaling Overrides</span>
          
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
              <span>Width: {item.width.toFixed(2)}m</span>
              <span>Depth: {item.depth.toFixed(2)}m</span>
              <span>Height: {item.height.toFixed(2)}m</span>
            </div>
          </div>

          {/* Scale Sliders */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-slate-400 w-10">Width</span>
              <input
                type="range"
                min={template ? template.defaultWidth * 0.5 : 0.2}
                max={template ? template.defaultWidth * 2.0 : 3.0}
                step="0.05"
                value={item.width}
                onChange={(e) => onUpdateItem({ ...item, width: parseFloat(e.target.value) })}
                className="flex-1 accent-slate-600 h-1 bg-slate-100 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-slate-400 w-10">Depth</span>
              <input
                type="range"
                min={template ? template.defaultDepth * 0.5 : 0.2}
                max={template ? template.defaultDepth * 2.0 : 3.0}
                step="0.05"
                value={item.depth}
                onChange={(e) => onUpdateItem({ ...item, depth: parseFloat(e.target.value) })}
                className="flex-1 accent-slate-600 h-1 bg-slate-100 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-slate-400 w-10">Height</span>
              <input
                type="range"
                min={template ? template.defaultHeight * 0.5 : 0.2}
                max={template ? template.defaultHeight * 2.0 : 3.0}
                step="0.05"
                value={item.height}
                onChange={(e) => onUpdateItem({ ...item, height: parseFloat(e.target.value) })}
                className="flex-1 accent-slate-600 h-1 bg-slate-100 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onDuplicate(item)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5"
            title="Duplicate object alongside"
          >
            <Icon name="copy" className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="px-3 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Icon name="trash2" className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
