import { ApplyData, ApplyNode } from "./apply-node.js";
import { Block, BlockData, getLocalNode } from "./block.js";
import { NodeContextData } from "./node-context.js";
import { Node } from "./node.js";
import { queryNodeData } from "./query-argument.js";

export function constructBlock(block: Block, encloser: BlockData, caller: NodeContextData): BlockData {
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
  const encloserData = queryNodeData(node.parent, parent, node.lambda, (input) => input as BlockData);

  // We need to construct the new block, passing in the object we are
  // constructing as a parameter. This is potentially unsafe, since the value
  // is not constructed yet, so we need to promise not to use the data at
  // this point.
  //
  // Unfortunately there's no straightforward way to express this promise to
  // Typescript, so we need to do a cast.
  const data = {} as ApplyData;
  const context = {context: data};
  data.parent = parent;
  const blockData = constructBlock(node.block, encloserData, context);
  data.block = blockData;
  return data;
}
