# Intervals

> Sort intervals by start time, then make a single sweep that compares each interval to the running "current" one — the whole class of interval problems collapses to **O(n log n)**.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** input is a list of `[start, end]` pairs and you're asked to merge, count overlaps, find a free slot, or insert a new interval.
    - **Do:** sort by start; iterate once; for each interval either **extend** the current (`end = max(end, cur[1])`) or **emit + reset** (push current, start a new one).
    - **Cost:** O(n log n) time (the sort dominates), O(n) space for the output.
    - **Watch out:** half-open vs closed intervals (`[1,3]` and `[3,5]` — do they overlap?). Re-read the problem. Cost you 10 minutes if you assume wrong.

---

## Recognition

### Use intervals when you see…

- Input is a list of pairs `[start, end]` (or `{start, end}`).
- The question involves **overlap**, **merging**, **insertion**, **gaps**, or **scheduling**.
- "Minimum number of …" (meeting rooms, arrows to burst balloons) — usually a sweep over sorted intervals.

### Common phrases in the prompt

- "merge overlapping intervals"
- "insert and merge"
- "minimum number of meeting rooms"
- "non-overlapping intervals to remove"
- "can a person attend all meetings"
- "free time" / "available slots"

### Don't use this pattern when…

- The "intervals" are actually a 1D array with a contiguous-range question → use [sliding window](./sliding-window.md) or [prefix sum](./prefix-sum.md).
- You need to query "is point X covered" many times over a static set → use a segment tree or sorted boundary array (beyond scope here).

---

## Core Intuition

> After sorting by start time, two intervals overlap **iff the next one starts before the current one ends**. That's the only check you need — no nested loop.

The brute force compares every pair: O(n²). Sorting makes the comparison "transitive in time" — once you've passed an interval, you never need to look back at it. One linear sweep does the rest.

For "minimum rooms" / "max overlaps at any time" problems, the trick is different: separate the starts and ends into two sorted arrays and sweep both simultaneously, incrementing a counter on start and decrementing on end. The peak counter value is the answer. (This is sometimes called a **sweep line**.)

---

## Generic Algorithm

### Merge / overlap-style problems

```text
1. Sort intervals by start ascending.
2. result = [intervals[0]]
3. For each interval i in intervals[1..]:
     a. last = result[result.length - 1]
     b. If i.start <= last.end:       // overlap
          last.end = max(last.end, i.end)
        Else:                          // disjoint
          result.push(i)
4. Return result.
```

### Sweep line / counting problems

```text
1. starts = sorted list of all start times
2. ends   = sorted list of all end times
3. rooms = 0; maxRooms = 0; s = 0; e = 0
4. While s < n:
     If starts[s] < ends[e]:
        rooms += 1; maxRooms = max(maxRooms, rooms); s += 1
     Else:
        rooms -= 1; e += 1
5. Return maxRooms.
```

---

## Implementation

### JavaScript — merge intervals

```js
function merge(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = intervals[i];

    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}
```

### JavaScript — insert interval (already-sorted input)

```js
function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  const n = intervals.length;

  // Intervals strictly before newInterval — copy as-is.
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }

  // Overlapping — merge into newInterval.
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  // Intervals strictly after — copy as-is.
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }
  return result;
}
```

### JavaScript — meeting rooms II (min rooms needed = max concurrent meetings)

```js
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  const starts = intervals.map((x) => x[0]).sort((a, b) => a - b);
  const ends   = intervals.map((x) => x[1]).sort((a, b) => a - b);

  let rooms = 0;
  let maxRooms = 0;
  let e = 0;

  for (let s = 0; s < starts.length; s++) {
    if (starts[s] < ends[e]) {
      rooms++;
      maxRooms = Math.max(maxRooms, rooms);
    } else {
      e++;
    }
  }
  return maxRooms;
}
```

### JavaScript — non-overlapping intervals (greedy: keep the one ending earliest)

```js
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  // Sort by END time — greedy choice.
  intervals.sort((a, b) => a[1] - b[1]);

  let kept = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) {
      kept++;
      lastEnd = intervals[i][1];
    }
  }
  return intervals.length - kept;
}
```

---

## Complexity

| Variant                  | Time        | Space | Notes |
|--------------------------|-------------|-------|-------|
| Merge / insert / overlap | O(n log n)  | O(n)  | Sort dominates; the sweep is O(n). |
| Sweep line (min rooms)   | O(n log n)  | O(n)  | Two sorts, two-pointer sweep. |
| Non-overlapping (greedy) | O(n log n)  | O(1)  | Sort by **end time**, not start. |

---

## Common Mistakes

1. **Sorting by the wrong field.** Merge problems sort by **start**. The "max non-overlapping intervals" greedy sorts by **end**. Pick wrong and your answer is silently incorrect on adversarial inputs.
2. **Confusing closed vs half-open intervals.** If the problem says intervals are `[start, end)` (end exclusive), `[1,3]` and `[3,5]` do **not** overlap. If they're closed (`[start, end]`), they do. Use `<` vs `<=` accordingly — read the problem twice.
3. **Mutating `last` without realizing it mutates the input.** In the merge code above, `result.push(intervals[i])` shares a reference. If the caller still holds the original array, you've mutated their data. Push `[start, end]` (a copy) if that matters.
4. **Using a min-heap for meeting rooms when the two-pointer sweep is enough.** Both are O(n log n), but the sweep is simpler and harder to get wrong. Save the heap for when you actually need to track which room frees up next.
5. **Not handling empty input.** `intervals.sort()` on `[]` is fine, but `result[0]` afterwards isn't. Always early-return on empty.
6. **Forgetting that "insert into sorted intervals" doesn't need a sort.** If the input is already sorted, the three-phase walk (before / overlapping / after) is O(n), not O(n log n). Don't waste the sort.

---

## Related Problems

- 🟢 **Easy** — [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) — sort and check adjacent pairs for any overlap.
- 🟡 **Medium** — [Merge Intervals](https://leetcode.com/problems/merge-intervals/) — the canonical sort-then-sweep.
- 🟡 **Medium** — [Insert Interval](https://leetcode.com/problems/insert-interval/) — three-phase walk with no sort needed.
- 🟡 **Medium** — [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) — greedy by end time.
- 🟡 **Medium** — [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) — two-pointer sweep line.
- 🟡 **Medium** — [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) — non-overlap greedy in disguise.
- 🔴 **Hard** — [Employee Free Time](https://leetcode.com/problems/employee-free-time/) — merge across multiple sorted lists, then find gaps.

---

## Related Patterns

- **[Sliding Window](./sliding-window.md)** — when "intervals" are really contiguous subarrays of a 1D array. The interval pattern is for *given* `[start, end]` pairs, not for ranges you derive yourself.
- **[Heap](./heap.md)** — alternative for meeting-rooms-style problems: push end times onto a min-heap, pop when free. Same complexity as the two-pointer sweep but more flexible if you need to track per-room state.
- **[Greedy](./greedy.md)** — the non-overlapping-intervals solution is a textbook greedy: "always pick the option that ends earliest." Recognize the pattern.
- **[Two Pointers](./two-pointers.md)** — the sweep line in meeting-rooms II is literally two pointers walking the sorted start and end arrays.
