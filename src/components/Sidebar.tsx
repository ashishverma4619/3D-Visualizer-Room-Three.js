import React, { useState } from 'react';
import { FurnitureTemplate, PlacedFurniture, RoomConfig, LightingState } from '../types';
import { FURNITURE_TEMPLATES, ROOM_PRESETS } from '../data/furnitureTemplates';
import { Icon } from './Icon';

interface SidebarProps {
  roomConfig: RoomConfig;
  onUpdateRoomConfig: (config: RoomConfig) => void;
  items: PlacedFurniture[];
  onAddItem: (template: FurnitureTemplate) => void;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onDeleteItem: (id: string) => void;
  lightingState: LightingState;
  onUpdateLighting: (state: LightingState) => void;
  onLoadPreset: (presetIndex: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  roomConfig,
  onUpdateRoomConfig,
  items,
  onAddItem,
  selectedItemId,
  onSelectItem,
  onDeleteItem,
  lightingState,
  onUpdateLighting,
  onLoadPreset
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'list' | 'room' | 'lighting'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seating' | 'surfaces' | 'storage' | 'decor'>('all');

  const filteredCatalog = selectedCategory === 'all' 
    ? FURNITURE_TEMPLATES 
    : FURNITURE_TEMPLATES.filter(t => t.category === selectedCategory);

  // Helper to format simulated time
  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m < 10 ? '0' : ''}${m} ${ampm}`;
  };

  // Adjust time presets
  const applyTimePreset = (preset: 'day' | 'sunset' | 'night') => {
    let t = 12; // default day
    if (preset === 'sunset') t = 18.2;
    if (preset === 'night') t = 22;

    onUpdateLighting({
      ...lightingState,
      timeOfDay: t,
      preset,
      // Auto turn on lights at night
      indoorLightsOn: preset === 'night' || preset === 'sunset' ? true : lightingState.indoorLightsOn
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    let preset: 'day' | 'sunset' | 'night' = 'day';
    if ((t >= 5 && t < 7) || (t > 17 && t <= 19)) preset = 'sunset';
    else if (t < 5.5 || t > 18.5) preset = 'night';

    onUpdateLighting({
      ...lightingState,
      timeOfDay: t,
      preset
    });
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none shadow-sm z-10">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
            <Icon name="sparkles" className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm leading-tight">3D Room Studio</h1>
            <p className="text-[10px] text-slate-500">Geometry & Lighting Planner</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-100">
          v1.0
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-200 text-center text-xs font-medium bg-slate-50/80">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-2.5 border-b-2 transition-colors flex flex-col items-center gap-1 ${
            activeTab === 'catalog' 
              ? 'border-blue-600 text-blue-600 bg-white font-semibold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Furniture Catalog"
        >
          <Icon name="package" className="w-4 h-4" />
          <span className="text-[10px]">Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`py-2.5 border-b-2 transition-colors flex flex-col items-center gap-1 relative ${
            activeTab === 'list' 
              ? 'border-blue-600 text-blue-600 bg-white font-semibold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Placed Furniture List"
        >
          <Icon name="layers" className="w-4 h-4" />
          <span className="text-[10px]">Placed</span>
          {items.length > 0 && (
            <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-slate-800 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {items.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('room')}
          className={`py-2.5 border-b-2 transition-colors flex flex-col items-center gap-1 ${
            activeTab === 'room' 
              ? 'border-blue-600 text-blue-600 bg-white font-semibold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Room Structural Setup"
        >
          <Icon name="sliders" className="w-4 h-4" />
          <span className="text-[10px]">Room</span>
        </button>

        <button
          onClick={() => setActiveTab('lighting')}
          className={`py-2.5 border-b-2 transition-colors flex flex-col items-center gap-1 ${
            activeTab === 'lighting' 
              ? 'border-blue-600 text-blue-600 bg-white font-semibold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Environment Lighting"
        >
          <Icon name="sun" className="w-4 h-4" />
          <span className="text-[10px]">Lights</span>
        </button>
      </div>

      {/* Drawer Body content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
              {(['all', 'seating', 'surfaces', 'storage', 'decor'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all flex-1 text-center ${
                    selectedCategory === cat 
                      ? 'bg-white text-slate-800 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 italic px-1">
              Click an item to drop it into the room view.
            </p>

            {/* Template Card Listing */}
            <div className="space-y-2.5">
              {filteredCatalog.map((template) => (
                <div 
                  key={template.name}
                  className="p-3 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all flex items-start gap-3 group"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${template.defaultColor}15`, color: template.defaultColor }}
                  >
                    <Icon name={template.icon} className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-800 truncate">{template.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {template.defaultWidth}m × {template.defaultDepth}m
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddItem(template)}
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors mt-0.5 shrink-0"
                    title="Add to Scene"
                  >
                    <Icon name="plus" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PLACED ITEMS LIST */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Placed Items</span>
              <span className="text-[11px] text-slate-400">{items.length} total</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Icon name="layers" className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">Your room is empty</p>
                <p className="text-[11px] text-slate-400 mt-1">Go to the Catalog tab to drop furniture items.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => {
                  const isSelected = item.id === selectedItemId;
                  // Template metadata
                  const template = FURNITURE_TEMPLATES.find(t => t.type === item.type);

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/40 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${item.color}20`, color: item.color }}
                        >
                          <Icon name={template?.icon || 'package'} className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            Pos: {item.x.toFixed(1)}m, {item.z.toFixed(1)}m
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                        title="Delete Item"
                      >
                        <Icon name="trash2" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ROOM SETUP */}
        {activeTab === 'room' && (
          <div className="space-y-5">
            {/* Template Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Quick Theme Presets</label>
              <div className="grid grid-cols-1 gap-2">
                {ROOM_PRESETS.map((preset, index) => (
                  <button
                    key={preset.name}
                    onClick={() => onLoadPreset(index)}
                    className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-medium text-slate-700 hover:text-blue-700 transition-colors flex items-center justify-between"
                  >
                    <span>{preset.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-white rounded text-slate-500 border border-slate-100">
                      Load
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Width and Length sliders */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Room Dimensions</label>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Width (X-axis)</span>
                  <span className="font-semibold text-slate-800">{roomConfig.width}m</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={roomConfig.width}
                  onChange={(e) => onUpdateRoomConfig({ ...roomConfig, width: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Length (Z-axis)</span>
                  <span className="font-semibold text-slate-800">{roomConfig.length}m</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={roomConfig.length}
                  onChange={(e) => onUpdateRoomConfig({ ...roomConfig, length: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Ceiling Height</span>
                  <span className="font-semibold text-slate-800">{roomConfig.wallHeight}m</span>
                </div>
                <input
                  type="range"
                  min="2.2"
                  max="5.0"
                  step="0.1"
                  value={roomConfig.wallHeight}
                  onChange={(e) => onUpdateRoomConfig({ ...roomConfig, wallHeight: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Colors and Textures */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Materials & Surfaces</label>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Wall Paint Color</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={roomConfig.wallColor}
                    onChange={(e) => onUpdateRoomConfig({ ...roomConfig, wallColor: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono uppercase text-slate-400">{roomConfig.wallColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Floor Base Tone</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={roomConfig.floorColor}
                    onChange={(e) => onUpdateRoomConfig({ ...roomConfig, floorColor: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-mono uppercase text-slate-400">{roomConfig.floorColor}</span>
                </div>
              </div>

              <div>
                <span className="block text-xs text-slate-600 mb-1.5">Floor Material Finish</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['wood', 'carpet', 'tile', 'concrete'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => onUpdateRoomConfig({ ...roomConfig, floorStyle: style })}
                      className={`px-2 py-1.5 rounded-md text-xs capitalize text-center font-medium border transition-colors ${
                        roomConfig.floorStyle === style 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Visibility flags */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-700">Viewport Enclosure</label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roomConfig.showFrontWall}
                  onChange={(e) => onUpdateRoomConfig({ ...roomConfig, showFrontWall: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600"
                />
                <span className="text-xs text-slate-700">Render Front Wall (Near camera)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roomConfig.showRightWall}
                  onChange={(e) => onUpdateRoomConfig({ ...roomConfig, showRightWall: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600"
                />
                <span className="text-xs text-slate-700">Render Right Side Wall</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: LIGHTING */}
        {activeTab === 'lighting' && (
          <div className="space-y-5">
            {/* Quick Preset switches */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2.5">Time of Day Simulation</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => applyTimePreset('day')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    lightingState.preset === 'day' 
                      ? 'border-amber-400 bg-amber-50/50 text-amber-800 font-semibold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon name="sun" className="w-4 h-4 text-amber-500" />
                  <span className="text-xs">Noon</span>
                </button>

                <button
                  onClick={() => applyTimePreset('sunset')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    lightingState.preset === 'sunset' 
                      ? 'border-orange-400 bg-orange-50/50 text-orange-800 font-semibold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon name="sunset" className="w-4 h-4 text-orange-500" />
                  <span className="text-xs">Sunset</span>
                </button>

                <button
                  onClick={() => applyTimePreset('night')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    lightingState.preset === 'night' 
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-900 font-semibold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon name="moon" className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs">Night</span>
                </button>
              </div>
            </div>

            {/* Time Slider */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Hour Slider</span>
                <span className="font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {formatTime(lightingState.timeOfDay)}
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max="24"
                step="0.1"
                value={lightingState.timeOfDay}
                onChange={handleTimeChange}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              
              <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                <span>Midnight</span>
                <span>Sunrise</span>
                <span>Noon</span>
                <span>Sunset</span>
                <span>Midnight</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Indoor fixtures switch */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Interior Electricals</label>
              
              <div 
                onClick={() => onUpdateLighting({ ...lightingState, indoorLightsOn: !lightingState.indoorLightsOn })}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${lightingState.indoorLightsOn ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon name="lamp" className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Ceiling & Lamps</p>
                    <p className="text-[10px] text-slate-400">Indoor spots and glow objects</p>
                  </div>
                </div>

                {/* Switch visual */}
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${lightingState.indoorLightsOn ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${lightingState.indoorLightsOn ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div 
                onClick={() => onUpdateLighting({ ...lightingState, shadows: !lightingState.shadows })}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${lightingState.shadows ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon name="sun" className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Cast Geometry Shadows</p>
                    <p className="text-[10px] text-slate-400">Soft realistic shadows</p>
                  </div>
                </div>

                {/* Switch visual */}
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${lightingState.shadows ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${lightingState.shadows ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Hint */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
        Created using <span className="font-semibold text-slate-700">Three.js</span> geometries
      </div>
    </div>
  );
};
