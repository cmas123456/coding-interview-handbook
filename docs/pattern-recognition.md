# Pattern Recognition

> Given a prompt, how do you pick the right pattern in 30 seconds?

This is the single highest-leverage page in the handbook. Read it, then re-read it before every mock interview.

---

## The 30-second decision tree

Walk this top to bottom. Stop at the first match.

### 1. What's the input shape?

| Input | First-pass pattern |
|---|---|
| Sorted array | [Binary Search](patterns/binary-search.md) or [Two Pointers](patterns/two-pointers.md) |
| Unsorted array, need counts/duplicates/groups | [Arrays & Hashing](patterns/arrays-hashing.md) (Map/Set) |
| Array of intervals `[start, end]` | [Intervals](patterns/intervals.md) (sort first) |
| Array, contiguous subarray problem | [Sliding Window](patterns/sliding-window.md) |
| Array, range-sum or range-count queries | [Prefix Sum](patterns/prefix-sum.md) |
| Linked list | [Linked Lists](patterns/linked-list.md) (often two-pointer fast/slow) |
| Tree (binary or n-ary) | [Trees](patterns/tree.md) (DFS or BFS) |
| Graph / grid / "connected" / "neighbors" | [Graphs](patterns/graph.md) (BFS for shortest, DFS for explore) |
| Strings — prefix matching, autocomplete | [Trie](patterns/trie.md) |
| Stream of data, "process in order" | [Queue](patterns/queue.md) |

### 2. What's the goal?

| Goal | Pattern |
|---|---|
| "Find the k-th / top-k / smallest-k" | [Heap](patterns/heap.md) |
| "Next greater / next smaller element" | [Monotonic Stack](patterns/monotonic-stack.md) |
| "Are X and Y connected? / count components" | [Union Find](patterns/union-find.md) or [Graphs](patterns/graph.md) |
| "Generate all permutations / combinations / subsets" | [Backtracking](patterns/backtracking.md) |
| "Minimum / maximum / count of ways" with overlapping subproblems | [Dynamic Programming I](patterns/dp-1d.md) or [II](patterns/dp-2d.md) |
| "Minimum number of …" with a clear local choice | [Greedy](patterns/greedy.md) (verify with counter-example!) |
| "Without using +/-" / "single number" / "count set bits" | [Bit Manipulation](patterns/bit-manipulation.md) |
| Validate balanced/nested structure (parens, paths) | [Stack](patterns/stack.md) |

---

## Trigger phrases — what the prompt says vs what it means

| If the prompt says… | Think… |
|---|---|
| "contiguous subarray / substring" | [Sliding Window](patterns/sliding-window.md) |
| "pair / triplet that sums to" | sorted? → [Two Pointers](patterns/two-pointers.md). Otherwise → [Arrays & Hashing](patterns/arrays-hashing.md) |
| "rotated sorted array" / "search in O(log n)" | [Binary Search](patterns/binary-search.md) |
| "merge / overlap / meeting rooms" | [Intervals](patterns/intervals.md) |
| "top k / k-th largest / k closest" | [Heap](patterns/heap.md) (size-k heap of the **opposite** kind) |
| "next greater / daily temperatures / largest rectangle" | [Monotonic Stack](patterns/monotonic-stack.md) |
| "shortest path in unweighted graph/grid" | BFS — see [Graphs](patterns/graph.md) |
| "shortest path with weights" | Dijkstra (heap + graph — see [Heap](patterns/heap.md) + [Graphs](patterns/graph.md)) |
| "count ways to … / minimum cost to …" | [DP I](patterns/dp-1d.md) (one index) or [DP II](patterns/dp-2d.md) (two indices/strings) |
| "all subsets / permutations / combinations / valid arrangements" | [Backtracking](patterns/backtracking.md) |
| "is this a palindrome" | [Two Pointers](patterns/two-pointers.md) (opposite-ends) |
| "cycle in linked list / middle of linked list" | [Two Pointers](patterns/two-pointers.md) (fast/slow) |
| "level order / shortest in tree" | BFS — see [Trees](patterns/tree.md) |
| "connected components / friend circles / accounts" | [Union Find](patterns/union-find.md) |
| "valid parentheses / nested" | [Stack](patterns/stack.md) |

---

## When two patterns both fit

It happens often. Quick tiebreakers:

- **Two Pointers vs Sliding Window** — both walk an array with two indices. Sliding Window is the *specialization* where you maintain an aggregate (sum, count, last-seen index) over the current window.
- **Two Pointers vs Binary Search** — both work on sorted arrays. Two pointers is O(n) and natural for "find a pair." Binary search is O(log n) and natural for "find an index / boundary."
- **Hashing vs Sorting** — hashing is O(n) but unordered; sorting is O(n log n) but unlocks two-pointer/binary-search/intervals. If the problem has any "after sorting" smell, sort.
- **Greedy vs DP** — greedy is faster (often O(n log n)) but only works if local optimum → global optimum. **Default to DP**; switch to greedy only when you can prove (or recognize a known greedy template).
- **BFS vs DFS** — BFS for shortest path / level order. DFS for "explore everything / does a path exist / collect all."
- **Recursion vs iteration on trees** — recursion is cleaner; iteration with an explicit stack is safer for deep trees (JS recursion limit ~10k).

---

## The "I have no idea" fallback ladder

If nothing clicks within 60 seconds:

1. **Brute force out loud.** Solve it naively in O(n²) or O(2ⁿ). State that this is your baseline, not your final answer.
2. **Identify the bottleneck.** Where does the brute force waste work? Repeated lookups → hashing. Repeated subproblems → DP. Nested loop that always scans forward → sliding window or two pointers.
3. **Sort and see.** Many array problems become trivial after sorting. Mention it as a "what if I sort first?" out loud.
4. **Try the smallest non-trivial input.** n = 3 or 4. Walking through it by hand often reveals the pattern.
5. **Name what the answer's shape is.** A boolean? A count? An index? A subarray? The shape constrains the algorithm.

---

## Practice the recognition, not just the solution

Drill yourself: read the first line of a LeetCode problem, then close it and say out loud which pattern you'd reach for and why. Open it back up and verify. Do this 30 times and recognition becomes reflex — which is most of the interview.

---

## Related

- [Big-O Cheat Sheet](complexity-cheatsheet.md) — quick reference for the cost of each pattern.
- [Pattern Atlas](patterns/arrays-hashing.md) — start clicking through. Each page opens with a 30-second Cheat Card.
