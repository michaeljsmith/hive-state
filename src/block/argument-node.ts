import { ArgumentId } from "./argument-id.js";

export interface ArgumentNode {
  type: 'argument';
  argumentId: ArgumentId;
}
