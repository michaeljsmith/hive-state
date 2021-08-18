export type ArgumentId = number & {__brand: "ArgumentId"};

export function asArgumentId(label: number): ArgumentId {
  return label as ArgumentId;
}

export const enclosureArgumentId = asArgumentId(-1);