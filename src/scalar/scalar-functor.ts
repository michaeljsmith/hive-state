import { ArgumentId, Change, Functor, Query } from "../block/index.js";
import { NodeContext, NodeContextData } from "../block/node-context.js";

interface ScalarData<T> {
  value: T;
}

export class ScalarFunctor<T> implements Functor {
  initialValue: T;

  constructor(initialValue: T) {
    this.initialValue = initialValue;
  }

  construct(_context: NodeContext, _contextData: NodeContextData): {} | undefined {
    const data: ScalarData<T> = {
      value: this.initialValue,
    };
    return data;
  }

  handleArgumentChanges(_data: {} | undefined, _context: NodeContext, _contextData: NodeContextData, _argumentChanges: Map<ArgumentId, Change | undefined>): Change | undefined {
    return undefined;
  }

  handleQuery<R>(data: {} | undefined, _context: NodeContext, _contextData: NodeContextData, query: Query<R>): R {
    const scalarData = data as ScalarData<T> | undefined;
    if (scalarData === undefined) {
      throw 'Missing data';
    }

    return query(scalarData.value as never);
  }
}
