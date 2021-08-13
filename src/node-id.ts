export type NodeId = string & {__brand: "NodeId"};

let nextNodeId = 101;
export function newNodeId(): NodeId {
  return (nextNodeId++).toString() as NodeId;
}
