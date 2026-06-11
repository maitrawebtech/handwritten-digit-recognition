import * as tf from "@tensorflow/tfjs";

export interface TrainingLog {
  epoch: number;
  loss: number;
  acc: number;
  valLoss: number;
  valAcc: number;
}

export function createModel(): tf.Sequential {
  const model = tf.sequential();

  // Conv Block 1
  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 3,
      filters: 32,
      padding: "same",
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );
  model.add(tf.layers.batchNormalization());
  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 32,
      padding: "same",
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
  model.add(tf.layers.dropout({ rate: 0.25 }));

  // Conv Block 2
  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 64,
      padding: "same",
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );
  model.add(tf.layers.batchNormalization());
  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 64,
      padding: "same",
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
  model.add(tf.layers.dropout({ rate: 0.25 }));

  // Dense layers
  model.add(tf.layers.flatten());
  model.add(
    tf.layers.dense({
      units: 128,
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.4 }));
  model.add(
    tf.layers.dense({
      units: 10,
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

export async function trainModel(
  model: tf.Sequential,
  trainXs: tf.Tensor,
  trainLabels: tf.Tensor,
  testXs: tf.Tensor,
  testLabels: tf.Tensor,
  onEpochEnd: (log: TrainingLog) => void,
  epochs: number = 8,
  batchSize: number = 128
): Promise<void> {
  await model.fit(trainXs, trainLabels, {
    batchSize,
    validationData: [testXs, testLabels],
    epochs,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if (logs) {
          onEpochEnd({
            epoch: epoch + 1,
            loss: logs.loss,
            acc: logs.acc,
            valLoss: logs.val_loss,
            valAcc: logs.val_acc,
          });
        }
      },
    },
  });
}

export function predict(
  model: tf.Sequential,
  imageData: ImageData
): number[] {
  return tf.tidy(() => {
    // Convert to grayscale and resize to 28x28
    let tensor = tf.browser
      .fromPixels(imageData, 1)
      .resizeBilinear([28, 28])
      .toFloat();

    // Normalize to 0-1
    tensor = tensor.div(tf.scalar(255));

    // Add batch dimension
    const batched = tensor.reshape([1, 28, 28, 1]);

    const prediction = model.predict(batched) as tf.Tensor;
    return Array.from(prediction.dataSync());
  });
}
