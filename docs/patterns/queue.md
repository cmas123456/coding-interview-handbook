# FIFO + Deque + Sliding-Window-Max

> Use a queue when work must be processed in arrival order, and use a deque when a moving window needs efficient access to both ends.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** process in order, BFS levels, sliding window maximum/minimum, cooldown scheduling.
    - **Do:** avoid `shift()`; use a head index for FIFO or a deque of indices for window extrema.
    - **Cost:** O(1) amortized enqueue/dequeue; O(n) for monotonic deque window scans.
    - **Watch out:** JavaScript arrays have no O(1) `shift()`; never use `shift()` in a hot loop.

---

## Recognition

### Use queue when you see…

- Items must be processed **first-in, first-out**: earliest request, earliest node, earliest event.
- The prompt asks for **BFS level traversal** or shortest path by number of edges in an unweighted graph.
- A stream/window needs efficient access to the **front and back**, especially max/min per sliding window.
- Scheduling problems mention tasks waiting for cooldown, timestamps, or recent calls.

### Common phrases in the prompt

- "process in order"
- "BFS" / "level order traversal"
- "sliding window maximum" / "sliding window minimum"
- "recent calls in the last 3000 ms"
- "task scheduling with cooldown"

### Don't use queue when…

- You need last-in-first-out behavior → use [stack](./stack.md).
- You need the smallest/largest priority item, not the oldest item → use [heap](./heap.md).
- The window only needs a sum/count and never needs max/min → plain [sliding window](./sliding-window.md) is enough.

---

## Core Intuition

> A queue preserves arrival order; a deque preserves both arrival order and the ability to discard useless candidates from the back.

Plain FIFO is the right mental model for BFS: nodes discovered earlier are processed earlier, which gives level order and shortest unweighted distance. In JavaScript, the critical implementation detail is that `arr.shift()` is O(n) because every remaining element moves left. Use an array plus a `head` index instead.

For sliding-window maximum, the deque stores indices in decreasing value order. The front is always the best candidate. When a new value enters, smaller values at the back can never become maximum while the new value remains in the window, so you remove them immediately.

---

## Generic Algorithm

### Plain queue with head index

1. Initialize `queue = []` and `head = 0`.
2. Enqueue with `queue.push(value)`.
3. Dequeue by reading `queue[head]`, then incrementing `head`.
4. The queue is non-empty while `head < queue.length`.
5. Optionally compact if `head` becomes very large, but do not do that inside every loop.

### Monotonic deque for sliding window maximum

1. Keep a deque of indices, not values.
2. Before adding index `right`, pop from the back while the new value is greater than or equal to the back value.
3. Push `right`.
4. Pop from the front while it is outside the current window.
5. Once the first full window is formed, the front index is the maximum.

### BFS skeleton

1. Push the start node(s) into the queue and mark them visited immediately.
2. While the queue is non-empty, process all nodes currently in the queue level if levels matter.
3. For each neighbor, if unvisited, mark and enqueue it.
4. Stop when the target is found or the queue is exhausted.

---

## Implementation

### JavaScript — plain queue via head-index trick

This is the safe interview default. It keeps dequeue O(1) without writing a full data structure.

```js
function processInOrder(items) {
  const queue = [];
  let head = 0;
  const result = [];

  for (const item of items) {
    queue.push(item);
  }

  while (head < queue.length) {
    const current = queue[head];
    head++;
    result.push(current);
  }

  return result;
}
```

### JavaScript — deque for sliding window maximum

The deque stores indices. It pops old indices from the front and weaker candidates from the back.

```js
function maxSlidingWindow(nums, k) {
  const deque = [];
  let head = 0;
  const result = [];

  for (let right = 0; right < nums.length; right++) {
    while (head < deque.length && deque[head] <= right - k) {
      head++;
    }

    while (head < deque.length && nums[right] >= nums[deque[deque.length - 1]]) {
      deque.pop();
    }

    deque.push(right);

    if (right >= k - 1) {
      result.push(nums[deque[head]]);
    }
  }

  return result;
}
```

### JavaScript — BFS skeleton

Graph and tree pages cover BFS in detail; this is the queue shape you should reuse.

```js
function bfs(start, getNeighbors) {
  const queue = [start];
  const seen = new Set([start]);
  let head = 0;

  while (head < queue.length) {
    const node = queue[head];
    head++;

    for (const next of getNeighbors(node)) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }

  return seen.size;
}
```

---

## Complexity

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| Head-index queue | O(n) | O(n) | Enqueue/dequeue are O(1); array may retain processed slots. |
| Circular buffer | O(n) | O(n) | Same asymptotics with bounded reusable storage. |
| Queue using two stacks | O(n) | O(n) | Each item moves between stacks at most once; amortized O(1). |
| Sliding window maximum deque | O(n) | O(k) | Each index enters and leaves the deque at most once. |
| BFS | O(V + E) | O(V) | Queue holds frontier nodes; `seen` prevents repeats. |

---

## Common Mistakes

1. **Using `arr.shift()` in a hot loop.** It is O(n) per call in JavaScript, so BFS can degrade from O(V + E) to O(V²). Use a head index.
2. **Storing values instead of indices in a window deque.** You need indices to know when an item leaves the window; duplicate values make value-only deques ambiguous.
3. **Only popping from one end for window max.** You must pop expired indices from the front and weaker candidates from the back.
4. **Marking BFS nodes when dequeued instead of enqueued.** The same node can be enqueued many times by different parents. Mark as soon as you push.
5. **Forgetting level boundaries.** For level-order traversal, capture `const levelSize = queue.length - head` before processing that level.
6. **Letting the head-index array grow forever in production code.** In interviews it is fine; in long-lived systems, compact occasionally or use a circular buffer.

---

## Related Problems

- 🟢 **Easy** — [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) — shows FIFO behavior built from LIFO primitives.
- 🟢 **Easy** — [Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/) — queue of timestamps, drop anything too old.
- 🟢 **Easy** — [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream/) — fixed-size queue with running sum.
- 🟡 **Medium** — [Design Circular Queue](https://leetcode.com/problems/design-circular-queue/) — explicit bounded buffer implementation.
- 🟡 **Medium** — [Task Scheduler](https://leetcode.com/problems/task-scheduler/) — cooldown queues often pair with frequency tracking or heaps.
- 🟡 **Medium** — [First Unique Character in a Stream](https://leetcode.com/problems/first-unique-number/) — stream-unique queue pattern; stale candidates are removed from the front.
- 🔴 **Hard** — [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) — canonical monotonic deque of indices.
- 🔴 **Hard** — [Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) — monotonic deque over prefix sums.

---

## Related Patterns

- **[Stack](./stack.md)** — queues are FIFO; stacks are LIFO. Implement Queue using Stacks bridges the two.
- **[Sliding Window](./sliding-window.md)** — a deque upgrades a window when you need max/min, not just sum/count.
- **[Monotonic Stack](./monotonic-stack.md)** — sliding-window max is the deque cousin: same monotonic idea, but old indices expire from the front.
- **[Tree](./tree.md)** — level-order traversal is BFS with a queue.
- **[Graph](./graph.md)** — unweighted shortest path and component traversal commonly use a queue.
- **[Heap](./heap.md)** — use a heap instead when processing order is priority-based rather than arrival-based.
