# Graph

> Explore connected nodes by DFS or BFS while tracking `visited`, so cycles do not trap you and disconnected components do not get missed.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** nodes + edges, prerequisites, connected components, shortest path in an unweighted graph, or grid neighbors.
    - **Do:** build / read adjacency, mark nodes visited when discovered, then DFS for reachability or BFS for shortest distance.
    - **Cost:** O(V + E) for adjacency lists; O(rows · cols) for grids.
    - **Watch out:** in BFS, mark visited when you push/enqueue, not when you pop/dequeue.

---

## Recognition

### Use graph traversal when you see…

- Objects connected by **edges**: roads, friendships, prerequisites, transformations, dependencies.
- You need **reachability**, **connected components**, **cycle detection**, or **shortest path in an unweighted graph**.
- The input is a **grid** and movement is allowed up/down/left/right (or 8 directions) — grids are graphs where each cell is a node.
- The graph may be disconnected, so you may need to start traversal from every node or every cell.

### Common phrases in the prompt

- "can you reach …"
- "number of connected components / islands"
- "shortest path / minimum number of steps"
- "prerequisites", "dependencies", "course schedule"
- "flood fill", "rotting", "walls and gates"

### Don't use graph traversal when…

- The structure is a simple binary tree with no cycles → [tree](./tree.md) traversal is simpler.
- You only need to answer many connectivity queries after all edges are known → **union-find** is often cleaner.
- The graph has weighted edges and asks for shortest path → BFS is not enough; use **Dijkstra** or another weighted shortest-path algorithm.

---

## Core Intuition

> Graph traversal is controlled exploration: every time you discover a node, mark it visited so each node is processed once even if many edges point back to it.

DFS dives as far as possible before backing up, which is great for components, cycle checks, and flood fill. BFS expands in rings from the start, so the first time you reach a node in an unweighted graph is the shortest number of edges from the start. Grids use the same idea; your "neighbors" are just adjacent cells that pass a bounds and validity check.

---

## Generic Algorithm

### DFS on adjacency list

```text
1. visited = empty set.
2. Define dfs(node):
     a. If node is already visited, return.
     b. Mark node visited.
     c. For each neighbor in graph[node]:
          dfs(neighbor)
3. Call dfs(start), or loop over all nodes for disconnected graphs.
```

### BFS on adjacency list (shortest path in unweighted graph)

```text
1. queue = [start]; visited = {start}; distance = 0.
2. While queue is not empty:
     a. size = queue.length
     b. Repeat size times:
          node = queue.shift()
          if node is target, return distance
          for neighbor in graph[node]:
             if neighbor not visited:
                mark neighbor visited
                queue.push(neighbor)
     c. distance += 1
3. If target was not reached, return -1.
```

### Grid neighbors

```text
1. dirs = [[0,1], [1,0], [0,-1], [-1,0]].
2. For each direction:
     a. nr = row + dr; nc = col + dc
     b. Skip if out of bounds.
     c. Skip if the cell is blocked or already visited.
     d. Visit / enqueue that cell.
```

---

## Implementation

### JavaScript — DFS on adjacency list (recursive)

```js
function dfsGraph(graph, start) {
  const visited = new Set();
  const order = [];

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);

    for (const neighbor of graph.get(node) ?? []) {
      dfs(neighbor);
    }
  }

  dfs(start);
  return order;
}
```

### JavaScript — BFS on adjacency list (unweighted shortest path)

```js
function shortestPath(graph, start, target) {
  const queue = [[start, 0]];
  const visited = new Set([start]);
  let head = 0;

  while (head < queue.length) {
    const [node, distance] = queue[head];
    head++;

    if (node === target) return distance;

    for (const neighbor of graph.get(node) ?? []) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push([neighbor, distance + 1]);
    }
  }

  return -1;
}
```

### JavaScript — DFS on a grid (Number of Islands)

