# Next Greater / Smaller Element

> Use a monotonic stack of indices to answer "who is the next greater/smaller value?" in one pass instead of scanning rightward for every element.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** next greater/smaller, daily temperatures, stock span, histogram rectangles.
    - **Do:** keep indices in monotonic order; when the new value breaks the order, pop and resolve answers.
    - **Cost:** O(n) time, O(n) space.
    - **Watch out:** store indices, not values, so you can compute distances, widths, and write answers.

---

## Recognition

### Use monotonic stack when you see…

- You need the **next greater / next smaller** element to the left or right.
- A value waits until a future value proves something about it, like "warmer day" or "next larger price."
- You need nearest boundaries where values become smaller/larger, especially for **histograms**.
- Brute force scans from every index to the right and constraints make O(n²) too slow.

### Common phrases in the prompt

- "next greater element" / "next smaller element"
- "daily temperatures" / "days until warmer"
- "largest rectangle in histogram"
- "stock span"
- "trapping rain water" with a stack variant

### Don't use monotonic stack when…

- You only need a max/min over a fixed sliding window → use a **monotonic deque** with [queue](./queue.md).
- The array is sorted and you are searching for a pair → [two pointers](./two-pointers.md) is simpler.
- You need arbitrary range minimum/maximum queries many times → this is usually a segment tree/sparse table topic, not this handbook pattern.

---

## Core Intuition

> Keep unresolved indices on the stack; when the current value violates the stack's monotonic order, it is the first value that can resolve the popped index.

For Next Greater Element, the stack is decreasing by value. If `nums[i]` is bigger than the value at the top index, then `i` is exactly the next greater index for that popped element: anything between them was not bigger, or the element would have been popped earlier. Each index is pushed once and popped once, so the nested `while` is still O(n) total.

The direction of monotonicity depends on the question: next greater uses a decreasing stack; next smaller uses an increasing stack. Histogram problems flip the perspective: the current smaller bar resolves rectangles whose height was waiting for a right boundary.

---

## Generic Algorithm

### Next greater to the right

1. Create an answer array filled with the default value, usually `-1` or `0`.
2. Keep a stack of unresolved **indices** whose values are decreasing.
3. Scan left to right.
4. While the stack is non-empty and the current value is greater than the top index's value:
   1. Pop that index.
   2. Use the current index/value to fill its answer.
5. Push the current index.
6. Return the answer; anything still in the stack has no next greater value.

### Next smaller / histogram boundary

1. Keep a stack of indices whose values are increasing.
2. Append a sentinel smaller than every real value, or run one extra iteration with height `0`.
3. When the current height is smaller than the top height, pop bars and compute rectangles.
4. The new stack top is the left boundary; the current index is the right boundary.

---

## Implementation

### JavaScript — Next Greater Element

Classic decreasing stack of indices. The answer stores the next greater value, not the index:

```js
function nextGreater(nums) {
  const result = Array(nums.length).fill(-1);
  const stack = [];

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const j = stack.pop();
      result[j] = nums[i];
    }
    stack.push(i);
  }

  return result;
}
```

### JavaScript — Daily Temperatures

Same shape, but the answer is a distance: `i - j` days until warmer.

```js
function dailyTemperatures(temperatures) {
  const days = Array(temperatures.length).fill(0);
  const stack = [];

  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const j = stack.pop();
      days[j] = i - j;
    }
    stack.push(i);
  }

  return days;
}
```

### JavaScript — Largest Rectangle in Histogram

Use an increasing stack. A sentinel height `0` at the end forces all remaining bars to resolve.

```js
function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;

  for (let i = 0; i <= heights.length; i++) {
    const currentHeight = i === heights.length ? 0 : heights[i];

    while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()];
      const leftBoundary = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = i - leftBoundary - 1;
      best = Math.max(best, height * width);
    }

    stack.push(i);
  }

  return best;
}
```

---

## Complexity

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| Next Greater Element | O(n) | O(n) | Each index is pushed once and popped at most once. |
| Daily Temperatures | O(n) | O(n) | Same decreasing-stack invariant; answer stores distance. |
| Largest Rectangle in Histogram | O(n) | O(n) | Sentinel flushes the increasing stack at the end. |
| Circular next greater | O(n) | O(n) | Scan `2n` positions with `i % n`, but push each real index once. |

---

## Common Mistakes

1. **Storing values instead of indices.** Daily Temperatures needs `i - j`; histogram needs width from boundaries. Values alone are not enough.
2. **Using the wrong monotonic direction.** Next greater needs a decreasing stack; next smaller needs an increasing stack. Say the invariant out loud before coding.
3. **Forgetting unresolved defaults.** If no warmer day exists, the answer remains `0`; if no next greater exists, it usually remains `-1`.
4. **Missing the histogram sentinel.** Without the final `0`, increasing tails like `[2, 3, 4]` never get popped, so you miss the best rectangle.
5. **Off-by-one on histogram width.** After popping, width is `rightIndex - leftBoundary - 1`, not `rightIndex - leftBoundary`.
6. **Using `<=` when duplicates matter.** Decide whether equal values should pop. For "next greater," equal is not greater, so keep equal values unless the problem asks for greater-or-equal.

---

## Related Problems

- 🟢 **Easy** — [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) — clean intro to resolving smaller values when a greater value arrives.
- 🟡 **Medium** — [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) — same template, but the output is distance.
- 🟡 **Medium** — [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) — circular array adds a `2n` scan.
- 🟡 **Medium** — [Online Stock Span](https://leetcode.com/problems/online-stock-span/) — compresses previous smaller/equal prices into spans.
- 🔴 **Hard** — [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) — increasing stack finds nearest smaller boundaries.
- 🔴 **Hard** — [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) — turns each matrix row into a histogram.
- 🔴 **Hard** — [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) — counts how many subarrays choose each value as the minimum.
- 🔴 **Hard** — [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) — stack variant resolves basins when a right wall appears.

---

## Related Patterns

- **[Stack](./stack.md)** — monotonic stack is a constrained stack where order carries meaning; use plain stack for matching, undo, and parsing.
- **[Queue](./queue.md)** — the sliding-window maximum uses a monotonic deque, a close cousin that pops from both ends.
- **[Sliding Window](./sliding-window.md)** — combine with a deque when you need max/min for each moving window.
- **[Arrays & Hashing](./arrays-hashing.md)** — Next Greater Element I maps values to answers after the stack pass.
