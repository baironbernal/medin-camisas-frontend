import { Color } from '@/types/product-detail';

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string | null;
  onSelect: (name: string) => void;
}

export default function ColorSelector({ colors, selectedColor, onSelect }: ColorSelectorProps) {
  if (colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">
        Color
        {selectedColor && <span className="text-secondary font-normal normal-case"> - {selectedColor}</span>}
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onSelect(color.name)}
            title={color.name}
            className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 ${
              selectedColor === color.name
                ? 'border-primary border-2 scale-110 shadow-md'
                : 'border border-gray-200 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex_color }}
          />
        ))}
      </div>
    </div>
  );
}
