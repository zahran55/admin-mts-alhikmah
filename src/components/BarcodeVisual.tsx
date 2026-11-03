import React from 'react';

interface BarcodeVisualProps {
  value: string;
  label?: string;
  className?: string;
  barHeight?: number;
  showText?: boolean;
}

export const BarcodeVisual: React.FC<BarcodeVisualProps> = ({
  value,
  label,
  className = '',
  barHeight = 36,
  showText = true,
}) => {
  // Deterministic bar widths pattern based on characters
  const generateBars = (str: string) => {
    const bars: { width: number; isSpace: boolean }[] = [];
    // Start guard
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 2, isSpace: true });
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const w1 = (charCode % 3) + 1;
      const s1 = ((charCode >> 1) % 2) + 1;
      const w2 = ((charCode >> 2) % 3) + 1;
      const s2 = ((charCode >> 3) % 2) + 1;

      bars.push({ width: w1, isSpace: false });
      bars.push({ width: s1, isSpace: true });
      bars.push({ width: w2, isSpace: false });
      bars.push({ width: s2, isSpace: true });
    }

    // Stop guard
    bars.push({ width: 3, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 2, isSpace: false });

    return bars;
  };

  const bars = generateBars(value || '000000');
  const totalWidth = bars.reduce((acc, b) => acc + b.width, 0);

  let currentX = 0;

  return (
    <div className={`flex flex-col items-center bg-white p-1 rounded-sm ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${barHeight}`}
        className="w-full h-auto max-h-12 text-slate-900"
        preserveAspectRatio="none"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width;
          if (bar.isSpace) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width}
              height={barHeight}
              fill="currentColor"
            />
          );
        })}
      </svg>
      {showText && (
        <span className="text-[9px] font-mono tracking-widest text-slate-800 font-bold mt-0.5 select-all">
          {label || value}
        </span>
      )}
    </div>
  );
};
