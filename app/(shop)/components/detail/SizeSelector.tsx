interface SizeSelectorProps {
  sizes: string[];
  availableSizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, availableSizes, selectedSize, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium tracking-wide text-primary uppercase">Talla</p>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const isAvailable = availableSizes.includes(size);
          return (
            <button
              key={size}
              disabled={!isAvailable}
              onClick={() => onSelect(size)}
              className={`px-4 py-2 border cursor-pointer rounded transition
                ${selectedSize === size ? 'border-primary bg-primary text-white' : 'border-gray-300'}
                ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary hover:bg-primary hover:text-white'}
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
