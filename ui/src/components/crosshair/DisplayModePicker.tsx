import type { CrosshairDisplayMode } from './types';

export interface DisplayModePickerProps {
  value: CrosshairDisplayMode;
  onChange: (mode: CrosshairDisplayMode) => void;
}

const MODES: {
  value: CrosshairDisplayMode;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'always',
    label: 'Mira Fixa',
    sublabel: 'Sempre visível',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    value: 'aiming',
    label: 'Mira ao Mirar',
    sublabel: 'Ao mirar',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    ),
  },
];

export default function DisplayModePicker({ value, onChange }: DisplayModePickerProps) {
  return (
    <div className="flex gap-2">
      {MODES.map((mode) => {
        const isActive = value === mode.value;
        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all ${
              isActive
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6]'
                : 'bg-[#1C1C1C] border-[#333333] text-neutral-400 hover:border-[#555555] hover:text-white'
            }`}
            aria-pressed={isActive}
          >
            {mode.icon}
            <span className="text-xs font-medium">{mode.label}</span>
            <span className="text-[10px] opacity-70">{mode.sublabel}</span>
          </button>
        );
      })}
    </div>
  );
}
