import { Accessor } from "./accessor.js";
import { ArgumentId } from "./argument-id.js";
import { Change } from "./change.js";

export interface NodeContext {
  argumentAccessor(argumentId: ArgumentId): Accessor;
  handleOutputChange(change: Change): void;
}
