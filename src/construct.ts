import { ApplyData, ApplyNode } from "./apply-node.js";
import { Block, BlockData, findNodeById, findNodeParentDataById, getLocalNode } from "./block.js";
import { LambdaNode } from "./lambda-node.js";
import { NodeId } from "./node-id.js";
import { Node } from "./node.js";

class BlockDataImpl implements BlockData {
  encloser: BlockData;
  caller: ApplyData;
  nodeData: {[key: string]: {}} = {};

  constructor(encloser: BlockData, caller: ApplyData) {
    this.encloser = encloser;
    this.caller = caller;
  }

  getNode(nodeId: NodeId): {} {
    return this.nodeData[nodeId];
  }

  setNode(nodeId: NodeId, data: {}) {
    this.nodeData[nodeId] = data;
  }
}

export function constructBlock(block: Block, encloser: BlockData, caller: ApplyData): BlockData {
  const data = new BlockDataImpl(encloser, caller);
  for (const nodeId of block.nodeOrder) {
    const node = getLocalNode(block, nodeId);
    const nodeData = constructNode(node, data);
    if (nodeData !== undefined) {
      data.setNode(node.nodeId, nodeData);
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
  const lambdaNode = findNodeById(node.parent, node.lambda) as LambdaNode;
  if (lambdaNode.type !== 'lambda') {
    throw 'Wrong node type';
  }

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
  const blockData = constructBlock(lambdaNode.block, encloser, data);
  data.block = blockData;
  return data;
}
