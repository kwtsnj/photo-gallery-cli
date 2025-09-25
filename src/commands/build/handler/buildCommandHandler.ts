import type { BuildArgs } from '../buildCommand.js';

export const SIDEBAR_TREE_CLASS_NAME = 'sidebar-tree';

export interface BuildCommandHandler {
  handle: (args: BuildArgs) => Promise<void>;
}
