import { expect } from "chai";
import { Value, host, lambda, native, object, scalar, ChangeFor, table } from "../index.js";
import { MutableScalarType, ScalarType } from "../scalar/index.js";
import { MutableTableType, TableKey } from "../table/index.js";

function testMutator(result: [number]) {
  return {
    mutate(key: string, change: never) {
      if (key === "result") {
        (change as unknown as ChangeFor<ScalarType<number>>)({set(value) {result[0] = value;}})
      }
    }
  };
}

function testTableMutator(result: Map<TableKey, number>) {
  return {
    mutate(key: string, change: never) {
      if (key === "result") {
        (change as unknown as ChangeFor<MutableTableType<MutableScalarType<number>>>)({
          
          mutate(key, change) {
            change({set(value) {result.set(key, value);},})
          },
          insert() {},
          delete() {},
          clear() {},
        })
      }
    }
  };
}

describe('hive/react', function() {
  it('evaluates trival block', function() {
    const accessor = host(() => scalar(3));
    expect(accessor.get()).equals(3);
    accessor.setter()(5);
    expect(accessor.get()).equals(5);
  });

  it('propagates change in trivial block', function() {
    const result = [0];
    const accessor = host(() => scalar(0), {set(value) {result[0] = value;}});
    accessor.setter()(2);
    expect(result[0]).equals(2);
  });

  it('evaluates object', function() {
    const accessor = host(() => object({x: scalar(3)}));
    expect(accessor.get("x").get()).equals(3);
  });

  it('evaluates property', function() {
    const accessor = host(() => {
      const obj = object({x: scalar(7)});
      return obj.get("x");
    });
    expect(accessor.get()).equals(7);
  });

  it('propagates property', function() {
    const accessor = host(() => {
      const param = scalar(2);
      const prop = object({x: param}).get("x");
      return object({param, prop});
    });
    accessor.get("param").setter()(3);
    expect(accessor.get("prop").get()).equals(3);
  });

  it('evaluates native call', function() {
    const sum = native((x: number, y: number) => x + y);
    const accessor = host(() => {
      const param = scalar(3);
      const result = sum(param, scalar(4));
      return object({param, result});
    });
    expect(accessor.get("result").get()).equals(7);
    accessor.get("param").setter()(1);
    expect(accessor.get("result").get()).equals(5);
  });

  it('evaluates lambda', function() {
    const sum = native((x: number, y: number) => x + y);
    const result: [number] = [0];
    const accessor = host(() => {
      const capture = scalar(2);
      const fn = lambda((x: Value<ScalarType<number>>) => {
        return sum(capture, x);
      });
      const argument = scalar(1);
      const result = fn(argument);
      return object({capture, argument, result});
    }, testMutator(result));
    expect(accessor.get("result").get()).equals(3);
    accessor.get("capture").setter()(3);
    expect(accessor.get("result").get()).equals(4);
    expect(result[0]).equals(4);
    accessor.get("argument").setter()(2);
    expect(accessor.get("result").get()).equals(5);
    expect(result[0]).equals(5);
  });

  it('evaluates simple table', function() {
    const accessor = host(() => {
      return table(() => scalar(0));
    });
    const key0 = accessor.inserter()(null);
    const key1 = accessor.inserter()(null);
    accessor.get(key0).setter()(1);
    accessor.get(key1).setter()(2);
    const values = [...accessor.entries()].map((x) => x.accessor.get());
    expect(values).ordered.members([1, 2]);
  });

  it('propagates captures into table', function() {
    const entries = new Map<TableKey, number>();
    const accessor = host(() => {
      const param = scalar(0);
      const result = table(() => param);
      return object({param, result});
    }, testTableMutator(entries));
    const key0 = accessor.get('result').inserter()(null);
    const key1 = accessor.get('result').inserter()(null);
    accessor.get('param').setter()(1);
    const values = [...accessor.get('result').entries()].map((x) => x.accessor.get());
    expect(values).ordered.members([1, 1]);
    const reactiveValues = [...entries.entries()].sort(([l], [r]) => l < r ? -1 : l > r ? 1 : 0).map((e) => e[1]);
    expect(reactiveValues).ordered.members([1, 1]);
  });
});
