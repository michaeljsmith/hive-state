export interface ValueTypeTemplate<Accessor, Mutator> {
  __MARKER_VALUE: true; // TODO: Refine this.
  __QUERY_BRANDING: Accessor;
  __CHANGE_BRANDING: Mutator;
}

export type ValueType = ValueTypeTemplate<unknown, unknown>;

export type AccessorFor<V extends ValueType> =
  V extends ValueTypeTemplate<infer A, unknown> ? A : never;

export type Mutator<V extends ValueType> =
  V extends ValueTypeTemplate<unknown, infer M> ? M : never;

export type ChangeFor<V extends ValueType> = (mutator: Mutator<V>) => void;
