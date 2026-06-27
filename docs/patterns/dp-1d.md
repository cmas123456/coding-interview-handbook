# Dynamic Programming (1D)

> When a problem has **overlapping subproblems** and an **optimal substructure**, cache the answer to each subproblem and build up — turning exponential recursion into a linear table walk.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** "max / min / count / can-you of …" + the answer at step `i` depends only on a few earlier steps (`i-1`, `i-2`, or similar).
    - **Do:** define `dp[i]` in plain English, write the recurrence (`dp[i] = f(dp[i-1], dp[i-2], …)`), pick base cases, fill the array left-to-right.
    - **Cost:** usually O(n) time, O(n) space — often reducible to O(1) space by keeping only the last 2–3 values.
    - **Watch out:** if you can't define `dp[i]` in one English sentence, you don't understand the problem yet. Don't write code.

---

## Recognition

### Use 1D DP when you see…

- The brute force is recursive AND the recursion tree has obvious **repeated calls** (Fibonacci is the textbook example).
- The answer at position `i` depends on a **bounded number of earlier answers** (typically `i-1`, `i-2`, sometimes `i-k`).
- "Maximum / minimum / count / number of ways / can you reach" — and you're moving through an array or up to a number `n`.
- The greedy solution feels almost right but fails on a small adversarial input.

### Common phrases in the prompt

- "minimum number of steps to …"
- "number of ways to …"
- "maximum sum / longest …"
- "can you climb / jump / reach …"
- "house robber" / "decode ways" / "stairs"

### Don't use 1D DP when…

- The state depends on **two indices** (e.g. two strings, grid coordinates) → that's [2D DP](./dp-2d.md).
- A simple greedy provably works (interval scheduling by end time, for instance). DP is overkill.
- The recursion has no overlap (e.g. backtracking through permutations) → just [backtrack](./backtracking.md).

---

## Core Intuition

> If the recursive call tree visits the same subproblem multiple times, cache it. The cache turns O(2^n) into O(n).

Two equivalent ways to write DP:

1. **Top-down (memoization).** Write the recursion naturally, then add a cache. Easy to derive from the recursive solution.
2. **Bottom-up (tabulation).** Build a `dp` array, fill it in order so every cell's dependencies are already computed. Faster (no recursion overhead), uses less stack.

For interviews, **bottom-up is usually preferred** — it's iterative, easy to reason about complexity, and naturally leads to the "rolling variables" space optimization.

The whole pattern is:

1. **Define `dp[i]` in one sentence.** "The minimum cost to reach step `i`." If you can't, stop and re-read.
2. **Write the recurrence.** `dp[i] = min(dp[i-1], dp[i-2]) + cost[i]`.
3. **Identify base cases.** What are `dp[0]` and `dp[1]`?
4. **Iterate.** Loop `i` from the base up to `n`.
5. **Return.** Usually `dp[n]` or `dp[n-1]`.

---

## Generic Algorithm

```text
1. Define dp[i] = <one-sentence answer for prefix/state i>
2. Base case: dp[0] = ..., dp[1] = ... (whatever the problem gives you)
3. For i = base+1 .. n:
     dp[i] = recurrence in terms of dp[i-1], dp[i-2], ..., dp[i-k]
4. Return dp[n] (or whichever index holds the final answer)

Optional optimization:
5. If dp[i] only depends on the last k values, replace the array
   with k rolling variables for O(k) space.
```

---

## Implementation

### JavaScript — climbing stairs (Fibonacci variant)

`dp[i]` = number of distinct ways to reach step `i`. Each step you can climb 1 or 2.

```js
function climbStairs(n) {
  if (n <= 2) return n;

  let prev2 = 1; // dp[1]
  let prev1 = 2; // dp[2]

  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

> Note the O(1) space optimization — `dp` only ever needs the last two values.

### JavaScript — house robber (can't rob adjacent houses)

`dp[i]` = max money robbable from houses `0..i`.
Recurrence: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` — either skip house `i`, or take it plus the best from `i-2` back.

