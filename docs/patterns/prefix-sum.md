# Prefix Sum

> Precompute cumulative totals so range-sum queries become **O(1)**, and combine those totals with a hash map to count subarrays with a target sum.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** range sum queries, subarray sum equals K, repeated matrix sum queries, or cumulative balance/count questions.
    - **Do:** build `prefix[i + 1] = prefix[i] + nums[i]`; range sum is `prefix[r + 1] - prefix[l]`.
    - **Cost:** O(n) preprocess, O(1) per range query; O(n) space unless you only keep a running sum.
    - **Watch out:** seed prefix-sum hash maps with `0 -> 1`, or you'll miss subarrays that start at index 0.

---

## Recognition

### Use prefix sum when you see…

- Repeated **sum of subarray / range / rectangle** queries.
- A contiguous subarray whose sum must equal `k`, be divisible by `k`, or have equal counts after mapping values to +1/-1.
- Negative numbers are allowed, which breaks normal sliding-window sum logic.
- You can answer a later question if you know two cumulative totals: `sum(l..r) = prefix[r + 1] - prefix[l]`.
- Constraints where O(n²) enumeration of all ranges is too slow.

### Common phrases in the prompt

- "sum range"
- "range sum query"
- "subarray sum equals k"
- "continuous subarray sum"
- "number of subarrays with sum …"
- "divisible by k"
- "2D matrix sum"

### Don't use prefix sum when…

- The array has **positive numbers only** and asks for shortest/longest sum at least `k` → [sliding window](./sliding-window.md) is often simpler and O(1) space.
- You need arbitrary updates between queries → use a Fenwick tree / segment tree, not a static prefix array.
- The operation is not invertible. Prefix sums work because you can subtract totals; min/max need a different structure.
- The subset is not contiguous → use DP, backtracking, or [arrays & hashing](./arrays-hashing.md), depending on the prompt.

---

## Core Intuition

> Any subarray sum is the difference between two cumulative sums, so you can trade repeated range work for one running total and constant-time subtraction.

Brute force recomputes `nums[l] + ... + nums[r]` for many different `(l, r)` pairs. Prefix sum stores the total before each index, so the middle cancels out: `prefix[r + 1] - prefix[l]`. For "subarray sum equals K," you don't need to store every range — at each index, if `currentSum - previousSum = k`, then `previousSum = currentSum - k`, so a hash map of previous prefix sums tells you how many valid subarrays end here.

---

## Generic Algorithm

### Static 1D range sum

```text
1. Build prefix array of length n + 1.
2. prefix[0] = 0.
3. For i = 0 .. n - 1:
     prefix[i + 1] = prefix[i] + nums[i].
4. To query sum from left to right inclusive:
     return prefix[right + 1] - prefix[left].
```

### Subarray sum equals K (prefix sum + hash map)

```text
1. counts[0] = 1 because a prefix sum itself can form a valid subarray from index 0.
2. current = 0; answer = 0.
3. For each number:
     a. current += number.
     b. answer += counts[current - k].
     c. counts[current] += 1.
4. Return answer.
```

### Subarray sum divisible by K (modulo trick)

```text
1. counts[0] = 1.
2. current = 0; answer = 0.
3. For each number:
     a. current = normalized modulo of (current + number) by k.
     b. answer += counts[current].
     c. counts[current] += 1.
4. Return answer.
```

### Static 2D range sum

```text
1. Build prefix with one extra row and one extra column.
2. prefix[r + 1][c + 1] = matrix[r][c]
                         + prefix[r][c + 1]
                         + prefix[r + 1][c]
                         - prefix[r][c]
3. Rectangle sum is bottomRight - above - left + overlap.
```

---

## Implementation

### JavaScript — basic 1D prefix sum for range queries

Use an `n + 1` prefix array so `sumRange(0, r)` doesn't need a special case.

```js
function buildRangeSum(nums) {
  const prefix = new Array(nums.length + 1).fill(0);

  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  return function sumRange(left, right) {
    return prefix[right + 1] - prefix[left];
  };
}
```

### JavaScript — subarray sum equals K (prefix sum + hash map)

Counts how many previous prefix sums would make the current subarray sum exactly `k`.

```js
function subarraySum(nums, k) {
  const counts = new Map([[0, 1]]);
  let current = 0;
  let answer = 0;

  for (const num of nums) {
    current += num;
    answer += counts.get(current - k) || 0;
    counts.set(current, (counts.get(current) || 0) + 1);
  }

  return answer;
}
```

