# Backtracking

> Build answers by DFS-ing an implicit decision tree: choose one option, explore it, then un-choose it so the next branch starts clean.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** generate all subsets / permutations / combinations, fill a board, or search all valid paths.
    - **Do:** `path.push(choice)`, recurse, then `path.pop()`; copy `path` when recording an answer.
    - **Cost:** exponential time, usually O(n) recursion/path space plus output size.
    - **Watch out:** forgetting the un-choose step makes the shared `path` accumulate across branches.

---

## Recognition

### Use backtracking when you see…

- The prompt asks for **all** valid answers: all subsets, all permutations, all combinations, all partitions.
- You make a sequence of choices and can reject partial choices early with constraints.
- The input size is small (`n <= 10`, `n <= 15`, board sizes like 9x9) because the search is exponential.
- The problem is naturally an **implicit tree**: each level chooses the next number, character, cell, or placement.

### Common phrases in the prompt

- "return all possible …"
- "generate all combinations / permutations / subsets"
- "find all valid arrangements"
- "place queens", "solve sudoku"
- "word exists in a grid"
- "partition into palindromes"

### Don't use backtracking when…

- You only need a count / best value and subproblems overlap heavily → use **dynamic programming** instead.
- The prompt needs shortest path in an unweighted graph → use [graph](./graph.md) BFS.
- You can greedily prove one local choice is always safe → backtracking will be too slow.

---

## Core Intuition

> Backtracking works because each recursive call owns one partial answer, and the `push → recurse → pop` symmetry restores shared state before trying the next branch.

Think of backtracking as DFS over choices, not over explicit nodes. `path` is the route from the root of the decision tree to your current state. When a path is complete, copy it into `result`; when a choice fails or finishes, undo exactly what you changed so sibling branches do not inherit stale state.

---

## Generic Algorithm

### Choose / explore / un-choose template

```text
function backtrack(path, choices):
  if isComplete(path):
    result.push(copy(path))
    return

  for each choice in choices:
    if not isValid(choice, path):
      continue

    path.push(choice)
    backtrack(path, nextChoices)
    path.pop()
```

### Start-index template (combinations, subsets, no reusing earlier items)

```text
function backtrack(start, path):
  record path if appropriate

  for i = start .. n - 1:
    if nums[i] is a duplicate at this depth, continue
    path.push(nums[i])
    backtrack(i + 1, path)
    path.pop()
```

### Grid search template (mark / explore / unmark)

```text
function dfs(row, col, index):
  if index == word.length, return true
  if out of bounds or cell invalid or visited, return false

  mark cell visited
  for each direction:
    if dfs(nextRow, nextCol, index + 1), return true
  unmark cell visited
  return false
```

---

## Implementation

### JavaScript — subsets (choose / don't choose)

```js
function subsetsChooseSkip(nums) {
  const result = [];
  const path = [];

  function backtrack(index) {
    if (index === nums.length) {
      result.push([...path]);
      return;
    }

    path.push(nums[index]);
    backtrack(index + 1);
    path.pop();

    backtrack(index + 1);
  }

  backtrack(0);
  return result;
}
```

### JavaScript — subsets (iterative doubling)

```js
function subsetsIterative(nums) {
  const result = [[]];

  for (const num of nums) {
    const size = result.length;
    for (let i = 0; i < size; i++) {
      result.push([...result[i], num]);
    }
  }

  return result;
}
```

### JavaScript — permutations (used set)

```js
function permute(nums) {
  const result = [];
  const path = [];
  const used = new Set();

  function backtrack() {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used.has(i)) continue;

      used.add(i);
      path.push(nums[i]);
      backtrack();
      path.pop();
      used.delete(i);
    }
  }

  backtrack();
  return result;
}
```

### JavaScript — combination sum (start index allows reuse)

```js
function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const result = [];
  const path = [];

  function backtrack(start, remaining) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (candidate > remaining) break;

      path.push(candidate);
      backtrack(i, remaining - candidate);
      path.pop();
    }
  }

  backtrack(0, target);
  return result;
}
```

