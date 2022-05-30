import { Command } from 'commander';
import * as Jimp from 'jimp';
import { Opts } from './util/cli';
import { cropToScreenshot } from './lib/cropToScreenshot';

const main = async (program: Command) => {
  const opts = program.opts<Opts>();

  const imagePath = opts.image;

  const img = await Jimp.read(imagePath);

  const result = await cropToScreenshot(img);

  result.write(`${imagePath.split('.')[0]}-crop.png`);
};

export default main;
