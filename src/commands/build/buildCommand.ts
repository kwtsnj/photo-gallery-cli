import type { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';
import { type BuildCommandHandler } from './handler/buildCommandHandler';
import { DEFAULT_METADATA_FILE_NAME } from '../consts.js';
import type { Camelize } from '../utilityTypes.js';
import { ConsoleOutputHandler } from './handler/consoleOutputHandler.js';
import { GalleryOutputHandler } from './handler/galleryOutputHandler.js';

interface PrimitiveBuildArgs {
  'input-file': string;
  'output-file': string;
}

export type BuildArgs = Camelize<PrimitiveBuildArgs>;

const command: CommandModule<{}, PrimitiveBuildArgs> = {
  command: 'build',
  describe: 'metadata.jsonからHTMLギャラリーを生成',
  builder: (yargs: Argv) =>
    yargs
      .option('input-file', {
        alias: ['i', 'input'],
        type: 'string',
        demandOption: true,
        default: `./${DEFAULT_METADATA_FILE_NAME}`,
        describe: 'metadata.json のパス',
      })
      .option('output-file', {
        alias: ['o', 'output'],
        type: 'string',
        default: './dist',
        describe: '出力先ディレクトリ',
      }),
  handler: async (argv) => await handleArgv(argv),
};

async function handleArgv(argv: ArgumentsCamelCase<PrimitiveBuildArgs>) {
  const args: BuildArgs = {
    inputFile: argv.inputFile,
    outputFile: argv.outputFile,
  };
  await processHandlers(
    args,
    new ConsoleOutputHandler(),
    new GalleryOutputHandler(),
  );
}

async function processHandlers(
  args: BuildArgs,
  ...handlers: BuildCommandHandler[]
) {
  for (const handler of handlers) {
    await handler.handle(args);
  }
}

export default command;
