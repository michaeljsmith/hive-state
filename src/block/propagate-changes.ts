import { ArgumentId, enclosureArgumentId } from "./argument-id.js";
import { Block, BlockData, getNode, getNodeData } from "./block.js";
import { Change } from "./change.js";
import { InstanceData } from "./instance-data.js";
import { LambdaChange, lambdaChange } from "./lambda.js";
import { NodeId } from "./node-id.js";

export function propagateChanges(
    block: Block,
    blockData: BlockData,
    argumentChanges: Map<ArgumentId, Change>,
    nodeChanges: Map<NodeId, Change>)
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
    blockData.context.handleOutputChange(outputChange);
  }
}

function generalPropagateChanges(
    block: Block,
    blockData: BlockData,
    startNodeIndex: number,
    nodeChanges: Map<NodeId, Change>,
    argumentChanges: Map<ArgumentId, Change>)
: Change | undefined {
  for (let nodeIndex = startNodeIndex; nodeIndex < block.nodeOrder.length; ++nodeIndex) {
    const nodeId = block.nodeOrder[nodeIndex];
    const node = getNode(block, nodeId);
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
    } else if (node.type === 'instance') {
      // Assemble the argument changes.
      const argumentChanges = new Map<ArgumentId, Change | undefined>();
      for (const [argumentId, nodeId] of node.arguments) {
        argumentChanges.set(argumentId, nodeChanges.get(nodeId))
      }

      // Get the enclosure changes - pass them to functor using the implicit argument ID (-1).
      if (node.lambdaNodeId !== undefined) {
        const lambdaChange = nodeChanges.get(node.lambdaNodeId) as LambdaChange | undefined;
        if (lambdaChange != undefined) {
          argumentChanges.set(enclosureArgumentId, lambdaChange);
        }
      }

      // Recurse to the functor.
      const instanceData = getNodeData(blockData, nodeId) as InstanceData;
      // TODO: Should we change so that node changes reference the encloser changes, rather than being a flat list?
      // This should work, but it is adding extra items to the end of the list that are still there the next time
      // the lambda is invoked so seems unsafe.
      change = node.functor.handleArgumentChanges(instanceData.data, instanceData.context, argumentChanges);
    } else {
      ((_: never) => { throw 'Unknown type'; })(node);
    }

    if (change === undefined) {
      nodeChanges.delete(nodeId);
    } else {
      nodeChanges.set(nodeId, change);
    }
  }

  return nodeChanges.get(block.outputNodeId);
}
