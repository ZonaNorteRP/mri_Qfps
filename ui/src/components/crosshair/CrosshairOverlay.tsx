import { useState } from 'react';
import { useNuiEvent } from '../../utils/useNuiEvent';
import type { CrosshairConfig } from './types';

export interface CrosshairOverlayProps {
  config: CrosshairConfig;
  preview?: boolean;
}

function colorToCss(config: CrosshairConfig): string {
  const { r, g, b, a } = config.color;
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

export default function CrosshairOverlay({ config, preview = false }: CrosshairOverlayProps) {
  const [aiming, setAiming] = useState(false);

  useNuiEvent<{ aiming: boolean }>('setAiming', (data) => {
    setAiming(data.aiming);
  });

  const { size, style, enabled, displayMode } = config;
  const color = colorToCss(config);

  // Visibility logic:
  // - preview mode: always render (ignore displayMode and aiming)
  // - enabled === false: never render
  // - displayMode === 'always': render whenever enabled
  // - displayMode === 'aiming': render only when enabled AND aiming
  if (preview) {
    // fall through to render
  } else if (!enabled) {
    return null;
  } else if (displayMode === 'aiming' && !aiming) {
    return null;
  }

  const baseStyle: React.CSSProperties = preview
    ? {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
      };

  if (style === 'dot') {
    return (
      <div
        data-testid="crosshair-overlay"
        data-style="dot"
        style={{
          ...baseStyle,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    );
  }

  if (style === 'cross') {
    const thickness = Math.max(1, Math.round(size / 5));
    return (
      <div
        data-testid="crosshair-overlay"
        data-style="cross"
        style={{
          ...baseStyle,
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Horizontal bar */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: `${thickness}px`,
            transform: 'translateY(-50%)',
            backgroundColor: color,
          }}
        />
        {/* Vertical bar */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: `${thickness}px`,
            height: '100%',
            transform: 'translateX(-50%)',
            backgroundColor: color,
          }}
        />
      </div>
    );
  }

  // circle
  const borderWidth = Math.max(1, Math.round(size / 8));
  return (
    <div
      data-testid="crosshair-overlay"
      data-style="circle"
      style={{
        ...baseStyle,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `${borderWidth}px solid ${color}`,
        backgroundColor: 'transparent',
      }}
    />
  );
}