```js
function numIslands(grid) {
  if (grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let islands = 0;

  function dfs(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    if (grid[row][col] !== "1") return;

    grid[row][col] = "0";

    for (const [dr, dc] of dirs) {
      dfs(row + dr, col + dc);
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === "1") {
        islands++;
        dfs(row, col);
      }
    }
  }

  return islands;
}
```

### JavaScript — BFS on a grid (Shortest Path in Binary Matrix)

```js
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (n === 0 || grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;

  const dirs = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  const queue = [[0, 0, 1]];
  let head = 0;
  grid[0][0] = 1;

  while (head < queue.length) {
    const [row, col, distance] = queue[head];
    head++;

    if (row === n - 1 && col === n - 1) return distance;

    for (const [dr, dc] of dirs) {
      const nextRow = row + dr;
      const nextCol = col + dc;

      if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n) continue;
      if (grid[nextRow][nextCol] !== 0) continue;

      grid[nextRow][nextCol] = 1;
      queue.push([nextRow, nextCol, distance + 1]);
    }
  }

  return -1;
}
```

---

## Complexity

| Variant                    | Time        | Space       | Notes |
|----------------------------|-------------|-------------|-------|
| DFS adjacency list         | O(V + E)    | O(V)        | `visited` plus recursion stack in the worst case. |
| BFS adjacency list         | O(V + E)    | O(V)        | First visit gives shortest path in an unweighted graph. |
| DFS grid flood fill        | O(r · c)    | O(r · c)    | Recursion stack can contain many cells; in-place marking saves a separate set. |
| BFS grid shortest path     | O(r · c)    | O(r · c)    | Queue can hold many frontier cells. |

---

## Common Mistakes

1. **Forgetting `visited`.** Graphs can contain cycles; without `visited`, DFS can recurse forever and BFS can loop forever.
2. **Marking visited at pop time in BFS.** That allows the same node to be enqueued by multiple parents. Mark as soon as you push it.
3. **Losing distance tracking.** For shortest-path BFS, either store `[node, distance]` in the queue or process level by level and increment after each level.
4. **Only starting from one node when the graph is disconnected.** For components / islands, loop over every node or cell and start traversal when it has not been visited.
5. **Mutating the input grid accidentally.** In-place marking is memory-efficient and common, but if the caller needs the grid later, use a `Set` or restore cells on the way out.
6. **Using BFS for weighted shortest paths.** BFS assumes every edge costs exactly 1. Weighted graphs need Dijkstra or a specialized algorithm.

---

## Related Problems

- 🟡 **Medium** — [Number of Islands](https://leetcode.com/problems/number-of-islands/) — canonical grid DFS / BFS with visited marking.
- 🟡 **Medium** — [Clone Graph](https://leetcode.com/problems/clone-graph/) — traversal plus a map from original node to copied node.
- 🟡 **Medium** — [Course Schedule](https://leetcode.com/problems/course-schedule/) — directed graph cycle detection or topological sort.
- 🟡 **Medium** — [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) — reverse DFS/BFS from both oceans and intersect reachable cells.
- 🟡 **Medium** — [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) — multi-source BFS where each level is one minute.
- 🟡 **Medium** — [Walls and Gates](https://leetcode.com/problems/walls-and-gates/) — multi-source BFS from all gates to fill nearest distances.
- 🟡 **Medium** — [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) — grid BFS with 8 directions and per-node distance.
- 🔴 **Hard** — [Word Ladder](https://leetcode.com/problems/word-ladder/) — shortest transformation sequence; BFS plus efficient neighbor generation.

---

## Related Patterns

- **[Tree](./tree.md)** — trees are graphs without cycles, so you can often drop `visited` and use simpler recursion.
- **[Union Find](./union-find.md)** — alternative for connectivity / components when edges are added and you do not need traversal order.
- **[Backtracking](./backtracking.md)** — DFS with an explicit un-mark step when each path has its own state.
