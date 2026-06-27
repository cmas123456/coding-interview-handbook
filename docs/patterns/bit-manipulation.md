# Bit Manipulation

> Treat integers as 32-bit vectors and use bitwise operators to test, flip, combine, and enumerate state in constant time.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** XOR, single number, count set bits, power of two, subset masks, or "without using + / -."
    - **Do:** use `&` to test bits, `^` to cancel pairs, `n & (n - 1)` to clear the lowest set bit, and masks to enumerate subsets.
    - **Cost:** usually O(1) over fixed 32-bit integers, or O(n) when scanning an array / O(2^n·n) for subsets.
    - **Watch out:** JavaScript bitwise ops coerce to signed 32-bit; use `>>>` / `>>> 0` when you need unsigned behavior.

---

## Recognition

### Use bit manipulation when you see…

- The prompt explicitly says **XOR**, **bit**, **binary representation**, or "without using `+` / `-`."
- You need the unique value where every other value appears twice or cancels out.
- You need to count set bits, reverse bits, test power of two/four, or find a missing number with constant extra space.
- The input size is small enough for subset enumeration and you want to represent each subset as a mask from `0` to `2^n - 1`.

### Common phrases in the prompt

- "single number"
- "count set bits" / "Hamming weight"
- "power of two" / "power of four"
- "missing number using O(1) extra space"
- "without using arithmetic operators"
- "enumerate all subsets"
- "XOR all numbers"

### Don't use bit manipulation when…

- Values may exceed the safe 32-bit range for JavaScript bitwise operators and the problem does not define 32-bit behavior.
- A hash map gives clearer code and the problem does not require O(1) extra space.
- You need arbitrary-precision integer bits → use `BigInt` deliberately, not normal JS bitwise operators.

---

## Core Intuition

> Bit operations manipulate every bit position in parallel, so algebraic identities like `a ^ a = 0` and tricks like `n & (n - 1)` collapse many counting/search problems into tiny loops.

Important JavaScript warning: bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`) first coerce numbers to **32-bit signed integers**. That means:

- `>>` is arithmetic shift and sign-extends the leftmost bit.
- `>>>` is logical shift and fills with zeros.
- Values above `2^31 - 1` can appear negative after bitwise operations.
- `>>> 0` converts the final 32-bit result to an unsigned view.

For interviews, most bit problems are designed around 32-bit integers, so this is fine — just be explicit when counting or shifting unsigned values.

---

## Generic Algorithm

1. Identify the bit identity: XOR cancellation, lowest set bit, mask enumeration, or shift-and-test.
2. Normalize JavaScript signedness if needed. Use `n >>> 0` before unsigned counting or display.
3. Maintain the smallest bit state:
     - XOR accumulator for unique/missing values.
     - Count loop that clears one bit at a time.
     - Mask from `0` to `(1 << n) - 1` for subsets.
4. Parenthesize bit expressions before comparisons.
5. Return the numeric result, converting with `>>> 0` if unsigned output is required.

---

## Implementation

### JavaScript — Single Number (XOR cancellation)

XOR is associative and commutative; pairs cancel because `a ^ a = 0`, and `0 ^ x = x`.

```js
function singleNumber(nums) {
  let result = 0;

  for (const n of nums) {
    result ^= n;
  }
  return result;
}
```

### JavaScript — Hamming Weight (clear the lowest set bit)

`n & (n - 1)` removes the lowest `1` bit, so the loop runs once per set bit.

```js
function hammingWeight(n) {
  n = n >>> 0;
  let count = 0;

  while (n !== 0) {
    n = (n & (n - 1)) >>> 0;
    count++;
  }
  return count;
}
```

### JavaScript — Power of Two

A positive power of two has exactly one set bit.

```js
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
```

### JavaScript — Subset Enumeration with a Mask

Bit `i` tells you whether `nums[i]` is included in the current subset.

```js
function subsets(nums) {
  const result = [];
  const total = 1 << nums.length;

  for (let mask = 0; mask < total; mask++) {
    const subset = [];
    for (let i = 0; i < nums.length; i++) {
      if ((mask & (1 << i)) !== 0) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }
  return result;
}
```

### JavaScript — Missing Number (XOR indices and values)

XOR every index and every value. Pairs cancel, leaving the missing number.

```js
function missingNumber(nums) {
  let result = nums.length;

  for (let i = 0; i < nums.length; i++) {
    result ^= i;
    result ^= nums[i];
  }
  return result;
}
```

---

## Complexity

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| XOR scan (Single/Missing Number) | O(n) | O(1) | One accumulator; no hash set needed. |
| Hamming Weight | O(k) | O(1) | k = number of set bits; max 32 iterations for JS bitwise ints. |
| Power of Two | O(1) | O(1) | One bit trick plus positive check. |
| Subset enumeration | O(2^n · n) | O(2^n · n) | Output itself has all subsets. |
| Shift-and-test loop | O(32) | O(1) | Fixed width under JS bitwise coercion. |

---

## Common Mistakes

1. **Forgetting JavaScript's 32-bit signed coercion.** `2147483648 | 0` becomes `-2147483648`. If the problem expects unsigned 32-bit behavior, use `>>> 0` to view the result as unsigned.
2. **Using `>>` when you mean `>>>`.** `>>` keeps the sign bit, so loops on negative values may never behave like unsigned bit scans. Use `>>>` for zero-fill shifts.
3. **Missing parentheses around bit checks.** `n & n - 1 === 0` does not mean what you think. Write `(n & (n - 1)) === 0`.
4. **Forgetting the positive check for power of two.** `0 & -1` is `0`, so `(n & (n - 1)) === 0` is true for `0`. Require `n > 0`.
5. **Using bitmask subsets when `n >= 31` in JavaScript.** `1 << 31` is negative because shifts are signed 32-bit. For large `n`, use backtracking or `BigInt` masks.
6. **Not knowing the XOR identities.** You need all four: XOR is associative, XOR is commutative, `a ^ a = 0`, and `a ^ 0 = a`. Together they explain most unique-number solutions.

---

## Related Problems

- 🟢 **Easy** — [Single Number](https://leetcode.com/problems/single-number/) — the canonical XOR cancellation problem.
- 🟢 **Easy** — [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) — use `n & (n - 1)` to clear bits.
- 🟢 **Easy** — [Counting Bits](https://leetcode.com/problems/counting-bits/) — DP relation over bits: `bits[i] = bits[i >> 1] + (i & 1)`.
- 🟢 **Easy** — [Missing Number](https://leetcode.com/problems/missing-number/) — XOR indices and values for O(1) space.
- 🟢 **Easy** — [Reverse Bits](https://leetcode.com/problems/reverse-bits/) — shift bits out of one integer and into another.
- 🟡 **Medium** — [Single Number II](https://leetcode.com/problems/single-number-ii/) — count each bit modulo 3 or use bit-state masks.
- 🟡 **Medium** — [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) — addition via XOR for sum and AND/shift for carry.
- 🟡 **Medium** — [Subsets](https://leetcode.com/problems/subsets/) — every subset corresponds to one bitmask.

---

## Related Patterns

- **[Arrays & Hashing](./arrays-hashing.md)** — XOR is the O(1)-space alternative to a set/map when duplicates cancel perfectly.
- **[Backtracking](./backtracking.md)** — subset generation can be written as backtracking; bitmasks are the iterative representation of the same choice tree.
- **[Dynamic Programming (1D)](./dp-1d.md)** — Counting Bits uses a 1D DP recurrence derived from shifts and low bits.
- **[Trie](./trie.md)** — binary tries solve advanced max-XOR problems by branching on bits.
