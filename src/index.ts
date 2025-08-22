import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import scan from './commands/scan/scan.js';
import build from './commands/build/build.js';

yargs(hideBin(process.argv))
  .scriptName('photo-gallery-cli')
  .command(scan)
  .command(build)
  .demandCommand(1, 'コマンドを指定してください')
  .help()
  .parse();
