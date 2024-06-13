const path = require("path");

const tf = require("@tensorflow/tfjs-node");

const faceapi = require("@vladmandic/face-api");
const modelPathRoot = "./../models";

async function image(bufferData) {
  const tensor = tf.tidy(() => {
    const decoded = faceapi.tf.node.decodeImage(bufferData, 3);
    const expand = faceapi.tf.expandDims(decoded, 0)
    const cast = faceapi.tf.cast(expand, 'float32');
    return cast;
  })
  return tensor
}

async function detect(tensor) {
  const result = await faceapi.detectSingleFace(tensor);
  return result;
}

async function main(file) {
  console.log("FaceAPI single-process test");

  await faceapi.tf.setBackend("tensorflow");
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();

  console.log(
    `Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${
      faceapi.version.faceapi
    } Backend: ${faceapi.tf?.getBackend()}`
  );

  console.log("Loading FaceAPI models");
  const modelPath = path.join(__dirname, modelPathRoot);
  // await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath)
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
  });

  const tensor = await image(file);
  const result = await detect(tensor);

  tensor.dispose();

  console.log(result)
  if (!result) {
    return null
  }
  return result.box;
}

module.exports = {
  detect: main,
};