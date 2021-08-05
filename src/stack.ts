export interface Frame {
  value: unknown;
  parent: Stack;
};

export type Stack = Frame | null;

export function push(stack: Stack, value: unknown): Frame {
  return {
    value,
    parent: stack,
  };
}

export function pop(stack: Frame): Frame {
  const parent = stack.parent;
  if (parent === null) {
    throw 'stack empty';
  }

  return parent;
}
