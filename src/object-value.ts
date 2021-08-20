import { ObjectType } from "./object/index.js";
import { Value } from "./value.js";

export class ObjectValue<O extends {}> extends Value<ObjectType<O>> {
}
