export type ArgumentId = string & {__brand: "ArgumentId"};

export function asArgumentId(label: string): ArgumentId {
  return label as ArgumentId;
}

export const enclosureArgumentId = asArgumentId("#enclosure");