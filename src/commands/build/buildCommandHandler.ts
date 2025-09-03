import fs from 'fs/promises';
import path from 'path';
import type { BuildArgs } from './buildCommand.js';
import type {
  ContentsNode,
  DirectoryNode,
  FileNode,
  RootNode,
} from '../metadataNode.js';
import { pageTemplate } from './pageTemplate.js';
import { createLazyImage } from './lazyImage.js';
import { escapeHtml } from './htmlHelper.js';

export interface BuildCommandHandler {
  handle: (args: BuildArgs) => Promise<void>;
}

export class ConsoleOutputHandler implements BuildCommandHandler {
  public async handle(args: BuildArgs) {
    console.log('input-file:', args.inputFile);
    console.log('output-file:', args.outputFile);
  }
}

export class GalleryHandler implements BuildCommandHandler {
  public async handle(args: BuildArgs) {
    await this.buildGallery(args.inputFile, args.outputFile);
  }

  private async buildGallery(jsonPath: string, outputFile: string) {
    const rootNode: RootNode = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const imgElements = this.convertToImage(
      rootNode.path,
      '/',
      rootNode.contents,
    );

    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(
      outputFile,
      pageTemplate(imgElements.join('\n')),
      'utf-8',
    );
    console.log(`Gallery generated at ${outputFile}`);
  }

  private convertToImage(
    baseDirectoryPath: string,
    hierarchy: string,
    contents: ContentsNode[],
  ): string[] {
    const htmlElements: string[] = [];

    const files = this.getFiles(contents);
    if (files.length > 0) {
      const photoElements: string[] = files.map((file) => {
        const filePath = path.join(baseDirectoryPath, file.name);
        return createLazyImage(filePath, file.name, file.width, file.height);
      });
      htmlElements.push(`
        <h2>${escapeHtml(hierarchy)}</h2>
        <div class="container">${photoElements.join('\n')}</div>
    `);
    }

    const directories = this.getDirectories(contents);
    if (directories.length > 0) {
      directories.forEach((directory) => {
        const directoryPath = path.join(baseDirectoryPath, directory.name);
        const childImages = this.convertToImage(
          directoryPath,
          `${hierarchy}${directory.name}/`,
          directory.contents,
        );
        htmlElements.push(...childImages);
      });
    }

    return htmlElements;
  }

  private getDirectories(contents: ContentsNode[]): DirectoryNode[] {
    return contents.filter((c) => c.type === 'directory');
  }

  private getFiles(contents: ContentsNode[]): FileNode[] {
    return contents.filter((c) => c.type === 'file');
  }
}
