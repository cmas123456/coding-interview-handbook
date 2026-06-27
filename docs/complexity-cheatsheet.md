# Big-O Cheat Sheet

> Quick reference for JavaScript operations and common pattern complexities. Keep this open in a tab during practice.

---

## JavaScript built-ins

### Array

| Operation | Time | Notes |
|---|---|---|
| `arr[i]` read/write | O(1) | |
| `arr.push(x)` / `arr.pop()` | O(1) amortized | |
| `arr.shift()` / `arr.unshift(x)` | **O(n)** | Reindexes the whole array. **Don't use in hot loops.** |
| `arr.slice(a, b)` | O(b − a) | Returns a copy. |
| `arr.splice(i, n, …)` | O(n) | Reindexes. |
| `arr.indexOf(x)` / `arr.includes(x)` | O(n) | Linear scan. |
| `arr.find(fn)` / `arr.some(fn)` | O(n) | |
| `arr.sort()` | O(n log n) | Default is lexicographic — pass a comparator for numbers. |
| `arr.reverse()` | O(n) | In place. |
| `arr.concat(b)` | O(n + m) | Returns a copy. |
| `[...a, ...b]` (spread) | O(n + m) | |

### Map / Set

| Operation | Time |
|---|---|
| `map.get(k)` / `map.has(k)` / `map.set(k, v)` / `map.delete(k)` | O(1) average |
| `set.add(x)` / `set.has(x)` / `set.delete(x)` | O(1) average |
| `map.size` / `set.size` | O(1) |
| Iteration `for…of` | O(n) — preserves insertion order |

### Object (used as hashmap)

| Operation | Time |
|---|---|
| `obj[k]` read/write/delete | O(1) average |
| `Object.keys(obj)` / `Object.values(obj)` / `Object.entries(obj)` | O(n) |

Prefer `Map` over `Object` when keys aren't strings, or when you need ordered iteration / a `size` count.

### String

| Operation | Time |
|---|---|
| `s[i]` / `s.charAt(i)` | O(1) |
| `s.slice(a, b)` / `s.substring(a, b)` | O(b − a) |
| `s.indexOf(t)` / `s.includes(t)` | O(n · m) worst-case |
| `s.split(sep)` | O(n) |
| `arr.join(sep)` | O(n) |
| `s1 + s2` | O(n + m) — strings are immutable, builds new string |

Building a string in a loop? Push chars to an array and `join('')` at the end.

---

## Pattern complexities at a glance

| Pattern | Typical Time | Typical Space |
|---|---|---|
| [Arrays & Hashing](patterns/arrays-hashing.md) | O(n) | O(n) |
| [Two Pointers](patterns/two-pointers.md) | O(n) | O(1) |
| [Sliding Window](patterns/sliding-window.md) | O(n) | O(k) for window state |
| [Prefix Sum](patterns/prefix-sum.md) | O(n) build, O(1) query | O(n) |
| [Binary Search](patterns/binary-search.md) | O(log n) | O(1) |
| [Linked Lists](patterns/linked-list.md) | O(n) | O(1) iterative |
| [Stack](patterns/stack.md) | O(n) | O(n) worst |
| [Monotonic Stack](patterns/monotonic-stack.md) | O(n) amortized | O(n) |
| [Queue](patterns/queue.md) | O(n) | O(n) |
| [Heap](patterns/heap.md) | O(n log k) for top-k | O(k) |
| [Intervals](patterns/intervals.md) | O(n log n) (sort dominates) | O(n) |
| [Trees](patterns/tree.md) | O(n) | O(h) — h = height |
| [Trie](patterns/trie.md) | O(L) per op — L = word length | O(total chars) |
| [Graphs](patterns/graph.md) BFS/DFS | O(V + E) | O(V) |
| [Union Find](patterns/union-find.md) | ~O(α(n)) per op (≈ O(1)) | O(n) |
| [Backtracking](patterns/backtracking.md) | O(branching ^ depth) | O(depth) recursion |
| [Greedy](patterns/greedy.md) | O(n log n) (sort) or O(n) | O(1) |
| [DP I](patterns/dp-1d.md) | O(n · k) — k = states per step | O(n), often O(1) optimized |
| [DP II](patterns/dp-2d.md) | O(n · m) | O(n · m), often O(min(n, m)) optimized |
| [Bit Manipulation](patterns/bit-manipulation.md) | O(1) per op, O(n) per scan | O(1) |

---

## The complexity ladder (memorize this)

For an interview prompt with **n** up to roughly 10⁵, anything O(n²) or worse will time out. Use this to backwards-engineer the target complexity:

| n (input size) | Target complexity |
|---|---|
| ≤ 10 | O(n!) — full permutations OK |
| ≤ 20 | O(2ⁿ) — subsets / bitmask DP OK |
| ≤ 500 | O(n³) — triple nested loop OK |
| ≤ 5,000 | O(n²) — pair scan OK |
| ≤ 10⁶ | O(n log n) — sort or heap |
| ≤ 10⁸ | O(n) or O(log n) only |

If n is 10⁵ and you wrote O(n²), you need to remove a loop — usually via hashing, two pointers, sliding window, prefix sum, or DP.

---

## Space-complexity reminders

- **Recursion** costs O(depth) on the call stack — for a balanced tree that's O(log n), for a linked-list-shaped tree it's O(n).
- **DP** can almost always be space-optimized one dimension down (1D dp → two variables; 2D dp → two rows). Mention this verbally even if you don't implement it.
- **In-place** algorithms (two-pointer read/write, reverse, sort) are O(1) extra space — interviewers love this.
- **Returning** an array of size n is O(n) output space but conventionally NOT counted as auxiliary space.

---

## Related

- [Pattern Recognition](pattern-recognition.md) — pick the right pattern, then look up its cost here.
