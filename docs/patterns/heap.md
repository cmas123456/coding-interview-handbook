# Heap

> Use a priority queue when you only need the current smallest or largest item from a stream, not a fully sorted array.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** kth largest/smallest, top K, merge K sorted streams, scheduling by priority, or streaming min/max.
    - **Do:** maintain a heap with the item you need next at the root; for Top K, keep heap size K.
    - **Cost:** O(log n) per push/pop, O(1) peek; Top K is O(n log k).
    - **Watch out:** JavaScript has **no built-in priority queue** — be ready to write a small `MinHeap` class.

---

## Recognition

### Use this pattern when you see…

- You need the **smallest / largest** item repeatedly, but not the entire sorted order.
- The prompt asks for **kth largest**, **top K**, **K closest**, or **merge K sorted** inputs.
- Data arrives as a **stream**, and sorting everything each time is too slow.
- You can keep only a partial candidate set of size `k` instead of all `n` values.

### Common phrases in the prompt

- "kth largest / kth smallest"
- "top k frequent"
- "merge k sorted lists"
- "find median from data stream"
- "closest points"
- "task with highest priority / earliest time"

### Don't use this pattern when…

- You need a one-time full ordering → just **sort**; it's simpler and often accepted.
- You only need O(1) lookup by key → use a **Map** / **Set**.
- The data is already sorted and you're scanning from both ends → use [two pointers](./two-pointers.md).

---

## Core Intuition

> A heap is a partially sorted tree: it refuses to sort everything, but always keeps the next most important item at index 0.

Sorting spends O(n log n) to order every element, even when you only need one element or K winners. A heap pays O(log n) only when the candidate set changes. For Top K problems, the crucial move is keeping a heap of size `k`: the root is the weakest current winner, so any better candidate can replace it while worse candidates are ignored.

---

## Generic Algorithm

### Min-heap mechanics

```text
1. Store heap items in an array.
2. push(value): append value, then sift it up while it is smaller than its parent.
3. pop(): remove root, move last item to root, then sift it down with the smaller child.
4. peek(): return array[0] without removing it.
```

### Top K with a min-heap of size K

```text
1. Initialize an empty min-heap.
2. For each candidate:
     a. Push candidate.
     b. If heap size exceeds K, pop the smallest candidate.
3. The heap contains the K largest candidates.
4. The root is the kth largest.
```

### Merge K sorted streams

```text
1. Push the first item from each sorted stream into a min-heap.
2. While heap is not empty:
     a. Pop the smallest current item.
     b. Append it to the answer.
     c. Push that item's successor from the same stream, if any.
3. Return the merged answer.
```

---

## Implementation

### JavaScript — minimal MinHeap class

JavaScript has no built-in heap; this is the version you should be able to write in an interview:

```js
class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.data = [];
    this.compare = compare;
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    this.data.push(value);
    this._siftUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return undefined;
    const root = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return root;
  }

  _siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.data[parent], this.data[i]) <= 0) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  _siftDown(i) {
    const n = this.data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right;
      if (smallest === i) break;

      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}
```

### JavaScript — kth largest element

Keep only the K largest seen so far; the smallest of those K is the answer:

```js
function findKthLargest(nums, k) {
  const heap = new MinHeap();

  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) heap.pop();
  }

  return heap.peek();
}
```

### JavaScript — merge k sorted linked lists

The heap stores list nodes by `node.val`, then pushes the successor from the same list:

```js
function mergeKLists(lists) {
  const heap = new MinHeap((a, b) => a.val - b.val);

  for (const head of lists) {
    if (head) heap.push(head);
  }

  const dummy = { next: null };
  let tail = dummy;

  while (heap.size() > 0) {
    const node = heap.pop();
    tail.next = node;
    tail = tail.next;
    if (node.next) heap.push(node.next);
  }

  tail.next = null;
  return dummy.next;
}
```

### JavaScript — top K frequent elements

Count first, then keep a min-heap of the K strongest frequencies:

```js
function topKFrequent(nums, k) {
  const counts = new Map();
  for (const num of nums) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  const heap = new MinHeap((a, b) => a.count - b.count);
  for (const [num, count] of counts) {
    heap.push({ num, count });
    if (heap.size() > k) heap.pop();
  }

  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop().num);
  }
  return result.reverse();
}
```

---

## Complexity

| Variant                  | Time | Space | Notes |
|--------------------------|------|-------|-------|
| MinHeap push / pop       | O(log n) | O(n) | `peek()` is O(1); heap storage is array-backed. |
| Kth largest              | O(n log k) | O(k) | Maintains the heap-size-K invariant. |
| Merge k sorted lists     | O(n log k) | O(k) | n = total nodes; heap holds at most one node per list. |
| Top K frequent elements  | O(n log k) | O(n + k) | Counting map is O(n); selection heap is O(k). |

---

## Common Mistakes

1. **Assuming JavaScript has a priority queue.** It doesn't. In interviews, either write a `MinHeap` like above or clearly ask if a helper is provided.
2. **Sorting after every insertion.** `arr.push(x); arr.sort(...)` inside a loop is not a heap; it turns Top K into repeated O(n log n) work.
3. **Forgetting the heap-size-K invariant.** If you push all values for kth largest, you did O(n log n) work instead of O(n log k). Pop whenever `heap.size() > k`.
4. **Using the wrong heap direction.** Kth largest uses a **min-heap** of winners; kth smallest uses a max-heap or the negate-values trick (`heap.push(-num)`).
5. **Comparing objects without a comparator.** For Merge K Lists, `a - b` on nodes is `NaN`; compare `a.val - b.val`.
6. **Returning heap order as sorted order.** The internal array is only partially ordered. Pop repeatedly if you need sorted output.

---

## Related Problems

- 🟢 **Easy** — [Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) — repeatedly take the two largest values; use a max-heap or negated min-heap.
- 🟡 **Medium** — [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) — canonical heap-size-K problem.
- 🟡 **Medium** — [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) — hash map for counts plus heap for selection.
- 🟡 **Medium** — [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/) — keep the K smallest distances, often via max-heap or negated comparator.
- 🟡 **Medium** — [Task Scheduler](https://leetcode.com/problems/task-scheduler/) — priority by remaining frequency, with cooldown bookkeeping.
- 🔴 **Hard** — [Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) — heap holds one current node from each list.
- 🔴 **Hard** — [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) — two heaps: max-heap for lower half, min-heap for upper half.

---

## Related Patterns

- **[Arrays & Hashing](./arrays-hashing.md)** — Top K Frequent starts with a frequency `Map`, then uses a heap to select winners.
- **[Linked List](./linked-list.md)** — Merge K Sorted Lists combines linked-list node manipulation with heap selection.
- **[Two Pointers](./two-pointers.md)** — if inputs are already sorted and you only need pair movement, two pointers may avoid heap overhead.