# Dynamic Programming (2D)

> Use a table `dp[i][j]` when the answer depends on two coordinates — grid position, two string prefixes, item index plus capacity, or an interval `i..j`.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** two strings, grid paths, item × capacity, or state over an interval `i..j`.
    - **Do:** define `dp[i][j]` in one English sentence, initialize row/col bases, fill in dependency order.
    - **Cost:** usually O(n·m) time and O(n·m) space; often reducible to two rows or one row.
    - **Watch out:** string DP off-by-one — use `(n + 1) x (m + 1)` where `dp[i][j]` means first `i` and first `j` chars.

---

## Recognition

### Use 2D DP when you see…

- Two independent indices: **two strings**, **two arrays**, **grid row/column**, **items × capacity**, or **left/right interval endpoints**.
- A brute-force recursion branches and revisits the same `(i, j)` state many times.
- The answer for a cell depends on neighboring cells like `(i - 1, j)`, `(i, j - 1)`, or `(i - 1, j - 1)`.
- Phrases like "longest common", "edit distance", "number of paths", "minimum path sum", or "0/1 knapsack."

### Common phrases in the prompt

- "edit distance" / "minimum operations to convert"
- "longest common subsequence"
- "two strings"
- "unique paths" / "grid path counting"
- "knapsack" / "capacity"
- "choose items without reusing them"
- "interval from `i` to `j`"

### Don't use 2D DP when…

- One index is enough and the state only depends on earlier positions → use [Dynamic Programming (1D)](./dp-1d.md).
- The grid problem is just shortest path with arbitrary obstacles/weights and no monotonic movement → use [Graph](./graph.md).
- You need all combinations/permutations and there is no overlap between subproblems → use [Backtracking](./backtracking.md).

---

## Core Intuition

> Same as 1D DP, but every subproblem is named by two coordinates: define `dp[i][j]` first, then fill the table in an order where its neighbors already exist.

The first step is still non-negotiable: **define `dp[i][j]` in one English sentence.** Examples:

- `dp[i][j]` = number of paths to reach grid cell `(i, j)`.
- `dp[i][j]` = LCS length of `text1[0..i)` and `text2[0..j)`.
- `dp[i][c]` = best value using the first `i` items with capacity `c`.

Once the meaning is clear, the recurrence is usually forced by the neighbors:

- From above: `(i - 1, j)`.
- From left: `(i, j - 1)`.
- From diagonal: `(i - 1, j - 1)`.

Most 2D DP bugs are not clever-algorithm bugs. They are **bad state definitions, missing base rows/cols, or off-by-one string indices**.

---

## Generic Algorithm

```text
1. Define dp[i][j] in one English sentence.
2. Decide table size.
   For strings, prefer (n + 1) x (m + 1), where row/col 0 mean empty prefix.
3. Initialize base row and base column.
4. Choose fill order so dependencies are ready:
     a. Top-left to bottom-right for grid/string prefix DP.
     b. Items outer, capacity inner for knapsack.
     c. Increasing interval length for interval DP.
5. For each cell, apply the recurrence from its neighbors.
6. Return the cell that represents the full problem, usually dp[n][m].
7. Only after correctness, consider two-row or one-row space optimization.
```

---

## Implementation

### JavaScript — Unique Paths (grid paths)

`dp[i][j]` = number of ways to reach cell `(i, j)` from `(0, 0)` moving only down or right.

```js
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));

  for (let row = 1; row < m; row++) {
    for (let col = 1; col < n; col++) {
      dp[row][col] = dp[row - 1][col] + dp[row][col - 1];
    }
  }
  return dp[m - 1][n - 1];
}
```

### JavaScript — Longest Common Subsequence (two strings)

`dp[i][j]` = LCS length for the first `i` chars of `text1` and first `j` chars of `text2`.

```js
function longestCommonSubsequence(text1, text2) {
  const n = text1.length;
  const m = text2.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[n][m];
}
```

### JavaScript — Edit Distance (three-way minimum)

`dp[i][j]` = minimum edits to convert the first `i` chars of `word1` into the first `j` chars of `word2`.

