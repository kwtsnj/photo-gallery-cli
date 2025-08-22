import fs from 'fs/promises';
import path from 'path';
import type { Argv, CommandModule } from 'yargs';
import type {
  ContentsNode,
  DirectoryNode,
  FileNode,
  RootNode,
} from '../metadataNode.js';
import { pageTemplate } from './pageTemplate.js';
import { escapeHtml } from './htmlHelper.js';
import { createLazyImage } from './lazyImage.js';

interface BuildArgs {
  json: string;
  theme: string;
  out: string;
}

const command: CommandModule<{}, BuildArgs> = {
  command: 'build',
  describe: 'metadata.jsonからHTMLギャラリーを生成',
  builder: (yargs: Argv) =>
    yargs
      .option('json', {
        alias: 'j',
        type: 'string',
        demandOption: true,
        default: './metadata.json',
        describe: 'metadata.json のパス',
      })
      .option('theme', {
        alias: 't',
        type: 'string',
        default: 'default',
        describe: 'テーマ名（例: default, dark）',
      })
      .option('out', {
        alias: 'o',
        type: 'string',
        default: './dist',
        describe: '出力先ディレクトリ',
      }),
  handler: async (argv) => {
    console.log('[build] 実行');
    console.log('json:', argv.json);
    console.log('theme:', argv.theme);
    console.log('out:', argv.out);
    try {
      await buildGallery(argv.json, argv.theme, argv.out);
    } catch (e) {
      console.error('Build failed:', e);
    }
  },
};

async function buildGallery(jsonPath: string, theme: string, outDir: string) {
  const rootNode: RootNode = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
  const imgElements = convertToImage(
    rootNode.absolutePath,
    '/',
    rootNode.contents,
  );

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, 'index.html'),
    pageTemplate(theme, imgElements.join('\n')),
    'utf-8',
  );
  console.log(`Gallery generated at ${path.join(outDir, 'index.html')}`);
}

function convertToImage(
  baseDirectoryPath: string,
  hierarchy: string,
  contents: ContentsNode[],
): string[] {
  const htmlElements: string[] = [];

  const files = getFiles(contents);
  if (files.length > 0) {
    const photoElements: string[] = files.map((file) => {
      const filePath = path.join(baseDirectoryPath, file.name);
      // return photoFrameTemplate(photoTemplate(filePath, file.name));
      return createLazyImage(filePath, file.name, file.width, file.height);
    });
    htmlElements.push(`
        <h2>${escapeHtml(hierarchy)}</h2>
        <div class="container">${photoElements.join('\n')}</div>
    `);
  }

  const directories = getDirectories(contents);
  if (directories.length > 0) {
    directories.forEach((directory) => {
      const directoryPath = path.join(baseDirectoryPath, directory.name);
      const childImages = convertToImage(
        directoryPath,
        `${hierarchy}${directory.name}/`,
        directory.contents,
      );
      htmlElements.push(...childImages);
    });
  }

  return htmlElements;
}

function getDirectories(contents: ContentsNode[]): DirectoryNode[] {
  return contents.filter((c) => c.type === 'directory');
}

function getFiles(contents: ContentsNode[]): FileNode[] {
  return contents.filter((c) => c.type === 'file');
}

export default command;
