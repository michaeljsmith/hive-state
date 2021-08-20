import { expect } from "chai";
import { host, native, object, scalar } from "../index.js";

describe('hive/react', function() {
  it('evaluates trival block', function() {
    const accessor = host(() => scalar(3));
    expect(accessor.get()).equals(3);
    accessor.setter()(5);
    expect(accessor.get()).equals(5);
  });

  it('propagates change in trivial block', function() {
    const result = [0];
    const accessor = host(() => scalar(0), (change) => change({set(value) {result[0] = value;}}));
    accessor.setter()(2);
    expect(result[0]).equals(2);
  });

  it('evaluates object', function() {
    const accessor = host(() => object({x: scalar(3)}));
    expect(accessor.get("x").get()).equals(3);
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
});
