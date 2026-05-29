import { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { useNuiEvent } from '../../utils/useNuiEvent';
import { useCrosshairOverlay } from '../../providers/CrosshairOverlayProvider';
import type { CrosshairConfig, CrosshairColor, CrosshairDisplayMode } from './types';
import { DEFAULT_CONFIG } from './constants';
import ColorPicker from './ColorPicker';
import SizeSlider from './SizeSlider';
import StylePicker from './StylePicker';
import CrosshairPreview from './CrosshairPreview';
import EnableToggle from './EnableToggle';
import DisplayModePicker from './DisplayModePicker';

export default function CrosshairSection() {
  const { setOverlayConfig } = useCrosshairOverlay();

  const [appliedConfig, setAppliedConfig] = useState<CrosshairConfig>(DEFAULT_CONFIG);
  const [pendingConfig, setPendingConfig] = useState<CrosshairConfig>(DEFAULT_CONFIG);

  useNuiEvent<CrosshairConfig>('loadCrosshairConfig', (config) => {
    setAppliedConfig(config);
    setPendingConfig(config);
    setOverlayConfig(config);
  });

  const handleColorChange = async (color: CrosshairColor) => {
    const newApplied = { ...appliedConfig, color };
    setAppliedConfig(newApplied);
    setPendingConfig((prev) => ({ ...prev, color }));
    setOverlayConfig(newApplied);
    await fetchNui('setCrosshairColor', color);
  };

  const handleSizeChange = (size: number) => {
    setPendingConfig((prev) => ({ ...prev, size }));
  };

  const handleStyleChange = (style: CrosshairConfig['style']) => {
    setPendingConfig((prev) => ({ ...prev, style }));
  };

  const handleDisplayModeChange = (displayMode: CrosshairDisplayMode) => {
    setPendingConfig((prev) => ({ ...prev, displayMode }));
  };

  const handleToggleEnabled = async (enabled: boolean) => {
    const newApplied = { ...appliedConfig, enabled };
    setAppliedConfig(newApplied);
    setPendingConfig((prev) => ({ ...prev, enabled }));
    setOverlayConfig(newApplied);
    await fetchNui('setCrosshairEnabled', { enabled });
  };

  const handleApply = async () => {
    const newApplied = {
      ...appliedConfig,
      size: pendingConfig.size,
      style: pendingConfig.style,
      displayMode: pendingConfig.displayMode,
    };
    setAppliedConfig(newApplied);
    setOverlayConfig(newApplied);
    await fetchNui('setCrosshairConfig', {
      size: pendingConfig.size,
      style: pendingConfig.style,
      displayMode: pendingConfig.displayMode,
    });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
        Configuração de Mira
      </h2>

      <EnableToggle value={pendingConfig.enabled} onChange={handleToggleEnabled} />

      <CrosshairPreview config={pendingConfig} />

      <div className="space-y-2">
        <span className="text-xs text-neutral-400 pl-1">Modo de Exibição</span>
        <DisplayModePicker value={pendingConfig.displayMode} onChange={handleDisplayModeChange} />
      </div>

      <div className="space-y-2">
        <span className="text-xs text-neutral-400 pl-1">Cor</span>
        <ColorPicker value={pendingConfig.color} onChange={handleColorChange} />
      </div>

      <SizeSlider value={pendingConfig.size} onChange={handleSizeChange} />

      <div className="space-y-2">
        <span className="text-xs text-neutral-400 pl-1">Estilo</span>
        <StylePicker value={pendingConfig.style} onChange={handleStyleChange} />
      </div>

      <button
        onClick={handleApply}
        className="w-full h-11 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] hover:border-[#3B82F6]/50 text-[#3B82F6] font-bold text-xs tracking-widest rounded-xl transition-all"
      >
        APLICAR MIRA
      </button>
    </div>
  );
}
