export default function Architecture() {
  const layers = [
    {
      name: "Input",
      detail: "28×28×1",
      icon: "📥",
      color: "from-gray-700 to-gray-600",
      borderColor: "border-gray-600",
    },
    {
      name: "Conv2D + BN",
      detail: "3×3, 32 filters",
      icon: "🔍",
      color: "from-blue-700 to-blue-600",
      borderColor: "border-blue-500/40",
    },
    {
      name: "Conv2D",
      detail: "3×3, 32 filters",
      icon: "🔍",
      color: "from-blue-700 to-blue-600",
      borderColor: "border-blue-500/40",
    },
    {
      name: "MaxPool + Drop",
      detail: "2×2, p=0.25",
      icon: "📉",
      color: "from-purple-700 to-purple-600",
      borderColor: "border-purple-500/40",
    },
    {
      name: "Conv2D + BN",
      detail: "3×3, 64 filters",
      icon: "🔍",
      color: "from-indigo-700 to-indigo-600",
      borderColor: "border-indigo-500/40",
    },
    {
      name: "Conv2D",
      detail: "3×3, 64 filters",
      icon: "🔍",
      color: "from-indigo-700 to-indigo-600",
      borderColor: "border-indigo-500/40",
    },
    {
      name: "MaxPool + Drop",
      detail: "2×2, p=0.25",
      icon: "📉",
      color: "from-purple-700 to-purple-600",
      borderColor: "border-purple-500/40",
    },
    {
      name: "Flatten",
      detail: "→ 3136",
      icon: "📏",
      color: "from-teal-700 to-teal-600",
      borderColor: "border-teal-500/40",
    },
    {
      name: "Dense + BN + Drop",
      detail: "128, ReLU, p=0.4",
      icon: "🧠",
      color: "from-cyan-700 to-cyan-600",
      borderColor: "border-cyan-500/40",
    },
    {
      name: "Softmax",
      detail: "10 classes",
      icon: "🎯",
      color: "from-emerald-700 to-emerald-600",
      borderColor: "border-emerald-500/40",
    },
  ];

  return (
    <div className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
        CNN Architecture
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={`px-3 py-2 rounded-lg bg-gradient-to-b ${layer.color} border ${layer.borderColor} text-center min-w-[80px] hover:scale-105 transition-transform`}
            >
              <span className="text-sm">{layer.icon}</span>
              <p className="text-[10px] font-semibold text-white mt-0.5 leading-tight">
                {layer.name}
              </p>
              <p className="text-[9px] text-gray-300/70">{layer.detail}</p>
            </div>
            {i < layers.length - 1 && (
              <svg
                className="w-4 h-4 text-gray-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-2 rounded-lg bg-gray-800/50">
          <p className="text-[10px] text-gray-500">Total Params</p>
          <p className="text-sm font-bold text-gray-300 font-mono">~460K</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-800/50">
          <p className="text-[10px] text-gray-500">Optimizer</p>
          <p className="text-sm font-bold text-gray-300">Adam</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-800/50">
          <p className="text-[10px] text-gray-500">Loss</p>
          <p className="text-sm font-bold text-gray-300">Cross-Entropy</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-800/50">
          <p className="text-[10px] text-gray-500">Target Acc</p>
          <p className="text-sm font-bold text-cyan-400 font-mono">≥99%</p>
        </div>
      </div>
    </div>
  );
}
