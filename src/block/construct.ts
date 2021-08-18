import { enclosureArgumentId } from "./argument-id.js";
import { Block, BlockData, getNode } from "./block.js";
import { InstanceData, InstanceNode } from "./instance-node.js";
import { NodeContext } from "./node-context.js";
import { NodeId } from "./node-id.js";
import { Node } from "./node.js";
import { propagateNodeChange } from "./propagate-changes.js";
import { queryArgument } from "./query-argument.js";

export function constructBlock(block: Block, context: NodeContext): BlockData {
  // Query the enclosure, using the special implicit argument ID.
  const enclosure = context.queryArgument(enclosureArgumentId, (input) => input as BlockData);

  const data: BlockData = {
    enclosure,
    context,
    nodes: new Map(),
  };
  for (const nodeId of block.nodeOrder) {
    const node = getNode(block, nodeId);
    const nodeData = constructNode(block, data, nodeId, node);
    if (nodeData !== undefined) {
      data.nodes.set(nodeId, nodeData);
    }
  }
  return data;
}

function constructNode(parent: Block, parentData: BlockData, nodeId: NodeId, node: Node): {} | undefined {
  if (node.type === 'argument') {
    return undefined;
  } else if (node.type === 'lambda') {
    return undefined;
  } else if (node.type === 'instance') {
    return constructInstanceNode(parent, parentData, nodeId, node);
  } else {
    ((_: never) => { throw 'unknown type'; })(node);
  }
}

function constructInstanceNode(parent: Block, parentData: BlockData, nodeId: NodeId, node: InstanceNode): InstanceData {
  const context: NodeContext = {
    handleOutputChange(change) {
      propagateNodeChange(parent, parentData, nodeId, change);
    },

    queryArgument(argumentId, query) {
      return queryArgument(parent, parentData, nodeId, argumentId, query);
    },
  };

  return {
    context,
    data: constructBlock(parent, context),
  };
}
