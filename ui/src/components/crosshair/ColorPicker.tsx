import type { CrosshairColor } from './types';
import { PRESET_COLORS } from './constants';

interface ColorPickerProps {
  value: CrosshairColor;
  onChange: (color: CrosshairColor) => void;
}

function colorsEqual(a: CrosshairColor, b: CrosshairColor): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESET_COLORS.map((preset) => {
        const isActive = colorsEqual(value, preset.color);
        const { r, g, b } = preset.color;
        const bgColor = `rgb(${r}, ${g}, ${b})`;

        return (
          <button
            key={preset.label}
            role="button"
            title={preset.label}
            onClick={() => onChange(preset.color)}
            className={`w-8 h-8 rounded-lg transition-all border-2 ${
              isActive
                ? 'ring-2 ring-[#3B82F6] ring-offset-2 ring-offset-[#141414] border-transparent scale-110'
                : 'border-[#333333] hover:border-[#555555] hover:scale-105'
            }`}
            style={{ backgroundColor: bgColor }}
            aria-label={preset.label}
            aria-pressed={isActive}
          />
        );
      })}
    </div>
  );
}
