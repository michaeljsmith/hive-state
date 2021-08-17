import { ArgumentNode } from "./argument-node";
import { LambdaNode } from "./lambda-node";
import { ApplyNode } from "./apply-node";
import { PrimitiveNode } from "./primitive-node.js";

export type Node = ArgumentNode | LambdaNode | ApplyNode | PrimitiveNode;
