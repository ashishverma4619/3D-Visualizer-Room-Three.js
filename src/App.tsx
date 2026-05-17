import React, { useState } from 'react';
import { FurnitureTemplate, PlacedFurniture, RoomConfig, LightingState } from './types';
import { ROOM_PRESETS } from './data/furnitureTemplates';
import { Sidebar } from './components/Sidebar';
import { RoomCanvas } from './components/RoomCanvas';
import { Toolbar } from './components/Toolbar';
import { ItemDetails } from './components/ItemDetails';

export const App: React.FC = () => {
  // Load initial preset 0 ("Cozy Living Room")
  const defaultPreset = ROOM_PRESETS[0];

  const [roomConfig, setRoomConfig] = useState<RoomConfig>(defaultPreset.config);
  const [items, setItems] = useState<PlacedFurniture[]>(defaultPreset.items);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [lightingState, setLightingState] = useState<LightingState>({
    timeOfDay: 14.5, // 2:30 PM bright afternoon light
    preset: 'day',
    indoorLightsOn: false,
    shadows: true
  });

  const [cameraView, setCameraView] = useState<'corner' | 'top' | 'front' | 'side'>('corner');

  // Add Item callback
  const handleAddItem = (template: FurnitureTemplate) => {
    // Basic scatter to prevent items piling up exactly on 0,0
    const scatterOffset = (items.length % 3) * 0.3 - 0.3;

    const newItem: PlacedFurniture = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: template.type,
      name: template.name,
      x: scatterOffset,
      y: template.type === 'rug' ? 0.005 : 0, // elevate rugs just slightly
      z: scatterOffset,
      rotation: 0,
      width: template.defaultWidth,
      height: template.defaultHeight,
      depth: template.defaultDepth,
      color: template.defaultColor,
      secondaryColor: template.secondaryColor
    };

    setItems(prev => [...prev, newItem]);
    // Auto-select newly added item
    setSelectedItemId(newItem.id);
  };

  // Update item properties
  const handleUpdateItem = (updated: PlacedFurniture) => {
    setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  // Duplicate specific item
  const handleDuplicateItem = (target: PlacedFurniture) => {
    const cloned: PlacedFurniture = {
      ...target,
      id: `item_${Date.now()}_clone`,
      name: `${target.name} (Copy)`,
      // Offset slightly to prevent complete overlay
      x: Math.min(roomConfig.width / 2 - 0.2, target.x + 0.4),
      z: Math.min(roomConfig.length / 2 - 0.2, target.z + 0.4)
    };

    setItems(prev => [...prev, cloned]);
    setSelectedItemId(cloned.id);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  // Load Preset Room layout
  const handleLoadPreset = (index: number) => {
    const preset = ROOM_PRESETS[index];
    if (!preset) return;
    setRoomConfig(preset.config);
    setItems(preset.items);
    setSelectedItemId(null);
  };

  // Clear entire room
  const handleClearScene = () => {
    setItems([]);
    setSelectedItemId(null);
  };

  const selectedItem = items.find(i => i.id === selectedItemId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
      {/* LEFT DRAWER: Navigation, Catalog, & Structural configuration */}
      <Sidebar
        roomConfig={roomConfig}
        onUpdateRoomConfig={setRoomConfig}
        items={items}
        onAddItem={handleAddItem}
        selectedItemId={selectedItemId}
        onSelectItem={setSelectedItemId}
        onDeleteItem={handleDeleteItem}
        lightingState={lightingState}
        onUpdateLighting={setLightingState}
        onLoadPreset={handleLoadPreset}
      />

      {/* MAIN VIEWPORT: 3D Scene layout */}
      <div className="flex-1 relative h-full min-w-0 flex flex-col">
        {/* Top-left Quick Preset Control Toolbar */}
        <Toolbar
          cameraView={cameraView}
          onChangeCameraView={setCameraView}
          onClearScene={handleClearScene}
          itemCount={items.length}
        />

        {/* Core WebGL Interactive Engine */}
        <div className="flex-1 w-full h-full relative">
          <RoomCanvas
            roomConfig={roomConfig}
            items={items}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            lightingState={lightingState}
            cameraView={cameraView}
          />
        </div>

        {/* RIGHT DRAWER OVERLAY: Individual Furniture Settings Knob */}
        <ItemDetails
          item={selectedItem}
          roomConfig={roomConfig}
          onUpdateItem={handleUpdateItem}
          onDuplicate={handleDuplicateItem}
          onDelete={handleDeleteItem}
          onClose={() => setSelectedItemId(null)}
        />

        {/* Quick status bar at bottom */}
        <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 shadow-xs pointer-events-none select-none">
          <div>
            Time: <span className="font-semibold text-slate-900">{Math.floor(lightingState.timeOfDay)}:00</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200"></div>
          <div>
            Lights: <span className="font-semibold text-slate-900">{lightingState.indoorLightsOn ? 'ON' : 'OFF'}</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200"></div>
          <div>
            Items: <span className="font-semibold text-slate-900">{items.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
