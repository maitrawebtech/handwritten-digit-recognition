import type { TrainingLog } from "../lib/model";

interface TrainingChartProps {
  logs: TrainingLog[];
  isTraining: boolean;
  currentEpoch: number;
  totalEpochs: number;
}

function MiniChart({
  data,
  color,
  height = 120,
  max,
}: {
  data: number[];
  color: string;
  height?: number;
  max?: number;
}) {
  if (data.length === 0)
    return (
      <div
        style={{ height }}
        className="bg-gray-800/40 rounded-lg flex items-center justify-center"
      >
        <span className="text-gray-600 text-xs">Waiting for data...</span>
      </div>
    );

  const maxVal = max ?? Math.max(...data) * 1.1;
  const minVal = 0;
  const range = maxVal - minVal || 1;
  const w = 300;
  const padding = 5;
  const usableW = w - padding * 2;
  const usableH = height - padding * 2;

  const points = data.map((v, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * usableW;
    const y = padding + usableH - ((v - minVal) / range) * usableH;
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding},${height - padding}`,
    ...points,
    `${padding + (Math.max(data.length - 1, 0) / Math.max(data.length - 1, 1)) * usableW},${height - padding}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color})`} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = padding + (i / Math.max(data.length - 1, 1)) * usableW;
        const y = padding + usableH - ((v - minVal) / range) * usableH;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill={color}
            stroke="#111827"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

export default function TrainingChart({
  logs,
  isTraining,
  currentEpoch,
  totalEpochs,
}: TrainingChartProps) {
  const lastLog = logs[logs.length - 1];

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Training Progress
          </span>
          <span className="text-xs text-gray-400 font-mono">
            Epoch {currentEpoch}/{totalEpochs}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 relative"
            style={{
              width: `${(currentEpoch / totalEpochs) * 100}%`,
            }}
          >
            {isTraining && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            )}
          </div>
        </div>
        {isTraining && (
          <p className="text-xs text-cyan-400/70 mt-2 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Training in progress...
          </p>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Train Accuracy
          </p>
          <p className="text-xl font-bold text-green-400 font-mono">
            {lastLog ? `${(lastLog.acc * 100).toFixed(1)}%` : "—"}
          </p>
        </div>
        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Val Accuracy
          </p>
          <p className="text-xl font-bold text-cyan-400 font-mono">
            {lastLog ? `${(lastLog.valAcc * 100).toFixed(1)}%` : "—"}
          </p>
        </div>
        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Train Loss
          </p>
          <p className="text-xl font-bold text-orange-400 font-mono">
            {lastLog ? lastLog.loss.toFixed(4) : "—"}
          </p>
        </div>
        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Val Loss
          </p>
          <p className="text-xl font-bold text-rose-400 font-mono">
            {lastLog ? lastLog.valLoss.toFixed(4) : "—"}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">
            Accuracy Curve
          </p>
          <MiniChart
            data={logs.map((l) => l.valAcc)}
            color="#06b6d4"
            max={1}
          />
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-[10px] text-gray-500">Val Acc</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">
            Loss Curve
          </p>
          <MiniChart
            data={logs.map((l) => l.valLoss)}
            color="#f97316"
          />
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-[10px] text-gray-500">Val Loss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
