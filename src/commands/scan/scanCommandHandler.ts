import fs from 'fs/promises';
import path from 'path';
import type { ScanArgs } from './scanCommand.js';
import { scanMetadata } from './metadataScanner.js';
import { toLinuxPath } from '../pathUtils.js';

export interface ScanCommandHandler {
  handle: (args: ScanArgs) => Promise<void>;
}

export class ConsoleOutputHandler implements ScanCommandHandler {
  public async handle(args: ScanArgs) {
    console.log('input-dir:', args.inputDir);
    console.log('output-file:', args.outputFile);
    console.log('ext:', args.extensions.join(', '));
  }
}

export class OutputMetadataHandler implements ScanCommandHandler {
  public async handle(args: ScanArgs) {
    // 絶対パスに変換
    const inputAbsoluteDirPath = toLinuxPath(path.resolve(args.inputDir));
    const outputAbsoluteFilePath = toLinuxPath(path.resolve(args.outputFile));
    console.log(`[scan] Scanning directory tree: ${inputAbsoluteDirPath}`);

    try {
      const metaTree = await scanMetadata(
        inputAbsoluteDirPath,
        outputAbsoluteFilePath,
        args.extensions,
      );
      await fs.writeFile(
        outputAbsoluteFilePath,
        JSON.stringify(metaTree, null, 2),
        'utf-8',
      );
      console.log(`[scan] Metadata tree written to ${outputAbsoluteFilePath}`);
    } catch (e) {
      console.error('[scan] Error:', e);
    }
  }
}
