const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;

const faceApiService = require('./services/faceapi')
const imageTools = require('./utils/image')

app.use(fileUpload());

app.post('/upload', async (req, res) => {
  const { file } = req.files
  console.log('file', file)

  const result = await faceApiService.detect(file.data);

  await imageTools.faceCropBuffer(file.data, result);
  res.json({
    detectedFaces: result
  });
})

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
})