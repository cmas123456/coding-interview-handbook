# Blind 75 — By Pattern

> The canonical FAANG-prep list (75 problems), grouped by the pattern each one primarily teaches. Each entry has a **🔑 trigger** — the phrase or signal in the prompt that should fire the pattern in your head.

!!! tip "How to use this view"
    - Read the trigger **before** opening the problem — it's your prediction.
    - Open the problem, confirm the trigger matches what you see, then solve.
    - 🔒 = LeetCode Premium.
    - Want to test recognition cold (no pattern, no trigger)? Use **[Blind 75 — Blind Drill](blind75-drill.md)**.

---

**Total:** 75 problems across 17 patterns. Difficulty: 19 🟢 Easy / 49 🟡 Medium / 7 🔴 Hard.

---

## [Arrays & Hashing](patterns/arrays-hashing.md) (11)

- [ ] 🟢 **Easy** — [Two Sum](https://leetcode.com/problems/two-sum/)
    - 🔑 "return indices… sum to target" → hash map of complement.
- [ ] 🟢 **Easy** — [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)
    - 🔑 "any duplicates" / unsorted → Set, return on first hit.
- [ ] 🟢 **Easy** — [Valid Anagram](https://leetcode.com/problems/valid-anagram/)
    - 🔑 "anagram of" → char-count map (or sort both).
- [ ] 🟡 **Medium** — [Group Anagrams](https://leetcode.com/problems/group-anagrams/)
    - 🔑 "group strings that are anagrams" → key by sorted chars or char-count tuple.
- [ ] 🟡 **Medium** — [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
    - 🔑 "k most frequent" → count + bucket sort (O(n)) or heap (O(n log k)).
- [ ] 🟡 **Medium** — [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
    - 🔑 "product of all elements except i" / "no division" → prefix * suffix passes.
- [ ] 🟡 **Medium** — [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) 🔒
    - 🔑 "serialize list of strings" → length-prefix each (e.g. "5#hello").
- [ ] 🟡 **Medium** — [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)
    - 🔑 "longest consecutive sequence" / "O(n)" → Set; only start walks from sequence starts (n-1 not in set).
- [ ] 🟡 **Medium** — [Rotate Image](https://leetcode.com/problems/rotate-image/)
    - 🔑 "rotate 90° in-place" → transpose then reverse each row.
- [ ] 🟡 **Medium** — [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)
    - 🔑 "spiral order" → 4 shrinking boundaries (top/bottom/left/right).
- [ ] 🟡 **Medium** — [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/)
    - 🔑 "in-place, zero out row/col" → use first row/col as marker flags.

## [Two Pointers](patterns/two-pointers.md) (3)

- [ ] 🟢 **Easy** — [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)
    - 🔑 "palindrome ignoring non-alphanumeric" → l/r pointers, skip non-alnum, compare lowercase.
- [ ] 🟡 **Medium** — [3Sum](https://leetcode.com/problems/3sum/)
    - 🔑 "triplets that sum to 0", "no duplicates" → sort + fix i, two-pointer for rest; skip dupes.
- [ ] 🟡 **Medium** — [Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
    - 🔑 "max water" / two heights → l/r pointers, move the shorter wall.

## [Sliding Window](patterns/sliding-window.md) (4)

- [ ] 🟢 **Easy** — [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
    - 🔑 "max profit, buy before sell" → track min-so-far + max diff (single pass).
- [ ] 🟡 **Medium** — [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
    - 🔑 "longest substring without repeating" → window + Set/lastIndex map, shrink on dup.
- [ ] 🟡 **Medium** — [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/)
    - 🔑 "replace at most k chars, longest same-letter" → window; shrink while (len − maxFreq) > k.
- [ ] 🔴 **Hard** — [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)
    - 🔑 "smallest window containing all chars of t" → need/have counts, shrink when have == need.

## [Binary Search](patterns/binary-search.md) (2)

- [ ] 🟡 **Medium** — [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
    - 🔑 "rotated sorted, find min, O(log n)" → binary search; compare mid to right.
- [ ] 🟡 **Medium** — [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
    - 🔑 "rotated sorted, find target, O(log n)" → binary search; figure out which half is sorted.

## [Linked Lists](patterns/linked-list.md) (5)

- [ ] 🟢 **Easy** — [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
    - 🔑 "reverse a linked list" → prev/curr/next iterative swap.
- [ ] 🟢 **Easy** — [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)
    - 🔑 "merge two sorted lists" → dummy head + tail pointer, splice smaller.
- [ ] 🟢 **Easy** — [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
    - 🔑 "has a cycle" → Floyd's slow/fast pointers, meet means cycle.
- [ ] 🟡 **Medium** — [Reorder List](https://leetcode.com/problems/reorder-list/)
    - 🔑 "L0→Ln→L1→Ln-1…" → find mid (slow/fast) + reverse second half + merge.
- [ ] 🟡 **Medium** — [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
    - 🔑 "nth from end, one pass" → two pointers, gap of n.

## [Stack](patterns/stack.md) (1)

- [ ] 🟢 **Easy** — [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
    - 🔑 "valid parentheses ()[]{}" → stack; push opens, pop+match on close.

## [Heap](patterns/heap.md) (2)

- [ ] 🔴 **Hard** — [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
    - 🔑 "merge k sorted lists" → min-heap of heads (or divide-and-conquer pairwise merge).
- [ ] 🔴 **Hard** — [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)
    - 🔑 "median of a stream" → two heaps (max-heap low half, min-heap high half).

## [Intervals](patterns/intervals.md) (5)

- [ ] 🟢 **Easy** — [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) 🔒
    - 🔑 "can attend all meetings" → sort by start; check any overlap.
- [ ] 🟡 **Medium** — [Insert Interval](https://leetcode.com/problems/insert-interval/)
    - 🔑 "insert and merge intervals, sorted" → 3 passes: before, overlapping (merge), after.
- [ ] 🟡 **Medium** — [Merge Intervals](https://leetcode.com/problems/merge-intervals/)
    - 🔑 "merge overlapping intervals" → sort by start; merge if curr.start ≤ last.end.
- [ ] 🟡 **Medium** — [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)
    - 🔑 "min removals to make non-overlapping" → sort by end; greedy keep earliest end.
- [ ] 🟡 **Medium** — [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) 🔒
    - 🔑 "min rooms needed" → sort starts and ends separately; sweep, or min-heap of end times.

## [Trees](patterns/tree.md) (11)

- [ ] 🟢 **Easy** — [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)
    - 🔑 "invert / mirror tree" → recurse, swap left/right.
- [ ] 🟢 **Easy** — [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
    - 🔑 "max depth" → 1 + max(depth(left), depth(right)).
- [ ] 🟢 **Easy** — [Same Tree](https://leetcode.com/problems/same-tree/)
    - 🔑 "same structure and values" → recurse both, compare nodes.
- [ ] 🟢 **Easy** — [Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/)
    - 🔑 "is t a subtree of s" → recurse s; at each node run sameTree(node, t).
- [ ] 🟡 **Medium** — [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
    - 🔑 "LCA in BST" → first node where p and q split (one ≤ node ≤ other).
- [ ] 🟡 **Medium** — [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
    - 🔑 "level by level" → BFS with queue; capture size per level.
- [ ] 🟡 **Medium** — [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
    - 🔑 "valid BST" → recurse with (min, max) bounds, not just parent compare.
- [ ] 🟡 **Medium** — [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
    - 🔑 "kth smallest in BST" → in-order traversal, stop at k.
- [ ] 🟡 **Medium** — [Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
    - 🔑 "build tree from preorder + inorder" → preorder gives root, inorder splits left/right; index map for O(n).
- [ ] 🔴 **Hard** — [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)
    - 🔑 "max path sum, any node to any" → post-order; return one-arm, update global with both arms.
- [ ] 🔴 **Hard** — [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)
    - 🔑 "serialize/deserialize tree" → preorder with null markers; deserialize with queue/index.

## [Graphs](patterns/graph.md) (5)

- [ ] 🟡 **Medium** — [Number of Islands](https://leetcode.com/problems/number-of-islands/)
    - 🔑 "count islands in grid" → DFS/BFS flood-fill, mark visited.
- [ ] 🟡 **Medium** — [Clone Graph](https://leetcode.com/problems/clone-graph/)
    - 🔑 "deep copy graph" → DFS/BFS + visited map (old→new) to avoid cycles.
- [ ] 🟡 **Medium** — [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)
    - 🔑 "cells reaching both oceans" → BFS/DFS inward from each border; intersect two visited sets.
- [ ] 🟡 **Medium** — [Course Schedule](https://leetcode.com/problems/course-schedule/)
    - 🔑 "can finish all courses" → cycle detection in directed graph (DFS colors or Kahn's indegree).
- [ ] 🔴 **Hard** — [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) 🔒
    - 🔑 "order of letters from sorted words" → build edges from adjacent word pairs; topological sort (Kahn's).

## [Backtracking](patterns/backtracking.md) (2)

- [ ] 🟡 **Medium** — [Combination Sum](https://leetcode.com/problems/combination-sum/)
    - 🔑 "all combinations summing to target, reuse allowed" → backtrack; pass start index to avoid permutations.
- [ ] 🟡 **Medium** — [Word Search](https://leetcode.com/problems/word-search/)
    - 🔑 "word in grid, adjacent cells" → DFS from each cell; mark visited then unmark on return.

## [Dynamic Programming I](patterns/dp-1d.md) (11)

- [ ] 🟢 **Easy** — [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
    - 🔑 "ways to climb n stairs (1 or 2)" → Fibonacci: dp[i] = dp[i-1] + dp[i-2].
- [ ] 🟡 **Medium** — [House Robber](https://leetcode.com/problems/house-robber/)
    - 🔑 "max sum, no two adjacent" → dp[i] = max(dp[i-1], dp[i-2] + nums[i]).
- [ ] 🟡 **Medium** — [House Robber II](https://leetcode.com/problems/house-robber-ii/)
    - 🔑 "houses in a circle" → run house-robber twice: [0..n-2] and [1..n-1], take max.
- [ ] 🟡 **Medium** — [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)
    - 🔑 "longest palindromic substring" → expand around each center (odd + even).
- [ ] 🟡 **Medium** — [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)
    - 🔑 "count palindromic substrings" → expand around each center, count expansions.
- [ ] 🟡 **Medium** — [Decode Ways](https://leetcode.com/problems/decode-ways/)
    - 🔑 "decode digits to letters A-Z" → dp; check 1-digit (1-9) and 2-digit (10-26) at each step.
- [ ] 🟡 **Medium** — [Coin Change](https://leetcode.com/problems/coin-change/)
    - 🔑 "fewest coins to make amount" → unbounded knapsack; dp[a] = min(dp[a-c]+1).
- [ ] 🟡 **Medium** — [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)
    - 🔑 "max product subarray" → track curMax AND curMin (negatives flip).
- [ ] 🟡 **Medium** — [Word Break](https://leetcode.com/problems/word-break/)
    - 🔑 "can string be segmented into dict words" → dp[i] = any j where dp[j] && s[j..i] in dict.
- [ ] 🟡 **Medium** — [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
    - 🔑 "longest increasing subseq" → O(n²) dp or O(n log n) with patience/binary search.
- [ ] 🟡 **Medium** — [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
    - 🔑 "max sum subarray" → Kadane: curSum = max(num, curSum + num).

## [Trie](patterns/trie.md) (3)

- [ ] 🟡 **Medium** — [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
    - 🔑 "insert/search/startsWith" → classic trie: children map + isEnd flag.
- [ ] 🟡 **Medium** — [Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)
    - 🔑 "search with . wildcard" → trie + DFS; on . recurse all children.
- [ ] 🔴 **Hard** — [Word Search II](https://leetcode.com/problems/word-search-ii/)
    - 🔑 "find all words in board" → build trie of words; DFS from each cell, prune via trie.

## [Union Find](patterns/union-find.md) (2)

- [ ] 🟡 **Medium** — [Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) 🔒
    - 🔑 "count connected components" → union-find on edges; count roots. (or DFS).
- [ ] 🟡 **Medium** — [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) 🔒
    - 🔑 "valid tree: connected + no cycle" → union-find; reject union of same root; need exactly n-1 edges.

## [Greedy](patterns/greedy.md) (1)

- [ ] 🟡 **Medium** — [Jump Game](https://leetcode.com/problems/jump-game/)
    - 🔑 "can reach last index" → greedy: track furthest reachable; fail if i > reach.

## [Dynamic Programming II](patterns/dp-2d.md) (2)

- [ ] 🟡 **Medium** — [Unique Paths](https://leetcode.com/problems/unique-paths/)
    - 🔑 "paths in m×n grid, right/down only" → dp[i][j] = dp[i-1][j] + dp[i][j-1] (or C(m+n-2, m-1)).
- [ ] 🟡 **Medium** — [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)
    - 🔑 "LCS of two strings" → 2D dp; match → dp[i-1][j-1]+1, else max(up,left).

## [Bit Manipulation](patterns/bit-manipulation.md) (5)

- [ ] 🟢 **Easy** — [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)
    - 🔑 "count set bits" → loop n &= n-1 (clears lowest set bit each time).
- [ ] 🟢 **Easy** — [Counting Bits](https://leetcode.com/problems/counting-bits/)
    - 🔑 "set bits for 0..n" → dp: bits[i] = bits[i >> 1] + (i & 1).
- [ ] 🟢 **Easy** — [Reverse Bits](https://leetcode.com/problems/reverse-bits/)
    - 🔑 "reverse 32 bits" → shift result left, OR low bit of n, n >>= 1, 32 times.
- [ ] 🟢 **Easy** — [Missing Number](https://leetcode.com/problems/missing-number/)
    - 🔑 "missing in [0..n]" → XOR all indices and values; or sum diff.
- [ ] 🟡 **Medium** — [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/)
    - 🔑 "add without + or −" → XOR for sum-no-carry, AND<<1 for carry; loop until carry == 0.

