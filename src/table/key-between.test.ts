import { expect } from "chai";
import { keyBetween } from "./key-between.js";
import { asTableKey } from "./table-key.js";

describe('tables/key-between', function() {
  it('finds key between short keys', function() {
    expect(keyBetween(asTableKey('0'), asTableKey('1'))).equals('01');
  });

  it('finds key before key', function() {
    expect(keyBetween(null, asTableKey('1'))).equals('01');
  });

  it('finds key before low key', function() {
    expect(keyBetween(null, asTableKey('001'))).equals('0001');
  });

  it('throws for key before too low a key', function() {
    expect(() => keyBetween(null, asTableKey('000'))).throws();
  });

  it('finds key after key', function() {
    expect(keyBetween(asTableKey('0'), null)).equals('01');
  });

  it('finds key after high key', function() {
    expect(keyBetween(asTableKey('011'), null)).equals('0111');
  });

  it('throws for key after too high a key', function() {
    expect(() => keyBetween(asTableKey('1'), null)).throws();
  });

  it('finds low key between two keys', function() {
    expect(keyBetween(asTableKey('010'), asTableKey('011'))).equals('0101');
  });

  it('finds high key between two keys', function() {
    expect(keyBetween(asTableKey('0100'), asTableKey('0111'))).equals('011');
  });

  it('finds key when very close to wrapping', function() {
    expect(keyBetween(asTableKey('00111'), asTableKey('01'))).equals('001111');
  });

  it('finds gap in suffix', function() {
    expect(keyBetween(asTableKey('001101'), asTableKey('01'))).equals('00111');
  });
});
