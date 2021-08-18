import { ArgumentId } from "./argument-id.js";
import { getInstanceArgument, InstanceData } from "./instance-node.js";
import { Block, BlockData, getNodeData } from "./block.js";
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
    return queryArgument(block.enclosure, blockData.enclosure, nodeId, argumentId, query);
  } else if (node.type === 'instance') {
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
    return queryNode(block.enclosure, blockData.enclosure, nodeId, query);
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