import { expect } from "chai";
import { Value, host, lambda, native, object, scalar, ChangeFor } from "../index.js";
import { ObjectType } from "../object/index.js";
import { ScalarType } from "../scalar/index.js";

function testMutator(result: [number]) {
  return {
    mutate(key: string, change: never) {
      if (key === "result") {
        (change as unknown as ChangeFor<ScalarType<number>>)({set(value) {result[0] = value;}})
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
});
