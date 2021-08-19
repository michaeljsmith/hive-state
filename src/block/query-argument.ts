import { ArgumentId, enclosureArgumentId } from "./argument-id.js";
import { getInstanceArgument, InstanceData } from "./instance-node.js";
import { Block, BlockData, getEnclosure, getEnclosureData, getNodeData } from "./block.js";
import { NodeId } from "./node-id.js";
import { Query } from "./query.js";

export function queryArgument<R>(
    block: Block,
    blockData: BlockData,
    nodeId: NodeId,
    argumentId: ArgumentId,
    query: Query<R>
): R {
  const node = block.nodes.get(nodeId);
  if (node === undefined) {
    // Node not defined here - check the enclosing scope.
    return queryArgument(getEnclosure(block), getEnclosureData(blockData), nodeId, argumentId, query);
  } else if (node.type === 'instance') {
    // -1 is an implicit argument representing the enclosing block data.
    if (argumentId === enclosureArgumentId) {
      if (node.lambdaNodeId === undefined) {
        // This block has no enclosure.
        return query(undefined as never);
      }
      return queryNode(block, blockData, node.lambdaNodeId, query);
    }

    // Otherwise, look up the argument in the standard arguments map.
    const argumentNodeId = getInstanceArgument(node, argumentId);
    return queryNode(block, blockData, argumentNodeId, query);
  } else if (node.type === 'argument' || node.type === 'lambda') {
    throw 'node has no arguments';
  } else {
    ((_: never) => {throw 'unexpected type';})(node);
  }
}

export function queryNode<R>(
    block: Block,
    blockData: BlockData,
    nodeId: NodeId,
    query: Query<R>
): R {
  const node = block.nodes.get(nodeId);
  if (node === undefined) {
    // Node not defined here - check the enclosing scope.
    return queryNode(getEnclosure(block), getEnclosureData(blockData), nodeId, query);
  } else if (node.type === 'argument') {
    // Recurse to the caller
    return blockData.context.queryArgument(node.argumentId, query);
  } else if (node.type === 'lambda') {
    // Apply the query - consider the data to be the block data, since that
    // is the only relevant data for a lambda.
    return query(blockData as never);
  } else if (node.type === 'instance') {
    // Recurse to the instance.
    const instanceData = getNodeData(blockData, nodeId) as InstanceData;
    return node.functor.handleQuery(instanceData.data, instanceData.context, query);
  } else {
    ((_: never) => {throw 'unexpected type';})(node);
  }
}
