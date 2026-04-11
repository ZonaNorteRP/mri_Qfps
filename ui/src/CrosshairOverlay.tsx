import { useState } from 'react';
import { useNuiEvent } from './utils/useNuiEvent';

interface CrosshairStyle {
  size: number;
  thickness: number;
  gap: number;
  dot: boolean;
  color_r: number;
  color_g: number;
  color_b: number;
  alpha: number;
  outline: boolean;
  outlineThickness: number;
}

const DEFAULT_STYLE: CrosshairStyle = {
  size: 5, thickness: 1, gap: 0, dot: false,
  color_r: 50, color_g: 250, color_b: 50,
  alpha: 200, outline: false, outlineThickness: 1,
};

/**
 * Always-on crosshair overlay rendered via pure CSS.
 * Lives outside VisibilityProvider so it persists when menu is closed.
 * Show/hide is controlled by Lua aiming detection thread.
 * 0.00ms resmon — no JS loops, no requestAnimationFrame.
 */
export function CrosshairOverlay() {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<CrosshairStyle>(DEFAULT_STYLE);

  useNuiEvent('showCrosshair', () => setVisible(true));
  useNuiEvent('hideCrosshair', () => setVisible(false));
  useNuiEvent<CrosshairStyle>('updateCrosshairStyle', (data) => {
    if (data) setStyle(data);
  });

  if (!visible) return null;

  // ─── Pixel calculations (Matching SVG Preview in App.tsx) ───
  const scale = 3;
  const lineLen = Math.max(style.size * scale, 1);
  const thick = Math.max(style.thickness * scale * 0.6, 0.5);
  
  // Calculate gap exactly like the preview to prevent inverted lines on negative gaps
  const rawGap = style.gap * scale * 0.5;
  const gapDist = rawGap < 0 ? Math.max(0, thick / 2 + rawGap) : thick / 2 + rawGap;
  const outlinePx = style.outline ? style.outlineThickness * scale * 0.5 : 0;

  const color = `rgba(${style.color_r}, ${style.color_g}, ${style.color_b}, ${style.alpha / 255})`;
  
  const outlineShadow = outlinePx > 0
    ? `0 0 0 ${outlinePx}px rgba(0,0,0,${style.alpha / 255})`
    : 'none';

  // Each line positioned from the center of the screen
  const lines: { top?: string; bottom?: string; left?: string; right?: string; width: string; height: string }[] = [
    // Top line
    {
      left: '50%',
      bottom: `calc(50% + ${gapDist}px)`,
      width: `${thick}px`,
      height: `${lineLen}px`,
    },
    // Bottom line
    {
      left: '50%',
      top: `calc(50% + ${gapDist}px)`,
      width: `${thick}px`,
      height: `${lineLen}px`,
    },
    // Left line
    {
      top: '50%',
      right: `calc(50% + ${gapDist}px)`,
      width: `${lineLen}px`,
      height: `${thick}px`,
    },
    // Right line
    {
      top: '50%',
      left: `calc(50% + ${gapDist}px)`,
      width: `${lineLen}px`,
      height: `${thick}px`,
    },
  ];

  // Transform to center each line on its axis
  const transforms = [
    'translateX(-50%)',  // top
    'translateX(-50%)',  // bottom
    'translateY(-50%)',  // left
    'translateY(-50%)',  // right
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9999,
    }}>
      {lines.map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          background: color,
          boxShadow: outlineShadow,
          transform: transforms[i],
          ...pos,
        }} />
      ))}

      {/* Center dot */}
      {style.dot && (
        <div style={{
          position: 'absolute',
          width: `${thick + 1}px`,
          height: `${thick + 1}px`,
          background: color,
          boxShadow: outlineShadow,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
        }} />
      )}
    </div>
  );
}
