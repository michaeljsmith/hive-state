// Take never as argument, so that this type is a supertype of all queries
// (as opposed to taking undefined, which would make this a subtype due to
// contravariance).
export type Query<R> = (data: never) => R;
