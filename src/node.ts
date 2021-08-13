import { ArgumentNode } from "./argument-node";
import { LambdaNode } from "./lambda-node";
import { ApplyNode } from "./apply-node";

export type Node = ArgumentNode | LambdaNode | ApplyNode;
