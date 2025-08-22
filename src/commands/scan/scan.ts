import type { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';
import fs from 'fs/promises';
import path from 'path';
import { scanMetadata } from './metadataScanner.js';

interface ScanArgs {
  root: string;
  ext: string;
  out: string;
}

const command: CommandModule<{}, ScanArgs> = {
  command: 'scan',
  describe: '指定フォルダ内の画像をスキャンしてmetadata.jsonを生成',
  builder: (yargs: Argv) =>
    yargs
      .option('root', {
        alias: 'r',
        type: 'string',
        demandOption: true,
        describe: 'スキャンするルートフォルダ',
      })
      .option('ext', {
        alias: 'e',
        type: 'string',
        default: 'jpg,png',
        describe: '対象拡張子（カンマ区切り）',
      })
      .option('out', {
        alias: 'o',
        type: 'string',
        default: './metadata.json',
        describe: '出力するJSONファイルパス',
      }),
  handler: async (argv) => {
    outputArguments(argv);
    await handle(argv);
  },
};

function outputArguments(argv: ArgumentsCamelCase<ScanArgs>): void {
  console.log('root:', argv.root);
  console.log('ext:', argv.ext);
  console.log('out:', argv.out);
}

async function handle(argv: ArgumentsCamelCase<ScanArgs>) {
  const exts = argv.ext.split(',').map((e) => e.trim().toLowerCase());
  const rootDir = path.resolve(argv.root);
  console.log(`[scan] Scanning directory tree: ${rootDir}`);

  try {
    const metaTree = await scanMetadata(rootDir, exts);
    await fs.writeFile(argv.out, JSON.stringify(metaTree, null, 2), 'utf-8');
    console.log(`[scan] Metadata tree written to ${argv.out}`);
  } catch (e) {
    console.error('[scan] Error:', e);
  }
}

// async function handle(argv: ArgumentsCamelCase<ScanArgs>): Promise<void> {
//   const exts = argv.ext.split(',').map((e) => e.trim().toLowerCase());
//   const rootDir = path.resolve(argv.root);
//   console.log(`[scan] Scanning directory: ${rootDir}`);
//   try {
//     const files = await scanImages(rootDir, exts);
//     console.log(`[scan] Found ${files.length} image(s)`);
//     files.forEach((f) => console.log(f));
//     const metadata = loadImagesMeta(rootDir, files);
//     await fs.writeFile(argv.out, JSON.stringify(metadata, null, 2), 'utf-8');
//     console.log(`[scan] Metadata written to ${argv.out}`);
//   } catch (e) {
//     console.error('[scan] Error:', e);
//   }
// }

// function loadImagesMeta(rootDir: string, imagePaths: string[]): ImageMeta[] {
//   return imagePaths.map((imagePath) => loadImageMeta(rootDir, imagePath));
// }
//
// function loadImageMeta(rootDir: string, imagePath: string): ImageMeta {
//   // とりあえず画像パスだけを対象にする
//   return {
//     path: path.relative(rootDir, imagePath),
//   };
// }

export default command;
