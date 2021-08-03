export type InstanceId = number & { __brand: "InstanceId"; };

let nextInstanceId = 101;
export function newInstanceId(): InstanceId {
  return nextInstanceId++ as InstanceId;
}
