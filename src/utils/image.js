const sharp = require('sharp');
const jimp = require('jimp');

async function faceCropBuffer (imageBuffer, box) {
  // const image = await jimp.read(imageBuffer)
  // console.log(image)
  // console.log(box)
  // image.crop(
  //   parseInt(box._x),
  //   parseInt(box._y),
  //   parseInt(box._width),
  //   parseInt(box._height)
  // )
  // await image.writeAsync('123.jpeg')
  const {height, width} = await sharp(imageBuffer).metadata()
  console.log('image data', await sharp(imageBuffer).metadata())
  console.log(box)
  const imageCropBuffer = await sharp(imageBuffer).extract(formatBox(box, height, width, 0.5)).toFile('images/123.jpeg')
}

function formatBox (box, imgHeight, imgWidth, percentage) {
  let newX = box._x - box._x*percentage
  const reduceX = box._x - newX

  let newY = box._y - box._y*percentage
  const reduceY = box._y - newY

  newX = newX > 0 ? newX : 0
  newY = newY > 0 ? newY : 0
  const newH = box._height + 2*reduceY < imgHeight ? box._height + 2*reduceY : imgHeight
  const newW = box._width + 2*reduceX < imgWidth ? box._width + 2*reduceX : imgWidth
  
  return {
    top: parseInt(newY),
    left: parseInt(newX),
    width: parseInt(newW),
    height: parseInt(newH)
  }  
}

async function resizeImage(imageBuffer, maxWidth,  maxHeight ) {
  const image = await jimp.read(imageBuffer)
  if (image.bitmap.width > maxWidth || image.bitmap.height > maxHeight) {
    image.resize(jimp.AUTO, maxHeight);
  }
  return image.getBufferAsync(jimp.MIME_JPEG)
}

module.exports = {
  faceCropBuffer,
  resizeImage
}