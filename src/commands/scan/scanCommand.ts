import type { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';
import {
  ConsoleOutputHandler,
  OutputMetadataHandler,
  type ScanCommandHandler,
} from './scanCommandHandler.js';
import { DEFAULT_METADATA_FILE_NAME } from '../consts.js';

export interface PrimitiveScanArgs {
  'input-dir': string;
  'output-file': string;
  ext: string;
}

export interface ScanArgs {
  inputDir: string;
  outputFile: string;
  extensions: string[];
}

type ScanCommandModule = CommandModule<unknown, PrimitiveScanArgs>;

const command: ScanCommandModule = {
  command: 'scan',
  describe: '指定フォルダ内の画像をスキャンしてmetadata.jsonを生成',
  builder: (yargs: Argv) =>
    yargs
      .option('input-dir', {
        alias: 'i',
        type: 'string',
        demandOption: true,
        describe: 'スキャン対象のフォルダ',
      })
      .option('output-file', {
        alias: 'o',
        type: 'string',
        default: `./${DEFAULT_METADATA_FILE_NAME}`,
        describe: 'スキャン結果の出力ファイル',
      })
      .option('ext', {
        alias: 'e',
        type: 'string',
        default: 'jpg,jpeg,png',
        describe: '対象拡張子(（)カンマ区切り)',
      }),
  handler: async (argv) => await handleArgv(argv),
};

async function handleArgv(argv: ArgumentsCamelCase<PrimitiveScanArgs>) {
  const args: ScanArgs = {
    inputDir: argv.inputDir,
    outputFile: argv.outputFile,
    extensions: argv.ext.split(',').map((e) => e.trim().toLowerCase()),
  };
  await processHandlers(
    args,
    new ConsoleOutputHandler(),
    new OutputMetadataHandler(),
  );
}

async function processHandlers(
  args: ScanArgs,
  ...handlers: ScanCommandHandler[]
) {
  for (const handler of handlers) {
    await handler.handle(args);
  }
}

export default command;
