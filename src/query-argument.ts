import { getApplyNodeArgument, getApplyNodeBlockData } from "./apply-node.js";
import { ArgumentId } from "./argument-id.js";
import { Block, BlockData } from "./block.js";
import { NodeId } from "./node-id.js";
import { Query } from "./query.js";

export function queryArgumentData<R>(
    block: Block,
    blockData: BlockData,
    nodeId: NodeId,
    argumentId: ArgumentId,
    query: Query<R>
): R {
  const node = block.nodes.get(nodeId);
  if (node === undefined) {
    // Node not defined here - check the enclosing scope.
    return queryArgumentData(block.encloser, blockData.encloser, nodeId, argumentId, query);
  } else if (node.type === 'apply') {
    const argumentNodeId = getApplyNodeArgument(node, argumentId);
    return queryNodeData(block, blockData, argumentNodeId, query);
  } else if (node.type === 'argument' || node.type === 'lambda') {
    throw 'node has no arguments';
  } else {
    const _exhaustiveCheck: never = node;
    throw 'unexpected type';
  }
}

export function queryNodeData<R>(
    block: Block,
    blockData: BlockData,
    nodeId: NodeId,
    query: Query<R>
): R {
  const node = block.nodes.get(nodeId);
  if (node === undefined) {
    // Node not defined here - check the enclosing scope.
    return queryNodeData(block.encloser, blockData.encloser, nodeId, query);
  } else if (node.type === 'argument') {
    // Recurse to the caller
    return queryArgumentData(block.caller.parent, blockData.caller.parent, block.caller.nodeId, node.argumentId, query);
  } else if (node.type === 'lambda') {
    // Apply the query - consider the data to be the block data, since that
    // is the only relevant data for a lambda.
    return query(blockData);
  } else if (node.type === 'apply') {
    // Recurse to the apply block.
    const childData = getApplyNodeBlockData(node, blockData);
    return queryNodeData(node.block, childData, node.block.outputNodeId, query);
  } else {
    const _exhaustiveCheck: never = node;
    throw 'unexpected type';
  }
}
