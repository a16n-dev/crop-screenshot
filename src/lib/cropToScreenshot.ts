import * as Jimp from 'jimp';
import { getMostCommonValue } from './getMostCommonValue';
import { walkBoundary } from './walkBoundary';

// Controls the number of samples taken in the image
// more samples - better result but slower
// less samples - faster but less accurate
const SAMPLE_RANGE = 100;

/**
 * Crops a screenshot to the image contained in it
 */
export const cropToScreenshot = async (image: Jimp) => {
  const { width, height } = image.bitmap;

  const colors: number[] = [];

  const map: number[][] = [];

  const output = await Jimp.create(width, height, '#fff');

  for (let x = 0; x < SAMPLE_RANGE; x++) {
    const temp: number[] = [];
    for (let y = 0; y < SAMPLE_RANGE; y++) {
      const xCoord = Math.floor(x * (width / SAMPLE_RANGE));
      const yCoord = Math.floor(y * (height / SAMPLE_RANGE));
      const rgb = image.getPixelColor(xCoord, yCoord);

      temp.push(rgb);

      colors.push(rgb);
    }
    map.push(temp);
  }

  // Find the most common color and assume this is the background
  const common = Jimp.intToRGBA(getMostCommonValue(colors));

  // Map each sample to either 0 - background or 1 - image
  map.forEach((row, y) => {
    row.forEach((color, x) => {
      const diff = Jimp.colorDiff(Jimp.intToRGBA(color), common);

      if (diff < 0.0001) {
        map[y][x] = 0;
      } else {
        map[y][x] = 1;
      }
    });
  });

  const [minX, minY, maxX, maxY] = walkBoundary(map);

  const minXCoord = Math.floor(minX * (width / SAMPLE_RANGE));
  const minYCoord = Math.floor(minY * (height / SAMPLE_RANGE));
  const maxXCoord = Math.floor(maxX * (width / SAMPLE_RANGE));
  const maxYCoord = Math.floor(maxY * (height / SAMPLE_RANGE));

  image.crop(
    minXCoord,
    minYCoord,
    maxXCoord - minXCoord,
    maxYCoord - minYCoord,
  );

  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      const xCoord = Math.floor(y * (width / SAMPLE_RANGE));
      const yCoord = Math.floor(x * (height / SAMPLE_RANGE));

      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          output.setPixelColor(
            cell === 2
              ? Jimp.rgbaToInt(0, 255, 0, 255)
              : cell === 1
              ? Jimp.rgbaToInt(0, 0, 0, 0)
              : Jimp.rgbaToInt(255, 0, 0, 255),
            xCoord + i,
            yCoord + j,
          );
        }
      }
    });
  });

  return image;
};
