import React from 'react';
import { Icon } from './Icon';

interface ToolbarProps {
  cameraView: 'corner' | 'top' | 'front' | 'side';
  onChangeCameraView: (view: 'corner' | 'top' | 'front' | 'side') => void;
  onClearScene: () => void;
  itemCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  cameraView,
  onChangeCameraView,
  onClearScene,
  itemCount
}) => {
  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3 z-20 select-none">
      {/* Viewport Presets */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg">
        <button
          onClick={() => onChangeCameraView('corner')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
            cameraView === 'corner' 
              ? 'bg-white text-slate-800 shadow-xs font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="3D Corner View"
        >
          <Icon name="maximize2" className="w-3.5 h-3.5" />
          <span>3D View</span>
        </button>

        <button
          onClick={() => onChangeCameraView('top')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
            cameraView === 'top' 
              ? 'bg-white text-slate-800 shadow-xs font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Top Down Plan View"
        >
          <Icon name="square" className="w-3.5 h-3.5" />
          <span>Top</span>
        </button>

        <button
          onClick={() => onChangeCameraView('front')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
            cameraView === 'front' 
              ? 'bg-white text-slate-800 shadow-xs font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Front Wall Elevation"
        >
          <Icon name="tv" className="w-3.5 h-3.5" />
          <span>Front</span>
        </button>

        <button
          onClick={() => onChangeCameraView('side')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
            cameraView === 'side' 
              ? 'bg-white text-slate-800 shadow-xs font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Side Wall Elevation"
        >
          <Icon name="library" className="w-3.5 h-3.5" />
          <span>Side</span>
        </button>
      </div>

      <div className="h-4 w-[1px] bg-slate-200"></div>

      {/* Clear Scene */}
      <button
        onClick={onClearScene}
        disabled={itemCount === 0}
        className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        title="Remove all placed items"
      >
        <Icon name="rotateccw" className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Reset Items</span>
      </button>
    </div>
  );
};
