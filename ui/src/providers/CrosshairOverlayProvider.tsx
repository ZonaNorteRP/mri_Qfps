import React, { createContext, useContext, useState } from 'react';
import { useNuiEvent } from '../utils/useNuiEvent';
import CrosshairOverlay from '../components/crosshair/CrosshairOverlay';
import type { CrosshairConfig } from '../components/crosshair/types';
import { DEFAULT_CONFIG } from '../components/crosshair/constants';

interface CrosshairOverlayContextValue {
  setOverlayConfig: (config: CrosshairConfig) => void;
}

const CrosshairOverlayCtx = createContext<CrosshairOverlayContextValue>({
  setOverlayConfig: () => {},
});

export const CrosshairOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<CrosshairConfig>(DEFAULT_CONFIG);

  // Listen for loadCrosshairConfig sent by Lua on init
  useNuiEvent<CrosshairConfig>('loadCrosshairConfig', (incoming) => {
    setConfig(incoming);
  });

  // Listen for setCrosshairEnabled sent by Lua when toggle changes
  useNuiEvent<{ enabled: boolean }>('setCrosshairEnabled', ({ enabled }) => {
    setConfig((prev) => ({ ...prev, enabled }));
  });

  return (
    <CrosshairOverlayCtx.Provider value={{ setOverlayConfig: setConfig }}>
      {/* Overlay is always mounted outside the visibility-controlled container */}
      <CrosshairOverlay config={config} />
      {children}
    </CrosshairOverlayCtx.Provider>
  );
};

export const useCrosshairOverlay = () => useContext(CrosshairOverlayCtx);
