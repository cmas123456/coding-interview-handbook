# Disjoint Set Union (DSU)

> Use union-find to maintain connected components as edges arrive, answering "are these two items in the same group?" in near-constant amortized time.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** connected components, same group, redundant connection, accounts merge, Kruskal MST.
    - **Do:** represent each set by a root parent; `find` compresses paths and `union` attaches roots by rank.
    - **Cost:** Near O(1) amortized per operation, O(n) space.
    - **Watch out:** `union` should return whether a merge happened; false often means you found a cycle.

---

## Recognition

### Use union-find when you see…

- You need to maintain **connected components** while edges or relationships are added.
- The question asks whether `x` and `y` are in the **same group**.
- You need to detect the first edge that creates a cycle, like Redundant Connection.
- Components are formed by equivalence relationships: same email account, same row/column, equality equations.
- Kruskal's MST appears: sort edges, then add edges that connect different components.

### Common phrases in the prompt

- "connected components"
- "is X connected to Y"
- "redundant connection"
- "number of islands II" / online island additions
- "accounts merge"
- "Kruskal's minimum spanning tree"

### Don't use union-find when…

- You need the actual path between nodes → use [graph](./graph.md) traversal.
- Edges are removed frequently → basic DSU does not support deletions well.
- Connectivity is directed → DSU handles undirected/equivalence connectivity, not reachability in directed graphs.
- You need shortest paths → use BFS/Dijkstra-style graph algorithms, not DSU.

---

## Core Intuition

> Every component has a representative root; if two nodes have the same root, they are already connected, otherwise union joins the two roots.

A naive component label can require updating many nodes after every merge. DSU avoids that by storing parent pointers. `find(x)` climbs to the root representative; path compression rewires nodes directly to that root so future finds are faster. `union(a, b)` finds both roots and attaches the shallower tree under the deeper tree using rank. With both optimizations, operations are effectively constant for interview constraints.

---

## Generic Algorithm

### DSU operations

1. Initialize `parent[i] = i` and `rank[i] = 0` for every item.
2. `find(x)`:
   1. If `parent[x] !== x`, recursively find the root.
   2. Set `parent[x]` directly to that root.
   3. Return the root.
3. `union(a, b)`:
   1. Find both roots.
   2. If roots match, return false.
   3. Attach lower-rank root under higher-rank root.
   4. If ranks tie, choose one root and increment its rank.
   5. Return true.

### Counting components

1. Start `count = n`.
2. For every edge or relationship, call `union(a, b)`.
3. If `union` returns true, decrement `count`.
4. At the end, `count` is the number of connected components.

### Cycle detection

1. For each undirected edge `(a, b)`, call `union(a, b)`.
2. If it returns false, `a` and `b` were already connected.
3. That edge creates a cycle and is the redundant edge.

---

## Implementation

### JavaScript — DSU class with path compression and rank

Use arrays when nodes are `0..n-1`. For arbitrary strings, map them to ids first.

```js
class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.count = n;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);

    if (rootA === rootB) return false;

    if (this.rank[rootA] < this.rank[rootB]) {
      const temp = rootA;
      rootA = rootB;
      rootB = temp;
    }

    this.parent[rootB] = rootA;
    if (this.rank[rootA] === this.rank[rootB]) {
      this.rank[rootA]++;
    }
    this.count--;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}
```

### JavaScript — counting components

Each successful merge reduces the component count by one.

```js
function countComponents(n, edges) {
  const dsu = new DSU(n);

  for (const [a, b] of edges) {
    dsu.union(a, b);
  }

  return dsu.count;
}
```

### JavaScript — Number of Provinces

The matrix is undirected. Union every connected pair; the DSU count is the answer.

```js
function findCircleNum(isConnected) {
  const n = isConnected.length;
  const dsu = new DSU(n);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) {
        dsu.union(i, j);
      }
    }
  }

  return dsu.count;
}
```

### JavaScript — Redundant Connection

If `union` returns false, the new edge connects nodes already in the same component.

```js
function findRedundantConnection(edges) {
  const dsu = new DSU(edges.length + 1);

  for (const [a, b] of edges) {
    if (!dsu.union(a, b)) {
      return [a, b];
    }
  }

  return [];
}
```

---

## Complexity

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| `find` with compression | Amortized near O(1) | O(n) | Technically O(α(n)), inverse Ackermann. |
| `union` by rank | Amortized near O(1) | O(n) | Dominated by two `find` calls. |
| Counting components | O((n + e) α(n)) | O(n) | e = number of edges/relationships. |
| Number of Provinces | O(n² α(n)) | O(n) | Matrix scan dominates. |
| Redundant Connection | O(e α(n)) | O(n) | First failed union identifies the cycle edge. |

---

## Common Mistakes

1. **Forgetting path compression.** A chain of parents can make `find` O(n), which ruins large tests. Assign `parent[x] = find(parent[x])`.
2. **Unioning nodes instead of roots.** Always attach `rootA` and `rootB`; setting `parent[b] = a` can corrupt existing components.
3. **Not returning a boolean from `union`.** Cycle problems need to know whether a merge actually happened.
4. **Mixing rank and size incorrectly.** Rank is tree height-ish; size is component size. Both work, but update only the one you chose.
5. **Off-by-one ids.** Redundant Connection labels nodes `1..n`, so allocate `edges.length + 1` or remap ids.
6. **Using DSU for directed reachability.** Same undirected component is not the same as "can reach" in a directed graph.

---

## Related Problems

- 🟡 **Medium** — [Number of Provinces](https://leetcode.com/problems/number-of-provinces/) — matrix connectivity becomes component counting.
- 🟡 **Medium** — [Redundant Connection](https://leetcode.com/problems/redundant-connection/) — first failed union is the cycle edge.
- 🟡 **Medium** — [Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) — direct component-counting template.
- 🟡 **Medium** — [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) — exactly one component and no failed union.
- 🟡 **Medium** — [Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) — rows/columns define components.
- 🟡 **Medium** — [Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/) — union equalities, then reject violated inequalities.
- 🔴 **Hard** — [Accounts Merge](https://leetcode.com/problems/accounts-merge/) — emails connect accounts into components.
- 🔴 **Hard** — [Number of Islands II](https://leetcode.com/problems/number-of-islands-ii/) — online grid additions with component count updates.

---

## Related Patterns

- **[Graph](./graph.md)** — DSU is an alternative to DFS/BFS when you only need connectivity, not paths.
- **[Tree](./tree.md)** — parent pointers form shallow trees; path compression flattens them over time.
- **[Greedy](./greedy.md)** — Kruskal's MST greedily considers edges by weight and uses DSU to avoid cycles.
- **[Arrays & Hashing](./arrays-hashing.md)** — map strings/emails/coordinates to numeric ids before using array-backed DSU.
