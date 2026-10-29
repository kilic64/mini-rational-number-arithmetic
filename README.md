# mini-rational-number-arithmetic

Performs exact arithmetic on fractions represented as numerator-denominator pairs with automatic reduction.

```js
import { makeRational, add, multiply, toDecimal, divide } from "mini-rational-number-arithmetic";

const half = makeRational(1, 2);
const third = makeRational(1, 3);

const sum = add(half, third);      // { num: 5, den: 6 }
const product = multiply(half, third); // { num: 1, den: 3 }
const quotient = divide(half, third);  // { num: 3, den: 2 }
const approx = toDecimal(sum, 4); // 0.8333
```

## Why

Floating-point arithmetic drifts: `0.1 + 0.2` is `0.30000000000000004`. For calculations that must stay exact — proportions, ratios, repeated monetary subdivision — a numerator/denominator pair with reduction after every operation eliminates that drift entirely, at the cost of doing integer math instead of hardware floats.

## Exports

- `gcd(a, b)` — greatest common divisor of two integers, always non-negative.
- `makeRational(num, den)` — build a reduced, canonical rational. Denominator is forced positive; zero denominator throws `RangeError`; non-integer inputs throw `TypeError`. Zero is stored as `{ num: 0, den: 1 }`.
- `add(a, b)`, `subtract(a, b)`, `multiply(a, b)`, `divide(a, b)` — exact binary operations; each returns a fresh canonical rational. Division by zero throws.
- `equals(a, b)` — strict equality via field-wise comparison (safe because both operands are canonical).
- `compare(a, b)` — returns `-1`, `0`, or `1`.
- `toDecimal(r, places)` — rounds to `places` decimal places using `Math.round`; `places` defaults to `0`.

## Edge to be aware of

The library uses JavaScript `number` (IEEE 754 double) internally. Arithmetic stays exact only while the intermediate cross-products fit in the safe integer range (\|n\| < 2^53). Extremely deep fraction chains can overflow that range silently. `Number.isInteger` guards the constructor inputs but cannot guard the products computed inside `add`, `multiply`, etc. For most practical ratios this never bites; for unbounded-precision work you need a BigInt-based library.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

