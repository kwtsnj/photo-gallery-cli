import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import scan from './commands/scan/scanCommand.js';
import build from './commands/build/buildCommand.js';

yargs(hideBin(process.argv))
  .scriptName('photo-gallery-cli')
  .command(scan)
  .command(build)
  .demandCommand(1, 'コマンドを指定してください')
  .help()
  .parse();
