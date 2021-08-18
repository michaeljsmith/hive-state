import { ArgumentNode } from "./argument-node";
import { InstanceNode } from "./instance-node";
import { LambdaNode } from "./lambda-node";

export type Node = ArgumentNode | LambdaNode | InstanceNode;
