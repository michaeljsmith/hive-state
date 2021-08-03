export type ArgumentId = number & {__brand: "ArgumentId"};

let nextArgumentId = 201;
export function newArgumentId(): ArgumentId {
  return nextArgumentId++ as ArgumentId;
}
