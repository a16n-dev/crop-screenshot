import { program } from 'commander';
import main from './main';

// cli options
program.option('--image <string>');

program.parse();

main(program);
