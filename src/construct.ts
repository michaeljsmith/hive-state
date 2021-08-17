import { ApplyNode } from "./apply-node.js";
import { BaseParametricData } from "./base-parametric-node.js";
import { Block, BlockData, getLocalNode } from "./block.js";
import { NodeContextData } from "./node-context.js";
import { Node } from "./node.js";
import { PrimitiveNode } from "./primitive-node.js";
import { queryNode } from "./query-argument.js";

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
  } else if (node.type === 'primitive') {
    return constructPrimitiveNode(node, parent);
  } else if (node.type === 'apply') {
    return constructApplyNode(node, parent);
  } else {
    ((_: never) => { throw 'unknown type'; })(node);
  }
}

function constructPrimitiveNode(node: PrimitiveNode, parent: BlockData): BaseParametricData | undefined {
  return node.construct(parent);
}
 
function constructApplyNode(node: ApplyNode, parent: BlockData): BlockData {
  const encloserData = queryNode(node.parent, parent, node.lambda, (input) => input as BlockData);
  return constructBlock(node.block, encloserData, parent as unknown as NodeContextData);
}
