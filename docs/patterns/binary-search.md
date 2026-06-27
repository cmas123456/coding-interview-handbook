# Binary Search

> Search a sorted array or monotonic answer space in **O(log n)** by repeatedly discarding the half that cannot contain the answer.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** sorted input, monotonic true/false condition, or "minimum/maximum value that works."
    - **Do:** maintain a search interval, test `mid`, throw away the impossible half, keep the invariant true.
    - **Cost:** O(log n) iterations, usually O(1) space; each iteration may run a feasibility check.
    - **Watch out:** don't mix `left < right` and `left <= right` update rules; `left = mid` can infinite-loop.

---

## Recognition

### Use binary search when you see…

- A **sorted** array and a target lookup, insertion point, first/last occurrence, or boundary.
- A function where answers are **monotonic**: false, false, false, true, true, true (or the reverse).
- Wording like **minimum speed**, **minimum capacity**, **smallest value that works**, or **maximum value possible**.
- Constraints that make linear scan too slow but the space can be halved each step.
- Rotated sorted arrays, where at least one half is still sorted on each iteration.

### Common phrases in the prompt

- "sorted array"
- "search insert position"
- "first bad version"
- "find the minimum in rotated sorted array"
- "minimum eating speed"
- "least capacity to ship within D days"
- "find the first / last occurrence"

### Don't use binary search when…

- The input is unsorted and no monotonic property exists → use [arrays & hashing](./arrays-hashing.md), sorting, or another pattern.
- The answer changes non-monotonically as you move through candidates. Binary search needs a clean "too low / too high" direction.
- You need every valid item, not just a boundary or one target. You may binary-search the boundary first, then scan/collect.
- The feasibility check is O(n²) and runs O(log n) times when a direct O(n) pattern exists.

---

## Core Intuition

> Binary search works because one comparison at `mid` proves an entire half of the remaining search space cannot contain the answer.

The trick is not the formula for `mid`; it's the **invariant**. In classic target search, the invariant is "if the target exists, it is inside `[left, right]`." In lower-bound search, the invariant is "the first valid answer is inside `[left, right)`." In answer-space search, the invariant is "values below the boundary fail and values at/above it pass." If you can state that invariant, the pointer updates become mechanical.

---

## Generic Algorithm

### Half-open lower bound (recommended for boundaries)

Use this for insertion point, first `true`, first value `>= target`, minimum feasible answer.

```text
1. left = lowest possible index/value.
2. right = one past the highest possible index/value.
3. While left < right:
     a. mid = floor((left + right) / 2).
     b. If mid is valid / high enough:
          right = mid       (mid might be the answer)
        Else:
          left = mid + 1    (mid is definitely too low)
4. Return left.
```

### Classic closed interval target search

Use this when you only need to know whether an exact target exists.

```text
1. left = 0; right = n - 1.
2. While left <= right:
     a. mid = floor((left + right) / 2).
     b. If nums[mid] == target, return mid.
     c. If nums[mid] < target, left = mid + 1.
     d. Else right = mid - 1.
3. Return -1.
```

Most people get the closed-interval version wrong by forgetting that `mid` has been ruled out after the comparison. If you set `right = mid` or `left = mid`, the interval may not shrink. Prefer the half-open template for boundary problems because `right = mid` is safe there: `mid` is still a candidate.

### Search on answer space

```text
1. Define can(candidate): returns true if candidate is enough / feasible.
2. Choose inclusive-low and exclusive-high bounds so the answer is in [left, right).
3. Binary search for the first candidate where can(candidate) is true.
4. Return left.
```

### Rotated sorted array

```text
1. left = 0; right = n - 1.
2. While left <= right:
     a. mid = floor((left + right) / 2).
     b. If nums[mid] is target, return mid.
     c. Determine which half is sorted.
     d. If target lies in the sorted half, keep that half.
     e. Otherwise discard that half.
3. Return -1.
```

---

## Implementation

