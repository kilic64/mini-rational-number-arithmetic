import { test } from "node:test";
import assert from "node:assert/strict";

import {
  gcd,
  makeRational,
  add,
  subtract,
  multiply,
  divide,
  equals,
  compare,
  toDecimal,
} from "../src/core.js";

test("gcd handles positive, zero, and negative inputs", () => {
  assert.strictEqual(gcd(12, 8), 4);
  assert.strictEqual(gcd(0, 5), 5);
  assert.strictEqual(gcd(-12, 8), 4);
  assert.strictEqual(gcd(12, -8), 4);
  assert.strictEqual(gcd(0, 0), 0);
});

test("makeRational reduces to lowest terms", () => {
  const r = makeRational(6, 8);
  assert.deepStrictEqual(r, { num: 3, den: 4 });
});

test("makeRational normalises a negative denominator onto the numerator", () => {
  assert.deepStrictEqual(makeRational(1, -2), { num: -1, den: 2 });
  assert.deepStrictEqual(makeRational(-1, -2), { num: 1, den: 2 });
});

test("makeRational represents zero as 0/1", () => {
  assert.deepStrictEqual(makeRational(0, 5), { num: 0, den: 1 });
});

test("makeRational rejects a zero denominator", () => {
  assert.throws(() => makeRational(1, 0), RangeError);
});

test("makeRational rejects non-integer arguments", () => {
  assert.throws(() => makeRational(1.5, 2), TypeError);
  assert.throws(() => makeRational(1, 2.5), TypeError);
});

test("add produces exact results", () => {
  const half = makeRational(1, 2);
  const third = makeRational(1, 3);
  assert.deepStrictEqual(add(half, third), { num: 5, den: 6 });
});

test("subtract can cross zero", () => {
  const small = makeRational(1, 3);
  const big = makeRational(1, 2);
  assert.deepStrictEqual(subtract(small, big), { num: -1, den: 6 });
});

test("multiply and divide stay exact", () => {
  const a = makeRational(2, 3);
  const b = makeRational(3, 4);
  assert.deepStrictEqual(multiply(a, b), { num: 1, den: 2 });
  assert.deepStrictEqual(divide(a, b), { num: 8, den: 9 });
});

test("divide by a rational zero throws", () => {
  const a = makeRational(1, 2);
  const z = makeRational(0, 1);
  assert.throws(() => divide(a, z), RangeError);
});

test("equals relies on canonical form", () => {
  assert.strictEqual(
    equals(makeRational(1, 2), makeRational(2, 4)),
    true,
  );
  assert.strictEqual(
    equals(makeRational(1, 2), makeRational(-1, -2)),
    true,
  );
  assert.strictEqual(
    equals(makeRational(1, 2), makeRational(1, 3)),
    false,
  );
});

test("compare orders correctly across signs", () => {
  const half = makeRational(1, 2);
  const third = makeRational(1, 3);
  assert.strictEqual(compare(third, half), -1);
  assert.strictEqual(compare(half, third), 1);
  assert.strictEqual(compare(half, makeRational(2, 4)), 0);
  assert.strictEqual(compare(makeRational(-1, 2), makeRational(1, 2)), -1);
});

test("toDecimal rounds half away from zero via Math.round", () => {
  const r = makeRational(1, 3); // 0.3333...
  assert.strictEqual(toDecimal(r, 2), 0.33);
  assert.strictEqual(toDecimal(r, 4), 0.3333);
  assert.strictEqual(toDecimal(makeRational(2, 1), 0), 2);
  const neg = makeRational(-1, 3);
  assert.strictEqual(toDecimal(neg, 2), -0.33);
});
