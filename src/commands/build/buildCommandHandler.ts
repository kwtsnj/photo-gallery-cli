import fs from 'fs/promises';
import path from 'path';
import type { BuildArgs } from './buildCommand.js';
import type {
  ContentsNode,
  ContentsNodeWithType,
  RootNode,
} from '../metadataNode.js';
import { pageTemplate } from './pageTemplate.js';
import { createLazyImage } from './components/lazy-image.js';
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
    const { mainElements, sidebarElement } = this.buildElements(
      rootNode.path,
      '0',
      '/',
      rootNode.contents,
    );

    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(
      outputFile,
      pageTemplate(mainElements.join('\n'), sidebarElement),
      'utf-8',
    );
    console.log(`Gallery generated at ${outputFile}`);
  }

  private buildElements(
    baseDirectoryPath: string,
    address: string,
    breadcrumbs: string,
    contents: ContentsNode[],
  ): {
    mainElements: string[];
    sidebarElement: string | null;
  } {
    const mainElements: string[] = [];
    let sidebarElement: string | null = null;

    const files = this.getFiles(contents);
    let imageCount = files.length;
    const fileExists = imageCount > 0;
    if (fileExists) {
      const photoElements: string[] = files.map((file) => {
        const filePath = path.join(baseDirectoryPath, file.name);
        return createLazyImage(filePath, file.name, file.width, file.height);
      });
      mainElements.push(`
        <image-container>
          <h2 id="${address}" slot="header">${escapeHtml(breadcrumbs)} (${imageCount})</h2>
          ${photoElements.join('\n')}
        </image-container>`);
      const directoryName = path.basename(breadcrumbs) || '/';
      const anchor = `<a href="#${address}">${directoryName} (${imageCount})</a>`;
      sidebarElement = `<li>${anchor}</li>`;
    }

    const directories = this.getDirectories(contents);
    if (directories.length > 0) {
      const sidebarListElements: string[] = [];
      directories.forEach((directory, index) => {
        const directoryPath = path.join(baseDirectoryPath, directory.name);
        const {
          mainElements: childMainElements,
          sidebarElement: childSidebarListElement,
        } = this.buildElements(
          directoryPath,
          `${address}-${index}`,
          `${breadcrumbs}${directory.name}/`,
          directory.contents,
        );
        mainElements.push(...childMainElements);
        if (childSidebarListElement !== null) {
          sidebarListElements.push(childSidebarListElement);
        }
      });

      if (sidebarListElements.length > 0 || fileExists) {
        const directoryName = path.basename(breadcrumbs) || '/';
        const anchorOrSpan = fileExists
          ? `<a href="#${address}">${directoryName} (${imageCount})</a>`
          : `<span>${directoryName}</span>`;
        const childrenHtml =
          sidebarListElements.length > 0
            ? `\n<ul>${sidebarListElements.join('\n')}</ul>`
            : '';
        sidebarElement = `<li>${anchorOrSpan}${childrenHtml}</li>`;
      }
    }

    return {
      mainElements,
      sidebarElement:
        sidebarElement === null ? null : `<ul>${sidebarElement}</ul>`,
    };
  }

  private getDirectories(
    contents: ContentsNode[],
  ): ContentsNodeWithType<'directory'>[] {
    return contents.filter((c) => this.isDirectory(c));
  }

  private getFiles(contents: ContentsNode[]): ContentsNodeWithType<'file'>[] {
    return contents.filter((c) => this.isFile(c));
  }

  private isDirectory(
    node: ContentsNode,
  ): node is ContentsNodeWithType<'directory'> {
    return node.type === 'directory';
  }

  private isFile(node: ContentsNode): node is ContentsNodeWithType<'file'> {
    return node.type === 'file';
  }
}
