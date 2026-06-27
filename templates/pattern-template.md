# Pattern Name

> One-sentence elevator pitch: what kind of problem this pattern solves and why it's faster than the obvious approach.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** the 2–3 strongest recognition clues, comma-separated.
    - **Do:** the one-line algorithm ("expand right, shrink left while invalid, track best").
    - **Cost:** O(?) time, O(?) space.
    - **Watch out:** the single most common mistake under pressure.

---

## Recognition

How do you spot this pattern in a problem you've never seen before?

### Use this pattern when you see…

- Structural clue (shape of the input — e.g. "contiguous subarray", "sorted array")
- Question clue (what's being asked — e.g. "longest / shortest", "max / min", "count of")
- Constraint clue (input size, time budget — e.g. `n <= 10^5` rules out O(n²))

### Common phrases in the prompt

- "…"
- "…"
- "…"

### Don't use this pattern when…

- Counter-clue (looks similar but actually needs a different pattern, and why)
- Counter-clue

---

## Core Intuition

Why does this pattern work? What's the key insight that turns the brute force into the optimal solution?

State the insight in **one sentence** first, then explain. The goal is that you can re-derive the algorithm from this insight alone if you forget the code.

> Example: "Instead of recomputing the answer for every subarray, we update the answer incrementally as the window moves."

---

## Generic Algorithm

The language-agnostic recipe. Should read like a cooking recipe — no syntax, just steps.

```text
1. Initialize state
2. For each element:
     a. Update state
     b. While invariant broken:
          shrink / adjust
     c. Record answer
3. Return answer
```

---

## Implementation

### JavaScript — minimal template

```js
function patternName(input) {
  // 1. Initialize state
  let answer = 0;

  // 2. Main loop
  for (let i = 0; i < input.length; i++) {
    // update state
    // maintain invariant
    // record answer
  }

  return answer;
}
```

### Variants

If the pattern has 2–3 common shapes (e.g. fixed-size vs variable-size window), show each as a separate code block with a one-line description above it.

---

## Complexity

| Variant   | Time | Space | Notes |
|-----------|------|-------|-------|
| Standard  | O(n) | O(1)  | Each element visited at most twice |
| Variant 2 | O(n) | O(k)  | k = window size / alphabet / etc. |

---

## Common Mistakes

1. **Mistake** — what people typically do wrong, why it breaks, and what to do instead.
2. **Off-by-one** — concrete example.
3. **Wrong invariant** — e.g. "checking the condition before updating state."
4. **Edge case** — empty input, single element, all-equal elements, etc.

---

## Related Problems

Curated, ordered easy → hard. Each line: difficulty, name, one-sentence "why it fits this pattern."

- 🟢 **Easy** — [Problem Name](https://leetcode.com/problems/slug/) — why this is a clean intro to the pattern.
- 🟡 **Medium** — [Problem Name](https://leetcode.com/problems/slug/) — what twist it adds.
- 🔴 **Hard** — [Problem Name](https://leetcode.com/problems/slug/) — what makes it hard.

---

## Related Patterns

How this pattern connects to others. Helps build the mental graph.

- **[Pattern A](./pattern-a.md)** — when to reach for A instead of this one.
- **[Pattern B](./pattern-b.md)** — often combined with this pattern (e.g. "sliding window + hash map").
- **[Pattern C](./pattern-c.md)** — a generalization or specialization.
