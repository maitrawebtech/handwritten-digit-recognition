import * as tf from "@tensorflow/tfjs";

const IMAGE_SIZE = 784; // 28x28
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;
const NUM_TRAIN_ELEMENTS = 55000;
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

const MNIST_IMAGES_SPRITE_PATH =
  "https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png";
const MNIST_LABELS_PATH =
  "https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8";

export class MnistData {
  private datasetImages!: Float32Array;
  private datasetLabels!: Uint8Array;
  private trainIndices!: Uint32Array;
  private testIndices!: Uint32Array;
  private trainImages!: Float32Array;
  private testImages!: Float32Array;
  private trainLabels!: Uint8Array;
  private testLabels!: Uint8Array;

  async load(onProgress?: (msg: string) => void) {
    onProgress?.("Downloading MNIST sprite image...");

    const imgRequest = new Promise<Float32Array>((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      img.crossOrigin = "";
      img.onload = () => {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;

        const datasetBytesBuffer = new ArrayBuffer(
          NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4
        );

        const chunkSize = 5000;
        canvas.width = img.width;
        canvas.height = chunkSize;

        for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
          const datasetBytesView = new Float32Array(
            datasetBytesBuffer,
            i * IMAGE_SIZE * chunkSize * 4,
            IMAGE_SIZE * chunkSize
          );
          ctx.drawImage(
            img,
            0,
            i * chunkSize,
            img.width,
            chunkSize,
            0,
            0,
            img.width,
            chunkSize
          );
          const imageData = ctx.getImageData(0, 0, canvas.width, chunkSize);

          for (let j = 0; j < imageData.data.length / 4; j++) {
            datasetBytesView[j] = imageData.data[j * 4] / 255;
          }
        }
        resolve(new Float32Array(datasetBytesBuffer));
      };
      img.src = MNIST_IMAGES_SPRITE_PATH;
    });

    onProgress?.("Downloading MNIST labels...");
    const labelsRequest = fetch(MNIST_LABELS_PATH);

    const [imgResponse, labelsResponse] = await Promise.all([
      imgRequest,
      labelsRequest,
    ]);

    this.datasetImages = imgResponse;
    this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

    // Create shuffled indices
    const indices = tf.util.createShuffledIndices(NUM_DATASET_ELEMENTS);
    this.trainIndices = indices.slice(0, NUM_TRAIN_ELEMENTS);
    this.testIndices = indices.slice(NUM_TRAIN_ELEMENTS);

    this.trainImages = new Float32Array(NUM_TRAIN_ELEMENTS * IMAGE_SIZE);
    this.testImages = new Float32Array(NUM_TEST_ELEMENTS * IMAGE_SIZE);
    this.trainLabels = new Uint8Array(NUM_TRAIN_ELEMENTS * NUM_CLASSES);
    this.testLabels = new Uint8Array(NUM_TEST_ELEMENTS * NUM_CLASSES);

    for (let i = 0; i < NUM_TRAIN_ELEMENTS; i++) {
      const idx = this.trainIndices[i];
      this.trainImages.set(
        this.datasetImages.subarray(idx * IMAGE_SIZE, (idx + 1) * IMAGE_SIZE),
        i * IMAGE_SIZE
      );
      // One-hot encode
      this.trainLabels[i * NUM_CLASSES + this.datasetLabels[idx]] = 1;
    }

    for (let i = 0; i < NUM_TEST_ELEMENTS; i++) {
      const idx = this.testIndices[i];
      this.testImages.set(
        this.datasetImages.subarray(idx * IMAGE_SIZE, (idx + 1) * IMAGE_SIZE),
        i * IMAGE_SIZE
      );
      this.testLabels[i * NUM_CLASSES + this.datasetLabels[idx]] = 1;
    }

    onProgress?.("Data loaded successfully!");
  }

  getTrainData() {
    const xs = tf.tensor4d(this.trainImages, [
      NUM_TRAIN_ELEMENTS,
      28,
      28,
      1,
    ]);
    const labels = tf.tensor2d(this.trainLabels, [
      NUM_TRAIN_ELEMENTS,
      NUM_CLASSES,
    ]);
    return { xs, labels };
  }

  getTestData(numExamples?: number) {
    let xs = tf.tensor4d(this.testImages, [NUM_TEST_ELEMENTS, 28, 28, 1]);
    let labels = tf.tensor2d(this.testLabels, [NUM_TEST_ELEMENTS, NUM_CLASSES]);

    if (numExamples != null) {
      xs = xs.slice([0, 0, 0, 0], [numExamples, 28, 28, 1]);
      labels = labels.slice([0, 0], [numExamples, NUM_CLASSES]);
    }
    return { xs, labels };
  }

  getSampleImages(count: number = 40): { image: Float32Array; label: number }[] {
    const samples: { image: Float32Array; label: number }[] = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * NUM_DATASET_ELEMENTS);
      samples.push({
        image: this.datasetImages.slice(
          idx * IMAGE_SIZE,
          (idx + 1) * IMAGE_SIZE
        ),
        label: this.datasetLabels[idx],
      });
    }
    return samples;
  }
}