### JavaScript — word search on a grid (mark / unmark)

```js
function exist(board, word) {
  const rows = board.length;
  const cols = rows === 0 ? 0 : board[0].length;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  function dfs(row, col, index) {
    if (index === word.length) return true;
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    if (board[row][col] !== word[index]) return false;

    const original = board[row][col];
    board[row][col] = "#";

    for (const [dr, dc] of dirs) {
      if (dfs(row + dr, col + dc, index + 1)) {
        board[row][col] = original;
        return true;
      }
    }

    board[row][col] = original;
    return false;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (dfs(row, col, 0)) return true;
    }
  }

  return false;
}
```

---

## Complexity

| Variant                    | Time              | Space | Notes |
|----------------------------|-------------------|-------|-------|
| Subsets                    | O(n · 2^n)        | O(n)  | There are 2^n subsets, and copying each path costs up to n. |
| Permutations               | O(n · n!)         | O(n)  | There are n! permutations, each copied at length n. |
| Combination Sum            | Exponential       | O(t)  | t = max path length (`target / minCandidate`); pruning with sorted candidates helps. |
| Word Search                | O(r · c · 4^L)    | O(L)  | L = word length; each start cell can branch in four directions. |

Output storage is larger than the recursion stack for generation problems. When discussing space, say whether you are excluding the returned `result`.

---

## Common Mistakes

1. **Forgetting `path.pop()` after recursion.** Your `path` is shared by all branches; without the pop, choices leak into siblings forever.
2. **Pushing `path` into results instead of `[...path]`.** That stores a reference, so every result becomes the same final mutated array. Copy when recording.
3. **Handling duplicates without sorting and skipping.** For duplicate inputs, sort first and use `if (i > start && nums[i] === nums[i - 1]) continue;` to skip repeats at the same depth.
4. **Using the wrong `start` index.** `backtrack(i + 1)` means each element can be used once; `backtrack(i)` means the same candidate can be reused.
5. **Not unmarking grid cells.** Word Search needs `mark → recurse → unmark` so other paths can reuse the cell later.
6. **Ignoring exponential blowup.** If the prompt asks for one optimal value and subproblems repeat, backtracking may TLE; look for a DP state instead.

---

## Related Problems

- 🟡 **Medium** — [Subsets](https://leetcode.com/problems/subsets/) — canonical include / exclude recursion.
- 🟡 **Medium** — [Subsets II](https://leetcode.com/problems/subsets-ii/) — adds sorted duplicate skipping at the same recursion depth.
- 🟡 **Medium** — [Permutations](https://leetcode.com/problems/permutations/) — choose every unused element until the path length is n.
- 🟡 **Medium** — [Combinations](https://leetcode.com/problems/combinations/) — the `start` index prevents reusing earlier numbers.
- 🟡 **Medium** — [Combination Sum](https://leetcode.com/problems/combination-sum/) — reuse current candidate with `backtrack(i, remaining - candidate)`.
- 🟡 **Medium** — [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) — no reuse plus duplicate skipping.
- 🟡 **Medium** — [Word Search](https://leetcode.com/problems/word-search/) — grid DFS with mark / unmark state.
- 🔴 **Hard** — [N-Queens](https://leetcode.com/problems/n-queens/) — place rows one by one while tracking invalid columns and diagonals.

---

## Related Patterns

- **[Tree](./tree.md)** — backtracking is DFS on an implicit decision tree rather than a concrete binary tree.
- **[Graph](./graph.md)** — graph DFS marks visited globally; backtracking often unmarks so each path can make different choices.
- **[DP 1D](./dp-1d.md)** — when backtracking recomputes the same state many times, memoization / DP is the optimization.
- **[Sliding Window](./sliding-window.md)** — reach for windows when choices must stay contiguous; reach for backtracking when choices can branch.
