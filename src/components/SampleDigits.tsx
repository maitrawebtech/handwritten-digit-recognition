import { useRef, useEffect } from "react";

interface SampleDigitsProps {
  samples: { image: Float32Array; label: number }[];
}

function DigitTile({ image, label }: { image: Float32Array; label: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(28, 28);
    for (let i = 0; i < 784; i++) {
      const val = Math.floor(image[i] * 255);
      imageData.data[i * 4] = val;
      imageData.data[i * 4 + 1] = val;
      imageData.data[i * 4 + 2] = val;
      imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }, [image]);

  const labelColors: Record<number, string> = {
    0: "text-red-400",
    1: "text-orange-400",
    2: "text-amber-400",
    3: "text-yellow-400",
    4: "text-lime-400",
    5: "text-green-400",
    6: "text-emerald-400",
    7: "text-cyan-400",
    8: "text-blue-400",
    9: "text-violet-400",
  };

  return (
    <div className="flex flex-col items-center gap-1 group">
      <canvas
        ref={canvasRef}
        width={28}
        height={28}
        className="w-12 h-12 rounded-md border border-gray-700/50 group-hover:border-cyan-500/50 transition-colors"
        style={{ imageRendering: "pixelated" }}
      />
      <span className={`text-[10px] font-mono font-bold ${labelColors[label]}`}>
        {label}
      </span>
    </div>
  );
}

export default function SampleDigits({ samples }: SampleDigitsProps) {
  if (samples.length === 0) return null;

  return (
    <div className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
        Sample MNIST Digits
      </h3>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-3 justify-items-center">
        {samples.slice(0, 40).map((s, i) => (
          <DigitTile key={i} image={s.image} label={s.label} />
        ))}
      </div>
      <p className="text-[10px] text-gray-600 mt-3 text-center">
        40 random samples from the 65,000-image MNIST dataset — each is a 28×28 grayscale pixel grid
      </p>
    </div>
  );
}
