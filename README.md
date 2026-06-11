# ✍️ Handwritten Digit Recognizer

> Train a Convolutional Neural Network (CNN) on the MNIST dataset and recognize handwritten digits in real-time — all running **entirely in your browser**.

![Tech Stack](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [CNN Architecture](#cnn-architecture)
- [Training Details](#training-details)
- [Step-by-Step Process](#step-by-step-process)
- [Performance Tips](#performance-tips)
- [Troubleshooting](#troubleshooting)
- [Learning Resources](#learning-resources)

---

## 🔍 Overview

Handwritten digit recognition is a classic computer vision problem. It appears everywhere — from reading postal codes on envelopes to processing cheques and digit-only forms. This project implements a complete pipeline:

1. **Load** the MNIST dataset (65,000 handwritten digit images)
2. **Visualize** sample digits from the dataset
3. **Train** a CNN model with real-time accuracy/loss monitoring
4. **Draw** digits on an interactive canvas
5. **Predict** the drawn digit with confidence probabilities

The entire training and inference happens **in your browser** using TensorFlow.js — no server, no API calls, no data leaves your device.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **In-Browser Training** | Train a full CNN on 55K images using WebGL acceleration |
| 📊 **Live Training Charts** | Watch accuracy and loss curves update in real-time per epoch |
| ✍️ **Drawing Canvas** | Draw digits with mouse or touch — works on mobile too |
| 🎯 **Confidence Display** | See probability bars for all 10 digit classes (0–9) |
| 🔬 **Dataset Explorer** | Visualize random MNIST samples with their labels |
| 🏗️ **Architecture Viewer** | Interactive diagram of the CNN layer structure |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile devices |
| 🔒 **Privacy First** | Everything runs locally — zero data transmission |

---

## 🧩 How It Works

### 1. Data Loading
The MNIST dataset is loaded from Google's CDN as a sprite sheet containing all 65,000 digit images (28×28 grayscale). Labels are loaded separately as a binary file.

### 2. Preprocessing
- Pixel values normalized from `[0, 255]` to `[0, 1]`
- Images reshaped to `[28, 28, 1]` tensors (height × width × channels)
- Labels one-hot encoded to 10 classes
- Data shuffled and split: **55,000 training** / **10,000 test**

### 3. Model Architecture
A Convolutional Neural Network with:
- 2 convolutional blocks (Conv2D → BatchNorm → Conv2D → MaxPool → Dropout)
- Dense classifier head (Flatten → Dense 128 → BatchNorm → Dropout → Softmax)

### 4. Training
- **Optimizer:** Adam (learning rate 0.001)
- **Loss:** Categorical Cross-Entropy
- **Batch Size:** 128
- **Epochs:** 10
- Uses WebGL backend for GPU acceleration when available

### 5. Inference
When you draw on the canvas:
1. Canvas captured as `ImageData`
2. Converted to grayscale
3. Resized to 28×28 pixels
4. Normalized to `[0, 1]`
5. Fed through the trained model
6. Softmax output displayed as probability bars

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **TensorFlow.js** | Machine learning framework (in-browser) |
| **React 19** | UI component framework |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first CSS styling |
| **Vite** | Fast build tool and dev server |

---

## 📁 Project Structure

```
├── index.html                  # Entry HTML file
├── README.md                   # This file
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Main application component
    ├── index.css               # Global styles + Tailwind
    ├── lib/
    │   ├── mnistData.ts        # MNIST data loader & preprocessor
    │   └── model.ts            # CNN model definition & training
    ├── components/
    │   ├── DrawingCanvas.tsx    # Interactive drawing canvas
    │   ├── PredictionDisplay.tsx # Prediction results & probability bars
    │   ├── TrainingChart.tsx    # Training metrics & live charts
    │   ├── SampleDigits.tsx     # MNIST sample visualization
    │   └── Architecture.tsx     # CNN architecture diagram
    └── utils/
        └── cn.ts               # Tailwind class utility
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x ([Download](https://nodejs.org/))
- **npm** ≥ 9.x (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd handwritten-digit-recognizer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev Server | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Create production build |
| Preview | `npm run preview` | Preview production build locally |

---

## 🏗️ CNN Architecture

```
Layer (type)                Output Shape         Params
================================================================
Conv2D (32 filters, 3×3)    [28, 28, 32]        320
BatchNormalization          [28, 28, 32]         128
Conv2D (32 filters, 3×3)    [28, 28, 32]        9,248
MaxPooling2D (2×2)          [14, 14, 32]        0
Dropout (0.25)              [14, 14, 32]        0
────────────────────────────────────────────────
Conv2D (64 filters, 3×3)    [14, 14, 64]        18,496
BatchNormalization          [14, 14, 64]         256
Conv2D (64 filters, 3×3)    [14, 14, 64]        36,928
MaxPooling2D (2×2)          [7, 7, 64]          0
Dropout (0.25)              [7, 7, 64]          0
────────────────────────────────────────────────
Flatten                     [3136]               0
Dense (128, ReLU)           [128]                401,536
BatchNormalization          [128]                512
Dropout (0.4)               [128]                0
Dense (10, Softmax)         [10]                 1,290
================================================================
Total params: ~468,714
Trainable params: ~468,266
```

### Why This Architecture?

- **Two Conv Blocks:** Extract low-level features (edges, corners) and high-level features (shapes, curves)
- **Batch Normalization:** Stabilizes training and allows higher learning rates
- **MaxPooling:** Reduces spatial dimensions → fewer parameters → less overfitting
- **Dropout:** Regularization technique that randomly zeros neurons during training
- **Softmax Output:** Converts logits to proper probability distribution across 10 classes

---

## 📈 Training Details

### Hyperparameters

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| Learning Rate | 0.001 | Adam default; works well for MNIST |
| Batch Size | 128 | Good balance of speed and gradient quality |
| Epochs | 10 | MNIST converges fast; 10 is usually enough for >99% |
| Dropout Rate (Conv) | 0.25 | Mild regularization for conv layers |
| Dropout Rate (Dense) | 0.4 | Stronger regularization for dense layers |
| Kernel Init | He Normal | Optimal for ReLU activations |

### Expected Results

| Metric | Expected Value |
|--------|---------------|
| Training Accuracy | ~99.5% |
| Validation Accuracy | ~99.0–99.3% |
| Training Loss | < 0.02 |
| Validation Loss | < 0.05 |
| Training Time (GPU) | ~60-120 seconds |
| Training Time (CPU) | ~3-8 minutes |

### Training Tips

1. **Use Chrome** — best WebGL support for TensorFlow.js
2. **Close other tabs** — more GPU memory available
3. **Desktop is faster** — more compute power than mobile
4. **GPU acceleration** — TF.js automatically uses WebGL when available

---

## 📋 Step-by-Step Process

This section describes the complete workflow, matching the assignment requirements:

### Step 1: Load the MNIST Dataset and Visualize Samples
- Data loaded from Google's sprite sheet CDN (`mnistData.ts`)
- 65,000 images of 28×28 grayscale handwritten digits (0–9)
- Random samples displayed in the **Explore Data** tab
- Each sample shown at actual pixel resolution with its label

### Step 2: Normalize and Split Data
- Pixel values divided by 255 → normalized to `[0, 1]`
- Data shuffled with randomized indices
- Split: **55,000 training** samples / **10,000 test** samples
- Labels one-hot encoded (e.g., digit 3 → `[0,0,0,1,0,0,0,0,0,0]`)

### Step 3: Build a CNN
- Two convolutional blocks with increasing filter depth (32 → 64)
- Each block: Conv2D → BatchNorm → Conv2D → MaxPool → Dropout
- Dense head: Flatten → Dense(128, ReLU) → BatchNorm → Dropout → Dense(10, Softmax)
- Compiled with Adam optimizer and categorical cross-entropy loss

### Step 4: Train and Monitor Accuracy Curves
- Training runs for 10 epochs with batch size 128
- Live updating charts show accuracy and loss per epoch
- Metrics panel displays train/val accuracy and loss
- Progress bar shows epoch completion

### Step 5: Augmentation & Architecture Tuning
- Batch Normalization acts as implicit regularization
- Dropout layers (0.25 for conv, 0.4 for dense) prevent overfitting
- He Normal initialization ensures proper gradient flow
- Two conv blocks provide sufficient depth for MNIST

### Step 6: Export Model and Build Canvas UI
- Model stays in browser memory (TensorFlow.js `Sequential` object)
- Interactive HTML5 Canvas with mouse + touch support
- White-on-black drawing (matches MNIST format)
- Clear button to reset canvas

### Step 7: Connect Canvas to Model for Predictions
- Canvas `ImageData` captured on mouse/touch release
- Image converted to grayscale and resized to 28×28
- Normalized tensor fed through model's `predict()` method
- Softmax probabilities displayed as colored bar chart
- Top prediction shown with confidence percentage

---

## 🎯 Performance Tips

### For Better Predictions
- **Draw large, centered digits** — the model was trained on centered 28×28 images
- **Use thick strokes** — thin lines may not register well at 28×28 resolution
- **Fill the canvas** — don't draw tiny digits in a corner
- **Draw clearly** — ambiguous digits are hard for any model

### For Faster Training
- **Use Chrome or Edge** — best WebGL support
- **Enable hardware acceleration** in browser settings
- **Close GPU-intensive tabs** — games, videos, etc.
- **Use a device with a discrete GPU** for fastest training

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Training is very slow | Check if WebGL backend is active (shown in status). Close other tabs. Use Chrome. |
| Model predicts wrong | Draw larger, more centered digits. Use thicker strokes. Clear and try again. |
| Data won't load | Check internet connection. The MNIST data is fetched from Google's CDN. |
| Page crashes | MNIST training uses significant memory. Close other tabs and try again. |
| Canvas doesn't respond | Make sure the model is trained first. The canvas is disabled until training completes. |
| Touch drawing doesn't work | Ensure you're using a modern browser. Touch events are supported on mobile. |

---

## 📚 Learning Resources

### About MNIST
- [MNIST Database — Wikipedia](https://en.wikipedia.org/wiki/MNIST_database)
- [Yann LeCun's MNIST Page](http://yann.lecun.com/exdb/mnist/)
- [NIST Special Database](https://www.nist.gov/srd/nist-special-database-19)

### About CNNs
- [Stanford CS231n — CNNs for Visual Recognition](https://cs231n.github.io/convolutional-networks/)
- [3Blue1Brown — Neural Networks (YouTube)](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)
- [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)

### About TensorFlow.js
- [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
- [TF.js MNIST Example](https://github.com/tensorflow/tfjs-examples/tree/master/mnist)
- [TF.js API Reference](https://js.tensorflow.org/api/latest/)

### Extending This Project
- Add **data augmentation** (rotation, scaling, shearing) for better generalization
- Try **different architectures** (ResNet, MobileNet) for comparison
- Implement **model export/import** using `model.save()` and `tf.loadLayersModel()`
- Add **EMNIST support** for letters and digits
- Build a **multi-digit recognizer** with segmentation
- Add **Grad-CAM visualization** to see what the model focuses on

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ using TensorFlow.js, React, and Tailwind CSS</strong><br>
  <sub>All computation happens in your browser — your data never leaves your device.</sub>
</p>
