import type { BuildArgs } from '../buildCommand.js';
import type {
  ContentsNode,
  ContentsNodeWithType,
  RootNode,
} from '../../metadataNode.js';
import fs from 'fs/promises';
import path from 'path';
import { pageTemplate } from '../pageTemplate.js';
import { createLazyImage } from '../components/lazy-image.js';
import { escapeHtml } from '../htmlHelper.js';
import {
  type BuildCommandHandler,
  SIDEBAR_TREE_CLASS_NAME,
} from './buildCommandHandler';

export class GalleryOutputHandler implements BuildCommandHandler {
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
      true,
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
    isRoot: boolean,
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
      const anchor = `<a href="#${address}">${this.buildFolderSVG()} ${directoryName} (${imageCount})</a>`;
      sidebarElement = `<li>${anchor}</li>`;
    }

    const directories = this.getDirectories(contents);
    if (directories.length > 0) {
      const sidebarElements: string[] = [];
      directories.forEach((directory, index) => {
        const directoryPath = path.join(baseDirectoryPath, directory.name);
        const {
          mainElements: childMainElements,
          sidebarElement: childSidebarElement,
        } = this.buildElements(
          directoryPath,
          `${address}-${index}`,
          `${breadcrumbs}${directory.name}/`,
          directory.contents,
          false,
        );
        mainElements.push(...childMainElements);
        if (childSidebarElement !== null) {
          sidebarElements.push(childSidebarElement);
        }
      });

      if (sidebarElements.length > 0 || fileExists) {
        const directoryName = path.basename(breadcrumbs) || '/';
        const anchorOrSpan = fileExists
          ? `<a href="#${address}">${this.buildFolderSVG()} ${directoryName} (${imageCount})</a>`
          : `<span>${this.buildFolderSVG()} ${directoryName}</span>`;
        const childrenHtml =
          sidebarElements.length > 0 ? `${sidebarElements.join('\n')}` : '';
        sidebarElement = `
          <li>
            ${anchorOrSpan}
            ${childrenHtml}
          </li>
        `;
      }
    }

    const styles = isRoot ? SIDEBAR_TREE_CLASS_NAME : '';
    return {
      mainElements,
      sidebarElement:
        sidebarElement === null
          ? null
          : `<ul class="${styles}">${sidebarElement}</ul>`,
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

  private buildFolderSVG(): string {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <g transform="translate(1.4 1.4) scale(2.81 2.81)">
          <path d="M0 68.798v11.914c0 1.713 1.401 3.114 3.114 3.114h0c3.344 0 4.805-2.642 4.805-2.642L8.14 29.281l2.739-2.827l72.894-2.977v-1.482c0-2.396-1.942-4.338-4.338-4.338H50.236c-1.15 0-2.254-0.457-3.067-1.27l-8.943-8.943c-0.813-0.813-1.917-1.27-3.067-1.27H4.338C1.942 6.174 0 8.116 0 10.512v7.146v2.332V68.798" fill="rgb(224,173,49)"/>
          <path d="M3.114 83.826c1.713 0 3.114-1.401 3.114-3.114V27.81c0-2.393 1.94-4.333 4.333-4.333h75.107c2.393 0 4.333 1.94 4.333 4.333v51.684c0 2.393-1.94 4.333-4.333 4.333H3.114z" fill="rgb(255,200,67)"/>
        </g>
      </svg>
    `;
  }
}
