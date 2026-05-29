interface EnableToggleProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
}

export default function EnableToggle({ value, onChange }: EnableToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-200">Mira Customizada</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          value ? 'bg-[#3B82F6]' : 'bg-[#333333]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