```js
function minDistance(word1, word2) {
  const n = word1.length;
  const m = word2.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const insertCost = dp[i][j - 1];
        const deleteCost = dp[i - 1][j];
        const replaceCost = dp[i - 1][j - 1];
        dp[i][j] = 1 + Math.min(insertCost, deleteCost, replaceCost);
      }
    }
  }
  return dp[n][m];
}
```

### JavaScript — 0/1 Knapsack (items × capacity)

`dp[i][cap]` = best value using the first `i` items with capacity `cap`. Each item can be used at most once.

```js
function knapsack01(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const weight = weights[i - 1];
    const value = values[i - 1];

    for (let cap = 0; cap <= capacity; cap++) {
      dp[i][cap] = dp[i - 1][cap];
      if (weight <= cap) {
        dp[i][cap] = Math.max(dp[i][cap], dp[i - 1][cap - weight] + value);
      }
    }
  }
  return dp[n][capacity];
}
```

> Space optimization: 0/1 knapsack can become one row if you traverse `cap` **backward**. Forward traversal accidentally reuses the same item more than once.

---

## Complexity

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| Grid paths / min path sum | O(m·n) | O(m·n) | Often reducible to one row. |
| Two-string DP (LCS) | O(n·m) | O(n·m) | Can use two rows because only previous row is needed. |
| Edit distance | O(n·m) | O(n·m) | Base row/col represent insert/delete from empty prefix. |
| 0/1 knapsack | O(n·C) | O(n·C) | C = capacity; one-row optimization uses backward capacity loop. |
| Interval DP | O(n²) to O(n³) | O(n²) | Fill by increasing interval length. |

---

## Common Mistakes

1. **Writing code before defining `dp[i][j]`.** If you cannot say "`dp[i][j]` is the answer for …" in one sentence, the recurrence will drift. Stop and define the state first.
2. **Using `n x m` for string DP and losing the empty prefix.** For LCS/Edit Distance, `dp[0][j]` and `dp[i][0]` are real states. Use `(n + 1) x (m + 1)`.
3. **Mixing prefix indices with character indices.** If `dp[i][j]` means first `i` chars, the current chars are `text1[i - 1]` and `text2[j - 1]`, not `text1[i]` and `text2[j]`.
4. **Skipping base row/column initialization.** Edit Distance needs `dp[i][0] = i` deletions and `dp[0][j] = j` insertions. Leaving zeros makes every answer too small.
5. **Filling in the wrong order.** If a cell uses top/left/diagonal, fill top-left to bottom-right. If interval DP uses shorter intervals, fill by increasing length.
6. **Space-optimizing knapsack with a forward capacity loop.** Forward traversal turns 0/1 knapsack into unbounded knapsack because the same row reuses the current item.

---

## Related Problems

- 🟡 **Medium** — [Unique Paths](https://leetcode.com/problems/unique-paths/) — clean grid DP with top + left recurrence.
- 🟡 **Medium** — [Unique Paths II](https://leetcode.com/problems/unique-paths-ii/) — same grid recurrence with blocked cells.
- �� **Medium** — [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) — grid DP where each cell adds a cost.
- 🟡 **Medium** — [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) — canonical two-string prefix table.
- 🔴 **Hard** — [Edit Distance](https://leetcode.com/problems/edit-distance/) — insert/delete/replace recurrence with sensitive bases.
- 🔴 **Hard** — [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) — count ways one string forms another.
- 🔴 **Hard** — [Interleaving String](https://leetcode.com/problems/interleaving-string/) — two indices decide whether prefixes can interleave.
- 🔴 **Hard** — [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) — pattern/string DP with tricky `*` transitions.

---

## Related Patterns

- **[Dynamic Programming (1D)](./dp-1d.md)** — read this first. 2D DP is the same discipline with one more coordinate.
- **[Arrays & Hashing](./arrays-hashing.md)** — maps and arrays are common state containers for memoized DP and sparse tables.
- **[Backtracking](./backtracking.md)** — DP often replaces brute-force recursion when the recursion revisits the same `(i, j)` states.
- **[Graph](./graph.md)** — if movement is not monotonic or cells can be revisited, model the grid as a graph instead of a DP table.
