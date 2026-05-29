interface SizeSliderProps {
  value: number;
  onChange: (size: number) => void;
}

export default function SizeSlider({ value, onChange }: SizeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-200">Tamanho da Mira</span>
        <span className="font-mono text-[#3B82F6] font-bold bg-[#1A1A1A] px-2 py-0.5 rounded text-xs">
          {value}px
        </span>
      </div>
      <input
        type="range"
        min={4}
        max={32}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
      />
    </div>
  );
}
