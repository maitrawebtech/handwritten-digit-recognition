import { useRef, useEffect, useState, useCallback } from "react";

interface DrawingCanvasProps {
  onPredict: (imageData: ImageData) => void;
  disabled: boolean;
}

export default function DrawingCanvas({ onPredict, disabled }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 18;
    ctx.strokeStyle = "#ffffff";
  }, []);

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
      setHasDrawn(true);
    },
    [disabled, getPos]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || disabled) return;
      e.preventDefault();
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [isDrawing, disabled, getPos]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    // Trigger prediction
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    onPredict(imageData);
  }, [isDrawing, onPredict]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onPredict(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }, [onPredict]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className={`rounded-2xl border-2 cursor-crosshair touch-none ${
            disabled
              ? "border-gray-600 opacity-50"
              : "border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
          }`}
          style={{ width: 280, height: 280 }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-500 text-sm font-medium text-center px-8">
              Draw a digit here<br />
              <span className="text-xs text-gray-600">(0–9)</span>
            </p>
          </div>
        )}
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-2xl bg-black/40">
            <p className="text-gray-400 text-sm font-medium text-center px-8">
              Train model first
            </p>
          </div>
        )}
      </div>
      <button
        onClick={clearCanvas}
        disabled={disabled}
        className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-all border border-gray-700 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear Canvas
      </button>
    </div>
  );
}
