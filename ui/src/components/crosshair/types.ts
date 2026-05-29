export interface CrosshairColor {
  r: number; // 0–255
  g: number;
  b: number;
  a: number;
}

export type CrosshairStyle = 'dot' | 'cross' | 'circle';

export type CrosshairDisplayMode = 'always' | 'aiming';

export interface CrosshairConfig {
  color: CrosshairColor;
  size: number; // 4–32 px
  style: CrosshairStyle;
  enabled: boolean;
  displayMode: CrosshairDisplayMode;
}
