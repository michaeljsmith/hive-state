import { ApplyData } from "./apply-node.js";
import { ArgumentId } from "./argument-id.js";
import { Block, BlockData, getLocalNode } from "./block.js";
import { Change } from "./change.js";
import { LambdaChange, lambdaChange } from "./lambda-node.js";
import { NodeId } from "./node-id.js";

export function propagateChanges(
    block: Block,
    blockData: BlockData,
    argumentChanges: Map<ArgumentId, Change | undefined>,
    nodeChanges: Map<NodeId, Change | undefined>)
: Change | undefined {
  return generalPropagateChanges(block, blockData, 0, nodeChanges, argumentChanges);
}

export function propagateNodeChange(
    block: Block,
    blockData: BlockData,
    nodeId: NodeId,
    change: Change)
: void {
  const nodeChanges = new Map<NodeId, Change>();
  nodeChanges.set(nodeId, change);
  // TODO: Optimize this linear search.
  const nodeIndex = block.nodeOrder.indexOf(nodeId);
  if (nodeIndex === -1) {
    throw 'invalid node';
  }
  const outputChange = generalPropagateChanges(block, blockData, nodeIndex, nodeChanges, new Map());

  // Recurse to caller block.
  if (outputChange !== undefined) {
    block.caller.handleOutputChange(blockData.caller, outputChange);
  }
}

function generalPropagateChanges(
    block: Block,
    blockData: BlockData,
    startNodeIndex: number,
    nodeChanges: Map<NodeId, Change | undefined>,
    argumentChanges: Map<ArgumentId, Change | undefined>)
: Change | undefined {
  for (let nodeIndex = startNodeIndex; nodeIndex < block.nodeOrder.length; ++nodeIndex) {
    const nodeId = block.nodeOrder[nodeIndex];
    const node = getLocalNode(block, nodeId);
    let change: Change | undefined;
    if (node.type === 'argument') {
      change = argumentChanges.get(node.argumentId);
    } else if (node.type === 'lambda') {
      // Since we are continuing to mutate nodeChanges here, it would
      // generally be best practice to defensively copy it before passing it
      // to lambdaChange, which will store a reference to it.
      //
      // However, we know that applications of the lambda will only reference
      // preceding nodes, so changes to later nodes will have no impact.
      // Therefore we can get away without copying.
      change = lambdaChange(nodeChanges);
    } else {
      // Assemble the argument changes.
      const argumentChanges = new Map<ArgumentId, Change | undefined>();
      for (const [argumentId, nodeId] of node.arguments) {
        argumentChanges.set(argumentId, nodeChanges.get(nodeId))
      }

      // Get the encloser changes.
      const lambdaChange = nodeChanges.get(node.lambda) as LambdaChange | undefined;
      const encloserChanges = lambdaChange?.nodeChanges ?? new Map<NodeId, Change | undefined>();

      // Recurse to the apply block.
      const applyData = blockData.nodes.get(nodeId) as ApplyData | undefined;
      if (applyData === undefined) {
        throw 'Missing node data';
      }
      // TODO: Should we change so that node changes reference the encloser changes, rather than being a flat list?
      // This should work, but it is adding extra items to the end of the list that are still there the next time
      // the lambda is invoked so seems unsafe.
      change = propagateChanges(node.block, applyData.block, argumentChanges, encloserChanges);
    }

    nodeChanges.set(nodeId, change);
  }

  return nodeChanges.get(block.outputNodeId);
}
