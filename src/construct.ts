import { ApplyData, ApplyNode, getApplyNodeBlock } from "./apply-node.js";
import { Block, BlockData, findNodeParentDataById, getLocalNode } from "./block.js";
import { Node } from "./node.js";

export function constructBlock(block: Block, encloser: BlockData, caller: ApplyData): BlockData {
  const data: BlockData = {
    encloser,
    caller,
    nodes: new Map(),
  };
  for (const nodeId of block.nodeOrder) {
    const node = getLocalNode(block, nodeId);
    const nodeData = constructNode(node, data);
    if (nodeData !== undefined) {
      data.nodes.set(node.nodeId, nodeData);
    }
  }
  return data;
}

function constructNode(node: Node, parent: BlockData): {} | undefined {
  if (node.type === 'argument') {
    return undefined;
  } else if (node.type === 'lambda') {
    return undefined;
  } else {
    return constructApplyNode(node, parent);
  }
}

function constructApplyNode(node: ApplyNode, parent: BlockData): ApplyData {
  const lambdaBlock = getApplyNodeBlock(node);
  const encloser = findNodeParentDataById(node.parent, parent, node.lambda) as BlockData;

  // We need to construct the new block, passing in the object we are
  // constructing as a parameter. This is potentially unsafe, since the value
  // is not constructed yet, so we need to promise not to use the data at
  // this point.
  //
  // Unfortunately there's no straightforward way to express this promise to
  // Typescript, so we need to do a cast.
  const data: ApplyData = {} as ApplyData;
  data.parent = parent;
  const blockData = constructBlock(lambdaBlock, encloser, data);
  data.block = blockData;
  return data;
}
