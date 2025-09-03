export interface RootNode {
  path: string;
  contents: ContentsNode[];
}

export interface ContentsNodeMap {
  directory: DirectoryNode;
  file: FileNode;
}

export interface DirectoryNode {
  name: string;
  contents: ContentsNode[];
}

export interface FileNode {
  name: string;
  width: number;
  height: number;
}

export type Contents = keyof ContentsNodeMap;

type ContentsNodeWithType<K extends Contents> = ContentsNodeMap[K] & {
  type: K;
};

export type ContentsNode = {
  [K in Contents]: ContentsNodeWithType<K>;
}[Contents];
