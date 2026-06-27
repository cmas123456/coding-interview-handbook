# Tree

> Traverse a binary tree by handling the current node, recursing into children, and combining results — or use a queue when the problem asks for level-by-level order.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** binary tree / BST + recursive structure OR level-order / breadth-first wording.
    - **Do:** DFS = base case, recurse left, recurse right, combine; BFS = queue nodes and process one level at a time.
    - **Cost:** O(n) time, O(h) DFS stack or O(w) BFS queue space.
    - **Watch out:** BST validation needs min/max bounds, not just direct child comparisons.

---

## Recognition

### Use tree traversal when you see…

- Input is a **binary tree**, **BST**, or nested node structure with `left` / `right` pointers.
- The answer depends on combining answers from the left and right subtrees: height, diameter, balance, same tree, max path.
- The prompt says **level order**, **each level**, **minimum depth**, or **nearest** node — that usually means BFS.
- The tree property gives you a shortcut: in a **BST**, every left value is smaller and every right value is larger across the whole subtree.

### Common phrases in the prompt

- "maximum depth / minimum depth of a binary tree"
- "inorder / preorder / postorder traversal"
- "level order traversal"
- "validate binary search tree"
- "lowest common ancestor"
- "construct a tree from traversals"

### Don't use tree traversal when…

- The structure has arbitrary cycles or shared nodes → treat it as a [graph](./graph.md) and track `visited`.
- You need repeated min/max lookup from a stream → use a **heap**, not repeated tree traversal.
- The input is a sorted array and asks for search by value → use **binary search** directly.

---

## Core Intuition

> A tree is recursive: the answer for a node is usually "what I know about this node" combined with "what my left subtree says" and "what my right subtree says."

DFS works because every subtree is the same problem at a smaller size. You define a base case for `null`, recursively solve children, then combine their answers. BFS is the non-recursive counterpart when distance from the root matters: process nodes in waves so everything at depth `d` is handled before depth `d + 1`.

---

## Generic Algorithm

### DFS recursion (recurse left, recurse right, combine)

```text
1. Define recurse(node):
     a. If node is null, return the base value.
     b. left = recurse(node.left)
     c. right = recurse(node.right)
     d. Return combine(node.val, left, right).
2. Call recurse(root).
3. Return the final answer.
```

### DFS traversal order

```text
Preorder:  visit node, recurse left, recurse right.
Inorder:   recurse left, visit node, recurse right.
Postorder: recurse left, recurse right, visit node.
```

### BFS level order (queue)

```text
1. If root is null, return [].
2. queue = [root]; answer = [].
3. While queue is not empty:
     a. level = []
     b. size = queue.length
     c. Repeat size times:
          node = queue.shift()
          add node.val to level
          if node.left exists, queue.push(node.left)
          if node.right exists, queue.push(node.right)
     d. add level to answer
4. Return answer.
```

`queue.shift()` is clear pseudocode. In JavaScript interviews, mention that `Array.prototype.shift()` is O(n); use a `head` index for true O(n) traversal.

---

## Implementation

### JavaScript — DFS inorder traversal (recursive)

```js
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function inorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
}
```

### JavaScript — BFS level order traversal

```js
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];
  let head = 0;

  while (head < queue.length) {
    const level = [];
    const levelSize = queue.length - head;

    for (let i = 0; i < levelSize; i++) {
      const node = queue[head];
      head++;
      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}
```

### JavaScript — maximum depth (canonical combine)

```js
function maxDepth(root) {
  if (!root) return 0;

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  return 1 + Math.max(leftDepth, rightDepth);
}
```

### JavaScript — validate BST (pass min/max bounds)

```js
function isValidBST(root) {
  function dfs(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;

    return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);
  }

  return dfs(root, -Infinity, Infinity);
}
```

---

## Complexity

| Variant                    | Time | Space | Notes |
|----------------------------|------|-------|-------|
| DFS traversal              | O(n) | O(h)  | h = tree height from recursion stack; O(n) in a skewed tree. |
| BFS level order            | O(n) | O(w)  | w = maximum width of the tree; use a head index instead of `shift()` for O(n). |
| Maximum depth              | O(n) | O(h)  | Every node contributes one combine step. |
| Validate BST with bounds   | O(n) | O(h)  | Bounds carry ancestor constraints down the recursion. |

---

## Common Mistakes

1. **Forgetting the null check at recursion entry.** Every tree DFS starts with `if (!node) return baseValue;` or you'll dereference `node.left` on `null`.
2. **Validating a BST by comparing only direct children.** A right grandchild inside the left subtree can still violate the root. Pass `min` / `max` bounds from ancestors.
3. **Using `array.shift()` and calling it O(1).** It is O(n) in JavaScript because elements are re-indexed. Use a `head` pointer for queue-style traversal.
4. **Confusing plain BFS with level-order BFS.** If the output needs `[[level0], [level1]]`, snapshot `levelSize` before the inner loop.
5. **Returning the wrong base value.** For depth, `null` returns `0`; for "is valid" checks, `null` usually returns `true`; for max path, it may return `0` or `-Infinity` depending on the invariant.
6. **Assuming recursion depth is always safe.** A skewed tree with many nodes can overflow the JS call stack; mention iterative DFS if the interviewer pushes on constraints.

---

## Related Problems

- 🟢 **Easy** — [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) — clean recursive swap: solve left, solve right, combine by swapping.
- 🟢 **Easy** — [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) — the canonical `1 + max(left, right)` combine.
- 🟢 **Easy** — [Same Tree](https://leetcode.com/problems/same-tree/) — recurse through both trees at once and compare structure + values.
- 🟡 **Medium** — [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) — tests whether you know the ancestor-bound trick.
- 🟡 **Medium** — [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — canonical BFS with per-level batching.
- 🟡 **Medium** — [Lowest Common Ancestor of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) — use BST ordering to walk one branch instead of both.
- 🟡 **Medium** — [Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) — recursion with index ranges and a value→index map.
- 🔴 **Hard** — [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) — return one-branch gain upward while updating a global best through the node.

---

## Related Patterns

- **[Graph](./graph.md)** — trees are acyclic graphs; once cycles appear, add a `visited` set.
- **[Backtracking](./backtracking.md)** — path-finding in trees is DFS on a decision tree with choose / un-choose state.
- **[Heap](./heap.md)** — a heap is a complete binary tree optimized for repeated min/max extraction, not arbitrary traversal.
- **[Binary Search](./binary-search.md)** — BST search uses ordering like binary search, but through pointers instead of array indices.
