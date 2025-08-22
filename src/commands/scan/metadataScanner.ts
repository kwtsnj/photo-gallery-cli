import fs, { readFile } from 'fs/promises';
import path from 'path';
import { imageSize } from 'image-size';
import type { ContentsNode, RootNode } from '../metadataNode.js';

export async function scanMetadata(
  basePath: string,
  exts: string[],
): Promise<RootNode> {
  return {
    absolutePath: basePath,
    contents: await scanContents(basePath, exts),
  };
}

export async function scanContents(
  basePath: string,
  exts: string[],
): Promise<ContentsNode[]> {
  const contents: ContentsNode[] = [];

  const entities = await fs.readdir(basePath, { withFileTypes: true });
  const sortedEntities = entities.sort((a, b) => {
    // ディレクトリ優先
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    // 同じ種類の場合、名前の昇順
    return a.name.localeCompare(b.name, 'ja');
  });
  for (const entity of sortedEntities) {
    if (entity.isDirectory()) {
      const childDirectory = path.join(basePath, entity.name);
      const childContents = await scanContents(childDirectory, exts);
      contents.push({
        type: 'directory',
        name: entity.name,
        contents: childContents,
      });
    } else if (entity.isFile()) {
      const ext = path.extname(entity.name).slice(1).toLowerCase();
      if (exts.includes(ext)) {
        const filePath = path.join(basePath, entity.name);
        const size = await getImageSize(filePath);
        contents.push({
          type: 'file',
          name: entity.name,
          width: size.width,
          height: size.height,
        });
      }
    }
  }

  return contents;
}

async function getImageSize(path: string) {
  // ファイルを Uint8Array で取得
  const buffer = await readFile(path);
  const uint8 = new Uint8Array(buffer.buffer);
  return imageSize(uint8);
}