### JavaScript — subarray sum divisible by K (normalized modulo)

Two prefix sums with the same remainder have a difference divisible by `k`.

```js
function subarraysDivByK(nums, k) {
  const counts = new Map([[0, 1]]);
  let remainder = 0;
  let answer = 0;

  for (const num of nums) {
    remainder = ((remainder + num) % k + k) % k;
    answer += counts.get(remainder) || 0;
    counts.set(remainder, (counts.get(remainder) || 0) + 1);
  }

  return answer;
}
```

### JavaScript — 2D prefix sum for matrix range queries

The extra row and column keep the rectangle formula branch-free.

```js
function buildMatrixSum(matrix) {
  const rows = matrix.length;
  const cols = rows === 0 ? 0 : matrix[0].length;
  const prefix = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      prefix[r + 1][c + 1] = matrix[r][c]
        + prefix[r][c + 1]
        + prefix[r + 1][c]
        - prefix[r][c];
    }
  }

  return function sumRegion(row1, col1, row2, col2) {
    return prefix[row2 + 1][col2 + 1]
      - prefix[row1][col2 + 1]
      - prefix[row2 + 1][col1]
      + prefix[row1][col1];
  };
}
```

---

## Complexity

| Variant                       | Time              | Space     | Notes |
|-------------------------------|-------------------|-----------|-------|
| 1D static range sum           | O(n + q)          | O(n)      | Build once, answer q queries in O(1) each. |
| Subarray sum equals K         | O(n)              | O(n)      | Stores counts of previous prefix sums. |
| Subarray sum divisible by K   | O(n)              | O(min(n, k)) | Stores counts by remainder. |
| 2D static range sum           | O(rows · cols + q) | O(rows · cols) | Each rectangle query is O(1). |

If you only need one pass and no later range queries, you can keep a running prefix sum instead of storing the whole prefix array.

---

## Common Mistakes

1. **Building `prefix` with length `n` and then special-casing index 0 everywhere.** Use length `n + 1`; `prefix[0] = 0` makes `sumRange(0, r)` just `prefix[r + 1] - prefix[0]`.
2. **Forgetting to seed `counts` with `{0: 1}`.** Without it, `nums = [3]`, `k = 3` returns 0 even though the subarray starting at index 0 is valid.
3. **Updating the map before counting.** For `subarraySum`, count `current - k` first, then insert `current`; otherwise `k = 0` can count an empty subarray ending at the current index.
4. **Using sliding window for `sum equals k` with negative numbers.** Negative values break the "expand increases, shrink decreases" invariant. Use prefix sum + hash map instead.
5. **Leaving negative remainders unnormalized in JavaScript.** `-1 % 5` is `-1`, not `4`. Normalize with `((x % k) + k) % k` before using it as a key.
6. **Getting the 2D overlap sign wrong.** In `sumRegion`, subtract the area above and left, then add the top-left overlap back once.

---

## Related Problems

- 🟢 **Easy** — [Range Sum Query — Immutable](https://leetcode.com/problems/range-sum-query-immutable/) — pure 1D prefix sum with O(1) queries.
- 🟢 **Easy** — [Find Pivot Index](https://leetcode.com/problems/find-pivot-index/) — compare left sum and right sum using a running prefix.
- 🟡 **Medium** — [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) — canonical prefix sum + hash map count.
- 🟡 **Medium** — [Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum/) — modulo trick with earliest index and length at least 2.
- 🟡 **Medium** — [Contiguous Array](https://leetcode.com/problems/contiguous-array/) — map `0` to `-1`, then find longest subarray with equal 0s and 1s via prefix balance.
- 🟡 **Medium** — [Range Sum Query 2D — Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/) — 2D inclusion/exclusion with an extra row and column.
- 🟡 **Medium** — [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) — prefix/suffix accumulation idea, but multiplication instead of sum.

---

## Related Patterns

- **[Arrays & Hashing](./arrays-hashing.md)** — prefix-sum counting becomes powerful when you store previous sums or remainders in a hash map.
- **[Sliding Window](./sliding-window.md)** — use instead for positive-number contiguous sums where the window can grow/shrink monotonically.
- **[Binary Search](./binary-search.md)** — often wraps a prefix-sum feasibility check when searching for the smallest length/value that works.
- **[Two Pointers](./two-pointers.md)** — use when sorted order lets you eliminate candidates without storing cumulative totals.