import { useState, useCallback, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { MnistData } from "./lib/mnistData";
import { createModel, trainModel, predict, type TrainingLog } from "./lib/model";
import DrawingCanvas from "./components/DrawingCanvas";
import PredictionDisplay from "./components/PredictionDisplay";
import TrainingChart from "./components/TrainingChart";
import SampleDigits from "./components/SampleDigits";
import Architecture from "./components/Architecture";

type AppStatus = "idle" | "loading" | "ready" | "training" | "trained";

export default function App() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [predictions, setPredictions] = useState<number[]>(new Array(10).fill(0));
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs] = useState(10);
  const [samples, setSamples] = useState<{ image: Float32Array; label: number }[]>([]);
  const [activeTab, setActiveTab] = useState<"recognize" | "train" | "explore">("explore");

  const mnistRef = useRef<MnistData | null>(null);
  const modelRef = useRef<tf.Sequential | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setStatus("loading");
    setStatusMsg("Initializing TensorFlow.js...");

    await tf.ready();
    setStatusMsg(`Backend: ${tf.getBackend()} — Downloading MNIST data...`);

    const data = new MnistData();
    await data.load((msg) => setStatusMsg(msg));
    mnistRef.current = data;

    const sampleDigits = data.getSampleImages(40);
    setSamples(sampleDigits);

    setStatus("ready");
    setStatusMsg("MNIST data loaded — Ready to train!");
  };

  const startTraining = useCallback(async () => {
    if (!mnistRef.current) return;

    setStatus("training");
    setTrainingLogs([]);
    setCurrentEpoch(0);
    setActiveTab("train");

    const model = createModel();
    modelRef.current = model;

    const { xs: trainXs, labels: trainLabels } = mnistRef.current.getTrainData();
    const { xs: testXs, labels: testLabels } = mnistRef.current.getTestData(10000);

    setStatusMsg("Training CNN model...");

    await trainModel(
      model,
      trainXs,
      trainLabels,
      testXs,
      testLabels,
      (log) => {
        setTrainingLogs((prev) => [...prev, log]);
        setCurrentEpoch(log.epoch);
        setStatusMsg(
          `Epoch ${log.epoch}/${totalEpochs} — Val Acc: ${(log.valAcc * 100).toFixed(2)}%`
        );
      },
      totalEpochs,
      128
    );

    // Cleanup tensors
    trainXs.dispose();
    trainLabels.dispose();
    testXs.dispose();
    testLabels.dispose();

    setStatus("trained");
    setStatusMsg("Training complete! Draw a digit to test.");
    setActiveTab("recognize");
  }, [totalEpochs]);

  const handlePredict = useCallback((imageData: ImageData) => {
    if (!modelRef.current) return;
    const probs = predict(modelRef.current, imageData);
    setPredictions(probs);
  }, []);

  const tabs = [
    { key: "explore" as const, label: "Explore Data", icon: "🔬" },
    { key: "train" as const, label: "Train Model", icon: "⚡" },
    { key: "recognize" as const, label: "Recognize", icon: "✍️" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-cyan-500/20">
              7
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Digit Recognizer
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                CNN · MNIST · TensorFlow.js
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                status === "idle"
                  ? "bg-gray-800 text-gray-400"
                  : status === "loading"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  : status === "ready"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : status === "training"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-green-500/10 text-green-400 border border-green-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "idle"
                    ? "bg-gray-500"
                    : status === "loading"
                    ? "bg-yellow-400 animate-pulse"
                    : status === "ready"
                    ? "bg-blue-400"
                    : status === "training"
                    ? "bg-cyan-400 animate-pulse"
                    : "bg-green-400"
                }`}
              />
              {status === "idle"
                ? "Idle"
                : status === "loading"
                ? "Loading"
                : status === "ready"
                ? "Ready"
                : status === "training"
                ? "Training"
                : "Trained"}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Handwritten Digit
              </span>
              <br />
              Recognition
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Train a Convolutional Neural Network on the{" "}
              <span className="text-gray-300 font-medium">MNIST dataset</span>{" "}
              (65,000 handwritten digit images) right in your browser using
              TensorFlow.js. Then draw any digit and watch the model predict it
              in real-time.
            </p>

            {/* Status message */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              {(status === "idle" || status === "loading") && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  {status === "loading" && (
                    <svg
                      className="w-4 h-4 animate-spin text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                  {statusMsg}
                </div>
              )}
              {status === "ready" && (
                <button
                  onClick={startTraining}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Train Model ({totalEpochs} epochs)
                </button>
              )}
              {status === "training" && (
                <div className="text-sm text-cyan-400 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {statusMsg}
                </div>
              )}
              {status === "trained" && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-sm text-green-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {statusMsg}
                  </div>
                  <button
                    onClick={startTraining}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-all border border-gray-700"
                  >
                    Retrain
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 bg-gray-900/60 rounded-xl p-1 border border-gray-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Explore Tab */}
        {activeTab === "explore" && (
          <div className="space-y-6 animate-in fade-in">
            <Architecture />
            {samples.length > 0 && <SampleDigits samples={samples} />}

            {/* How it works */}
            <div className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
                How It Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-xl">
                    📊
                  </div>
                  <h4 className="font-semibold text-sm text-gray-200">
                    1. Load & Preprocess
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    The MNIST dataset (65K images of handwritten digits 0–9) is
                    loaded as a sprite sheet. Each 28×28 grayscale image is
                    normalized to [0, 1] pixel values and split into 55K
                    training and 10K test samples.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-xl">
                    🧠
                  </div>
                  <h4 className="font-semibold text-sm text-gray-200">
                    2. Train CNN
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    A convolutional neural network with two conv blocks
                    (Conv2D → BatchNorm → Conv2D → MaxPool → Dropout)
                    followed by dense layers learns spatial features.
                    Training happens in-browser via TensorFlow.js with WebGL
                    acceleration.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 text-xl">
                    ✍️
                  </div>
                  <h4 className="font-semibold text-sm text-gray-200">
                    3. Draw & Predict
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Draw a digit on the canvas — it's captured as an image,
                    resized to 28×28, converted to grayscale, and fed into
                    the trained model. The softmax layer outputs a probability
                    distribution across all 10 digit classes.
                  </p>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
                Tech Stack
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: "TensorFlow.js", desc: "In-browser ML", color: "text-orange-400" },
                  { name: "React 19", desc: "UI Framework", color: "text-cyan-400" },
                  { name: "Tailwind CSS", desc: "Styling", color: "text-blue-400" },
                  { name: "Vite", desc: "Build Tool", color: "text-violet-400" },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="p-3 bg-gray-800/40 rounded-xl text-center"
                  >
                    <p className={`text-sm font-bold ${tech.color}`}>
                      {tech.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {tech.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Train Tab */}
        {activeTab === "train" && (
          <div className="space-y-6 animate-in fade-in">
            {status === "ready" && (
              <div className="p-8 bg-gray-900/60 rounded-2xl border border-gray-800 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                  Ready to Train
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  The MNIST data is loaded. Click the button above to start
                  training the CNN. Training runs entirely in your browser —
                  no server needed.
                </p>
                <button
                  onClick={startTraining}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Start Training
                </button>
              </div>
            )}
            {(status === "training" || status === "trained") && (
              <TrainingChart
                logs={trainingLogs}
                isTraining={status === "training"}
                currentEpoch={currentEpoch}
                totalEpochs={totalEpochs}
              />
            )}
            {status === "loading" && (
              <div className="p-8 bg-gray-900/60 rounded-2xl border border-gray-800 text-center">
                <svg
                  className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <p className="text-sm text-gray-400">{statusMsg}</p>
              </div>
            )}
          </div>
        )}

        {/* Recognize Tab */}
        {activeTab === "recognize" && (
          <div className="animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800">
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4 text-center">
                    Drawing Canvas
                  </h3>
                  <DrawingCanvas
                    onPredict={handlePredict}
                    disabled={status !== "trained"}
                  />
                </div>
                <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800/60">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/20">
                      <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <strong className="text-gray-300">Tips:</strong> Draw
                        large, centered digits. Use thick strokes. The model
                        was trained on centered 28×28 images, so keeping your
                        digit centered gives the best results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <PredictionDisplay
                predictions={predictions}
                isReady={status === "trained"}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            Built with TensorFlow.js · MNIST Dataset by Yann LeCun et al.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>React + Vite + Tailwind CSS</span>
            <span className="text-gray-700">•</span>
            <span>In-browser ML — no data leaves your device</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
