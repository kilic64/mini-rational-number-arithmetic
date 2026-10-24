/**
 * Core rational number arithmetic.
 *
 * A rational number is represented as { num, den } where both fields are
 * integers and den is strictly positive. The canonical form always has a
 * positive denominator; the sign lives entirely on the numerator. This
 * removes ambiguity (2/-4 and -1/2 are the same number) and makes equality
 * trivially reducible to field-wise comparison after normalisation.
 */

/**
 * Greatest common divisor via the iterative Euclidean algorithm.
 *
 * Works on absolute values so the result is always non-negative, which in
 * turn guarantees the normalised denominator is positive without a separate
 * sign fix-up.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Create a rational in canonical form.
 *
 * The denominator is forced positive: if the caller passes a negative
 * denominator the sign moves to the numerator. A zero denominator is a
 * hard error — there is no sensible "infinity" sentinel and silently
 * returning NaN would just push the failure downstream.
 *
 * @param {number} num
 * @param {number} den
 * @returns {{ num: number, den: number }}
 */
export function makeRational(num, den) {
  if (!Number.isInteger(num) || !Number.isInteger(den)) {
    throw new TypeError("numerator and denominator must be integers");
  }
  if (den === 0) {
    throw new RangeError("denominator cannot be zero");
  }
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den) || 1;
  return { num: num / g, den: den / g };
}

/**
 * Addition. Cross-multiplied then reduced.
 *
 * @param {{ num: number, den: number }} a
 * @param {{ num: number, den: number }} b
 * @returns {{ num: number, den: number }}
 */
export function add(a, b) {
  return makeRational(a.num * b.den + b.num * a.den, a.den * b.den);
}

/**
 * Subtraction.
 *
 * @param {{ num: number, den: number }} a
 * @param {{ num: number, den: number }} b
 * @returns {{ num: number, den: number }}
 */
export function subtract(a, b) {
  return makeRational(a.num * b.den - b.num * a.den, a.den * b.den);
}

/**
 * Multiplication.
 *
 * @param {{ num: number, den: number }} a
 * @param {{ num: number, den: number }} b
 * @returns {{ num: number, den: number }}
 */
export function multiply(a, b) {
  return makeRational(a.num * b.num, a.den * b.den);
}

/**
 * Division. Division by zero is rejected by makeRational via the zero-check
 * on the new denominator.
 *
 * @param {{ num: number, den: number }} a
 * @param {{ num: number, den: number }} b
 * @returns {{ num: number, den: number }}
 */
export function divide(a, b) {
  return makeRational(a.num * b.den, a.den * b.num);
}

/**
 * Strict equality. Canonical form makes this a plain field-wise compare.
 *
 * @param {{ num: number, den: number }} a
 * @param {{ num: number, den: number }} b
 * @returns {boolean}
 */
export function equals(a, b) {
  return a.num === b.num && a.den === b.den;
}

/**
 * Ordering. Returns negative, zero, or positive — matching the convention
 * of Array.prototype.sort and the built-in comparison operators.
 *
 * Cross-multiplied with the now-guaranteed positive denominators, so the
 * sign of the difference of products is the sign of the relation.
 *
 * @param {{ num: number, den: number }} a
 * @param {{ num: number, den: number }} b
 * @returns {number}
 */
export function compare(a, b) {
  const left = a.num * b.den;
  const right = b.num * a.den;
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/**
 * Decimal approximation. Use Math.round to avoid the classic 0.1+0.2 drift.
 *
 * @param {{ num: number, den: number }} r
 * @param {number} [places]
 * @returns {number}
 */
export function toDecimal(r, places = 0) {
  if (!Number.isInteger(places) || places < 0) {
    throw new RangeError("places must be a non-negative integer");
  }
  const scale = Math.pow(10, places);
  return Math.round((r.num / r.den) * scale) / scale;
}