```js
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let prev2 = 0;
  let prev1 = 0;

  for (const n of nums) {
    const curr = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

### JavaScript — coin change (minimum coins to make amount)

`dp[i]` = minimum coins to make amount `i`. Recurrence: `dp[i] = min(dp[i - coin] + 1)` over all coins.

```js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

> Can't easily reduce to O(1) space here — `dp[i]` depends on `dp[i - coin]` for every coin, so the window of needed history is `max(coins)`.

### JavaScript — longest increasing subsequence (O(n²) DP version)

`dp[i]` = length of the longest increasing subsequence ending at index `i`.

```js
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  let best = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}
```

> There's an O(n log n) version using binary search on a "patience sort" tails array — worth knowing exists, but in an interview the O(n²) is usually fine and clearly explains your thinking.

---

## Complexity

| Variant                       | Time     | Space | Notes |
|-------------------------------|----------|-------|-------|
| Linear recurrence (stairs)    | O(n)     | O(1)  | Rolling variables. |
| Linear with array choices     | O(n · k) | O(n)  | k = number of choices per step (coins, jumps). |
| Pair-dependent (LIS, O(n²))   | O(n²)    | O(n)  | Inner loop scans all earlier positions. |

---

## Common Mistakes

1. **Writing code before defining `dp[i]` in plain English.** This is the #1 way DP problems fail. If you can't say "`dp[i]` is the …" out loud, the recurrence will be wrong. Stop and define it first.
2. **Off-by-one on the array size.** Most DP problems want `dp.length === n + 1` because `dp[0]` is "the empty prefix" base case. Drawing the indices on paper for `n=3` prevents 90% of these bugs.
3. **Wrong base cases.** "Number of ways to make amount 0" is **1** (the empty selection), not 0. "Min coins for amount 0" is 0, not Infinity. Get these wrong and the whole table is off.
4. **Reaching for DP when greedy works.** "Minimum arrows to burst balloons" looks like DP but is greedy on sorted end-times. Conversely, "max profit, can transact unlimited times" looks like DP but is greedy (sum positive deltas). Always sanity-check both.
5. **Optimizing to O(1) space before the recurrence is right.** First get the full `dp` array version correct and passing. *Then* notice you only used the last 2 values and collapse. Premature optimization with rolling variables is a leading cause of off-by-one bugs in interviews.
6. **Confusing "subsequence" with "substring/subarray."** Subsequence allows skipping elements (LIS is a subsequence problem); substring is contiguous (use sliding window). Misreading this re-derives the wrong algorithm.

---

## Related Problems

- 🟢 **Easy** — [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) — the Fibonacci of DP. Start here.
- 🟢 **Easy** — [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) — climbing stairs with a cost — tiny twist.
- 🟡 **Medium** — [House Robber](https://leetcode.com/problems/house-robber/) — canonical "take it or skip it" recurrence.
- 🟡 **Medium** — [House Robber II](https://leetcode.com/problems/house-robber-ii/) — circular array — run House Robber twice (first vs last).
- 🟡 **Medium** — [Coin Change](https://leetcode.com/problems/coin-change/) — must-know "unbounded knapsack" shape.
- 🟡 **Medium** — [Decode Ways](https://leetcode.com/problems/decode-ways/) — string DP, base case sensitivity (zeros are tricky).
- 🟡 **Medium** — [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) — O(n²) DP, O(n log n) with binary search.
- 🟡 **Medium** — [Word Break](https://leetcode.com/problems/word-break/) — `dp[i]` = "can prefix of length i be segmented" + Set of dictionary words.
- 🔴 **Hard** — [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) — track both min and max (negatives flip).

---

## Related Patterns

- **[2D DP](./dp-2d.md)** — when the state needs two indices (two strings, a grid, knapsack with item index + capacity). Same mental model, one more dimension.
- **[Backtracking](./backtracking.md)** — DP is the optimization when the backtracking solution has overlapping subproblems. If you've solved a problem with backtracking and it TLE's, look for the overlap.
- **[Greedy](./greedy.md)** — the alternative when local optimal choices are provably globally optimal. Faster than DP when it applies, but harder to be sure it applies.
- **[Arrays & Hashing](./arrays-hashing.md)** — many DP solutions need a map keyed on state. Comfort with hash maps is a prerequisite.
