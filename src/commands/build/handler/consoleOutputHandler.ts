import type { BuildArgs } from '../buildCommand';
import type { BuildCommandHandler } from './buildCommandHandler';

export class ConsoleOutputHandler implements BuildCommandHandler {
  public async handle(args: BuildArgs) {
    console.log('input-file:', args.inputFile);
    console.log('output-file:', args.outputFile);
  }
}
