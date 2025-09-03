import path from 'path';

/**
 * "/" 区切りのパスに変換する
 * @param inputPath 入力パス
 * @return "/" 区切りのパス
 */
export function toLinuxPath(inputPath: string): string {
  return inputPath.split(path.sep).join('/');
}
