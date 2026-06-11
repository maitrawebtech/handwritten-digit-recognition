interface PredictionDisplayProps {
  predictions: number[];
  isReady: boolean;
}

export default function PredictionDisplay({ predictions, isReady }: PredictionDisplayProps) {
  if (!isReady) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 bg-gray-900/60 rounded-2xl border border-gray-800">
        <p className="text-gray-500 text-center text-sm">
          Model not trained yet
        </p>
      </div>
    );
  }

  const maxProb = Math.max(...predictions);
  const predictedDigit = predictions.indexOf(maxProb);
  const hasInput = maxProb > 0.15;

  const barColors = [
    "from-red-500 to-red-400",
    "from-orange-500 to-orange-400",
    "from-amber-500 to-amber-400",
    "from-yellow-500 to-yellow-400",
    "from-lime-500 to-lime-400",
    "from-green-500 to-green-400",
    "from-emerald-500 to-emerald-400",
    "from-cyan-500 to-cyan-400",
    "from-blue-500 to-blue-400",
    "from-violet-500 to-violet-400",
  ];

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Main prediction */}
      <div className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800 text-center">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
          Predicted Digit
        </p>
        <div className="relative inline-block">
          <span
            className={`text-7xl font-bold transition-all duration-300 ${
              hasInput
                ? "text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                : "text-gray-700"
            }`}
          >
            {hasInput ? predictedDigit : "?"}
          </span>
        </div>
        {hasInput && (
          <p className="text-sm text-gray-400 mt-2">
            Confidence:{" "}
            <span className="text-cyan-400 font-semibold">
              {(maxProb * 100).toFixed(1)}%
            </span>
          </p>
        )}
      </div>

      {/* Probability bars */}
      <div className="p-5 bg-gray-900/60 rounded-2xl border border-gray-800">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
          Class Probabilities
        </p>
        <div className="space-y-1.5">
          {predictions.map((prob, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`w-5 text-right text-xs font-mono font-bold ${
                  i === predictedDigit && hasInput
                    ? "text-cyan-400"
                    : "text-gray-500"
                }`}
              >
                {i}
              </span>
              <div className="flex-1 h-5 bg-gray-800/80 rounded-md overflow-hidden relative">
                <div
                  className={`h-full rounded-md bg-gradient-to-r ${barColors[i]} transition-all duration-300 ease-out`}
                  style={{ width: `${Math.max(prob * 100, 0)}%` }}
                />
              </div>
              <span className="w-12 text-right text-xs font-mono text-gray-500">
                {(prob * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
