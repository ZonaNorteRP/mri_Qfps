import type { CrosshairColor, CrosshairConfig } from './types';


export const PRESET_COLORS: { label: string; color: CrosshairColor }[] = [
  { label: 'Branco',   color: { r: 255, g: 255, b: 255, a: 255 } },
  { label: 'Vermelho', color: { r: 255, g: 0,   b: 0,   a: 255 } },
  { label: 'Verde',    color: { r: 0,   g: 255, b: 0,   a: 255 } },
  { label: 'Amarelo',  color: { r: 255, g: 255, b: 0,   a: 255 } },
  { label: 'Ciano',    color: { r: 0,   g: 255, b: 255, a: 255 } },
];

export const DEFAULT_CONFIG: CrosshairConfig = {
  color:       { r: 255, g: 255, b: 255, a: 255 },
  size:        10,
  style:       'dot',
  enabled:     true,
  displayMode: 'always',
};
