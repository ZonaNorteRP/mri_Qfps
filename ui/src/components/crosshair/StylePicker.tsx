import type { CrosshairStyle } from './types';

interface StylePickerProps {
  value: CrosshairStyle;
  onChange: (style: CrosshairStyle) => void;
}

const STYLES: { value: CrosshairStyle; label: string; icon: React.ReactNode }[] = [
  {
    value: 'dot',
    label: 'Ponto',
    icon: (
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        }}
      />
    ),
  },
  {
    value: 'cross',
    label: 'Cruz',
    icon: (
      <div style={{ position: 'relative', width: '14px', height: '14px' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '2px',
            transform: 'translateY(-50%)',
            backgroundColor: 'currentColor',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '2px',
            height: '100%',
            transform: 'translateX(-50%)',
            backgroundColor: 'currentColor',
          }}
        />
      </div>
    ),
  },
  {
    value: 'circle',
    label: 'Círculo',
    icon: (
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: '2px solid currentColor',
          backgroundColor: 'transparent',
        }}
      />
    ),
  },
];

export default function StylePicker({ value, onChange }: StylePickerProps) {
  return (
    <div className="flex gap-2">
      {STYLES.map((style) => {
        const isActive = value === style.value;
        return (
          <button
            key={style.value}
            onClick={() => onChange(style.value)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all text-xs font-medium ${
              isActive
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6]'
                : 'bg-[#1C1C1C] border-[#333333] text-neutral-400 hover:border-[#555555] hover:text-white'
            }`}
            aria-pressed={isActive}
          >
            {style.icon}
            <span>{style.label}</span>
          </button>
        );
      })}
    </div>
  );
}
