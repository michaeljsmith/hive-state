import { ArgumentId, enclosureArgumentId } from "./argument-id.js";
import { getInstanceArgument, InstanceData } from "./instance-node.js";
import { Block, BlockData, getEnclosure, getEnclosureData, getNodeData } from "./block.js";
import { NodeId } from "./node-id.js";
import { Accessor } from "./accessor.js";
import { lambdaAccessor } from "./lambda.js";

export function argumentAccessor(block: Block, blockData: BlockData, nodeId: NodeId, argumentId: ArgumentId): Accessor {
  const node = block.nodes.get(nodeId);
  if (node === undefined) {
    // Node not defined here - check the enclosing scope.
    return argumentAccessor(getEnclosure(block), getEnclosureData(blockData), nodeId, argumentId);
  } else if (node.type === 'instance') {
    // -1 is an implicit argument representing the enclosing block data.
    if (argumentId === enclosureArgumentId) {
      if (node.lambdaNodeId === undefined) {
        // This block has no enclosure.
        return lambdaAccessor(null);
      }
      return nodeAccessor(block, blockData, node.lambdaNodeId);
    }

    // Otherwise, look up the argument in the standard arguments map.
    const argumentNodeId = getInstanceArgument(node, argumentId);
    return nodeAccessor(block, blockData, argumentNodeId);
  } else if (node.type === 'argument' || node.type === 'lambda') {
    throw 'node has no arguments';
  } else {
    ((_: never) => {throw 'unexpected type';})(node);
  }
}

export function nodeAccessor(block: Block, blockData: BlockData, nodeId: NodeId): Accessor {
  const node = block.nodes.get(nodeId);
  if (node === undefined) {
    // Node not defined here - check the enclosing scope.
    return nodeAccessor(getEnclosure(block), getEnclosureData(blockData), nodeId);
  } else if (node.type === 'argument') {
    // Recurse to the caller
    return blockData.context.argumentAccessor(node.argumentId);
  } else if (node.type === 'lambda') {
    // Apply the query - consider the data to be the block data, since that
    // is the only relevant data for a lambda.
    return lambdaAccessor(blockData);
  } else if (node.type === 'instance') {
    // Recurse to the instance.
    const instanceData = getNodeData(blockData, nodeId) as InstanceData;
    return node.functor.accessor(instanceData.data, instanceData.context);
  } else {
    ((_: never) => {throw 'unexpected type';})(node);
  }
}
