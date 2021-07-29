export interface Scope {
  parent: Scope | null;
};

export function childScope(parent: Scope): Scope {
  return {
    parent,
  };
}
