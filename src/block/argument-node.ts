import { ArgumentId } from "./argument-id.js";
import { BaseNode } from "./base-node";

export interface ArgumentNode extends BaseNode {
  type: 'argument';
  argumentId: ArgumentId;
}