### JavaScript — classic find target (`left <= right`)

Use the closed interval when you're searching for an exact value and can discard `mid` after each comparison.

```js
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
```

### JavaScript — lower bound / leftmost insertion point (`left < right`)

Returns the first index where `nums[index] >= target`, or `nums.length` if every value is smaller.

```js
function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] >= target) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}
```

### JavaScript — search on answer space (Koko Eating Bananas)

Binary-search the minimum speed where the feasibility check finishes within `h` hours.

```js
function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles) + 1;

  const canFinish = (speed) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / speed);
    }
    return hours <= h;
  };

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canFinish(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}
```

### JavaScript — rotated sorted array

One half is always sorted; use that half to decide which side can contain the target.

```js
function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}
```

---

## Complexity

| Variant                 | Time             | Space | Notes |
|-------------------------|------------------|-------|-------|
| Classic target search   | O(log n)         | O(1)  | Exact lookup in a sorted array. |
| Lower bound             | O(log n)         | O(1)  | Also gives insertion point and first occurrence. |
| Search on answer space  | O(n log R)       | O(1)  | R = answer range; feasibility check often scans n items. |
| Rotated sorted array    | O(log n)         | O(1)  | Assumes no duplicates; duplicates can degrade the logic. |

In JavaScript, numeric overflow is rarely the practical issue because numbers are floating-point doubles, but `Math.floor((left + right) / 2)` is still the standard interview-safe expression. In languages with fixed-width integers, use `left + Math.floor((right - left) / 2)`.

---

## Common Mistakes

1. **Using `left = mid` in a `while (left < right)` loop.** When `left + 1 === right`, `mid === left`, so the interval never shrinks. If `mid` is too low, use `left = mid + 1`.
2. **Mixing half-open and closed intervals.** `right = nums.length` pairs with `while (left < right)`; `right = nums.length - 1` pairs with `while (left <= right)`. Don't swap one piece without changing the updates.
3. **Returning immediately in a boundary problem.** For "first occurrence" or "first bad version," finding a valid `mid` is not enough — move `right = mid` and keep searching left.
4. **Wrong feasibility direction.** In Koko, a higher speed makes finishing easier, so `canFinish(mid) === true` means search left for a smaller speed. State the monotonic direction before coding.
5. **Off-by-one answer-space bounds.** If `right` is exclusive, set it to `max + 1`, not `max`, or the true maximum answer may be skipped.
6. **Forgetting rotated-array halves are value ranges.** If the left half is sorted, check `nums[left] <= target && target < nums[mid]`, not just `target < nums[mid]`.

---

## Related Problems

- 🟢 **Easy** — [Binary Search](https://leetcode.com/problems/binary-search/) — the classic closed-interval target lookup.
- 🟢 **Easy** — [Search Insert Position](https://leetcode.com/problems/search-insert-position/) — clean lower-bound / insertion-point practice.
- 🟢 **Easy** — [First Bad Version](https://leetcode.com/problems/first-bad-version/) — first true in a monotonic boolean array.
- 🟡 **Medium** — [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) — boundary search where the sorted order wraps around.
- 🟡 **Medium** — [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) — target search while identifying the sorted half each step.
- 🟡 **Medium** — [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) — binary search the minimum feasible speed.
- 🔴 **Hard** — [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) — binary search a partition instead of a value.

---

## Related Patterns

- **[Two Pointers](./two-pointers.md)** — also uses sorted order, but moves linearly from edges when pair/triplet relationships matter.
- **[Arrays & Hashing](./arrays-hashing.md)** — use when the input is unsorted and you need O(1) average lookup instead of O(log n) ordered search.
- **[Prefix Sum](./prefix-sum.md)** — often combined with answer-space search when `can(candidate)` needs fast range sums.
- **[Sliding Window](./sliding-window.md)** — use for contiguous ranges with a moving invariant; binary search may wrap around it for "minimum length/value that works" variants.