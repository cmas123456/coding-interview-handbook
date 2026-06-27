# Sliding Window

> Process every contiguous subarray or substring of an array/string in **O(n)** total by maintaining a moving window instead of recomputing from scratch.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** contiguous subarray/substring + asking for max/min/longest/shortest/count.
    - **Do:** expand `right`, update state, `while invariant broken: shrink left`, record answer.
    - **Cost:** O(n) time, O(1) or O(k) space (k = distinct elements when using a map).
    - **Watch out:** use `while` not `if` to shrink; length is `right - left + 1`.

---

## Recognition

### Use sliding window when you see…

- Input is an **array or string**.
- The answer depends on a **contiguous** range (subarray, substring, sub-segment).
- You're asked for a **max / min / longest / shortest / count** over those ranges, or whether a range **satisfies a condition** (sum, distinct chars, etc.).
- Constraints big enough that the obvious O(n²) "try every subarray" approach won't fit (typically `n >= 10^4`).

### Common phrases in the prompt

- "longest substring …"
- "shortest subarray with sum at least …"
- "maximum sum of any k consecutive elements"
- "smallest window containing …"
- "number of subarrays where …"

### Don't use sliding window when…

- The subset doesn't have to be contiguous → that's a **subset / DP / hash map** problem, not a window.
- The array isn't ordered in a meaningful way and you can sort first → often **two pointers on a sorted array** is simpler.
- You need to query arbitrary ranges later → use **prefix sums** instead.

---

## Core Intuition

> When the window moves one step to the right, the new state is almost the same as the old state — we only add one element and (sometimes) remove one. So each update is O(1), not O(window size).

Brute force tries every `(left, right)` pair: O(n²) windows, O(n) work per window = O(n³). Sliding window collapses this to O(n) by noticing that `left` only ever moves forward, so the **total** work across all iterations is bounded by `2n`.

---

## Generic Algorithm

There are two shapes. Pick by asking: **"Is the window size fixed by the problem, or determined by a condition?"**

### Fixed-size window (size `k` given)

```text
1. Build initial window covering indices [0, k-1].
2. For right = k .. n-1:
     a. Add arr[right] to window state.
     b. Remove arr[right - k] from window state.
     c. Update answer.
3. Return answer.
```

### Variable-size window (grow until invalid, then shrink)

```text
1. left = 0; initialize state; answer = identity.
2. For right = 0 .. n-1:
     a. Add arr[right] to state.
     b. While state violates the invariant:
          remove arr[left] from state
          left += 1
     c. Update answer with current window [left, right].
3. Return answer.
```

The hard part is almost always **defining the invariant** clearly. Once that's nailed down, the code writes itself.

---

## Implementation

### JavaScript — fixed-size window

Max sum of any `k` consecutive elements:

```js
function maxSumFixed(nums, k) {
  if (nums.length < k) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];

  let best = windowSum;
  for (let right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k];
    best = Math.max(best, windowSum);
  }
  return best;
}
```

### JavaScript — variable-size window with a hash map

Longest substring without repeating characters:

```js
function longestUniqueSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

### JavaScript — variable-size window with counts (minimum window)

Shortest subarray whose sum is at least `target` (positive numbers):

```js
function minSubarrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }
  return best === Infinity ? 0 : best;
}
```

---

## Complexity

| Variant                   | Time | Space   | Notes |
|---------------------------|------|---------|-------|
| Fixed-size window         | O(n) | O(1)    | Constant work per step. |
| Variable-size, primitive  | O(n) | O(1)    | `left` advances at most n times across the whole run. |
| Variable-size + hash map  | O(n) | O(k)    | k = number of distinct elements / alphabet size. |

The key insight: even though there's a nested `while` loop in the variable-size template, **`left` is monotonically increasing**, so the inner loop's total work across the whole outer loop is ≤ n. Amortized O(n), not O(n²).

---

## Common Mistakes

1. **Recomputing the window sum from scratch each step.** Defeats the whole point — you're back to O(n·k). Always update incrementally: `sum += new; sum -= old`.
2. **Using `if` instead of `while` to shrink.** A single bad element can invalidate the window by more than one position. You must keep shrinking until the invariant holds again.
3. **Updating the answer in the wrong place.** For "longest valid window" problems, update **after** shrinking (the window is now guaranteed valid). For "shortest window covering X" problems, update **inside** the shrink loop (every shrunk version is still valid and might be smaller).
4. **Off-by-one on window length.** Length is `right - left + 1`, not `right - left`. Burn this in.
5. **Forgetting that `left` can pass `right`** when an invalid single element is added. Usually fine — the next iteration will re-extend — but make sure your state-removal logic handles an empty window.
6. **Confusing "contiguous" with "subset."** If the problem allows skipping elements, sliding window doesn't apply. Re-read the prompt.

---

## Related Problems

Easy → hard, with the twist each one adds.

- 🟢 **Easy** — [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) — pure fixed-size window, no tricks.
- 🟢 **Easy** — [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/) — fixed window + hash set membership.
- 🟡 **Medium** — [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) — canonical variable-size window with a map.
- 🟡 **Medium** — [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) — shortest-window variant (update inside shrink loop).
- 🟡 **Medium** — [Permutation in String](https://leetcode.com/problems/permutation-in-string/) — fixed window + character-count comparison.
- 🟡 **Medium** — [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) — invariant involves `windowLen - mostFrequentCount <= k`.
- 🔴 **Hard** — [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) — variable window + "have / need" counter tracking.
- 🔴 **Hard** — [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) — fixed window where the answer needs a **monotonic deque**, not just a sum.

---

## Related Patterns

- **[Two Pointers](./two-pointers.md)** — sliding window is a specialization where both pointers move forward. Reach for two pointers when the array is sorted and you're searching for a pair / triplet rather than a contiguous range.
- **[Prefix Sum](./prefix-sum.md)** — alternative for *sum-based* range queries when the window isn't naturally contiguous in time (e.g. "subarrays with sum exactly k" — use prefix sum + hash map, not a window).
- **[Monotonic Stack / Deque](./monotonic-stack.md)** — pair with sliding window when the per-window answer is a max/min (Sliding Window Maximum). The deque maintains the max in O(1) amortized as the window slides.
- **[Arrays & Hashing](./arrays-hashing.md)** — most variable-size windows carry a `Map` or counter as their state. Comfort with hash-map idioms is a prerequisite.
