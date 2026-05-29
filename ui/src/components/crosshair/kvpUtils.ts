/**
 * Serialization/deserialization helpers that mirror the Lua KVP logic.
 * Used by property-based round-trip tests (Property 8).
 */

import type { CrosshairConfig, CrosshairColor, CrosshairStyle, CrosshairDisplayMode } from './types';
import { DEFAULT_CONFIG } from './constants';

/** KVP store type — maps string keys to string values, like ResourceKvp */
export type KvpStore = Record<string, string>;

/**
 * Serializes a CrosshairConfig into a KVP store.
 * Mirrors the Lua `SetResourceKvp` calls in the callbacks.
 */
export function saveCrosshairConfigToKvp(config: CrosshairConfig, kvp: KvpStore): void {
  kvp['mri_Qfps:CrosshairColor']   = JSON.stringify(config.color);
  kvp['mri_Qfps:CrosshairSize']    = String(config.size);
  kvp['mri_Qfps:CrosshairStyle']   = config.style;
  kvp['mri_Qfps:CrosshairEnabled'] = String(config.enabled);
  kvp['mri_Qfps:CrosshairDisplayMode'] = config.displayMode;
}

/**
 * Deserializes a CrosshairConfig from a KVP store.
 * Mirrors the Lua `loadCrosshairConfig()` function with the same fallback logic.
 */
export function loadCrosshairConfigFromKvp(kvp: KvpStore): CrosshairConfig {
  // Color — stored as JSON; fall back to white on parse failure
  let color: CrosshairColor = DEFAULT_CONFIG.color;
  const colorJson = kvp['mri_Qfps:CrosshairColor'];
  if (colorJson) {
    try {
      const parsed = JSON.parse(colorJson) as CrosshairColor;
      if (
        typeof parsed.r === 'number' &&
        typeof parsed.g === 'number' &&
        typeof parsed.b === 'number' &&
        typeof parsed.a === 'number'
      ) {
        color = parsed;
      }
    } catch {
      // corrupted JSON — use default
    }
  }

  // Size — numeric string; clamp to [4, 32]
  const rawSize = kvp['mri_Qfps:CrosshairSize'];
  const parsedSize = rawSize !== undefined ? Number(rawSize) : NaN;
  const size = isNaN(parsedSize)
    ? DEFAULT_CONFIG.size
    : Math.max(4, Math.min(32, parsedSize));

  // Style — string; default to 'dot'
  const validStyles: CrosshairStyle[] = ['dot', 'cross', 'circle'];
  const rawStyle = kvp['mri_Qfps:CrosshairStyle'] as CrosshairStyle | undefined;
  const style: CrosshairStyle =
    rawStyle && validStyles.includes(rawStyle) ? rawStyle : DEFAULT_CONFIG.style;

  // Enabled — boolean string; default to true
  const rawEnabled = kvp['mri_Qfps:CrosshairEnabled'];
  const enabled = rawEnabled === undefined ? DEFAULT_CONFIG.enabled : rawEnabled === 'true';

  // DisplayMode — string; default to 'always'
  const validDisplayModes: CrosshairDisplayMode[] = ['always', 'aiming'];
  const rawDisplayMode = kvp['mri_Qfps:CrosshairDisplayMode'] as CrosshairDisplayMode | undefined;
  const displayMode: CrosshairDisplayMode =
    rawDisplayMode && validDisplayModes.includes(rawDisplayMode) ? rawDisplayMode : DEFAULT_CONFIG.displayMode;

  return { color, size, style, enabled, displayMode };
}
