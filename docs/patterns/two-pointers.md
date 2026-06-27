# Two Pointers

> Use two indices moving through the same (often sorted) array to find pairs, triplets, or partitions in **O(n)** instead of the O(n²) brute force.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** sorted array + "find a pair / triplet" OR in-place rearrange OR palindrome / mirror check.
    - **Do:** start pointers at the ends (or both at 0); move the one whose side is wrong; repeat until they cross.
    - **Cost:** O(n) after sorting (so O(n log n) total if you sort), O(1) space.
    - **Watch out:** skip duplicates explicitly when the problem says "unique triplets"; otherwise you'll return the same answer twice.

---

## Recognition

### Use two pointers when you see…

- A **sorted** array (or one you can sort) and a question about a **pair / triplet** that hits a target.
- An **in-place** rearrangement: move zeros, partition, dedupe sorted array, reverse.
- **Symmetry / palindrome / mirror** checks — one pointer at each end, move toward the middle.
- Merging two sorted sequences (each list gets its own pointer).
- A problem that screams O(n²) but the constraints (`n >= 10^4`) say "no."

### Common phrases in the prompt

- "two numbers / three numbers that sum to …"
- "in place, do not allocate extra space"
- "palindrome", "reverse", "mirror"
- "merge two sorted arrays / lists"
- "remove duplicates from a sorted array"

### Don't use two pointers when…

- The array isn't sorted and sorting would destroy the answer (e.g. you need original indices → use a **hash map** instead, like Two Sum on an unsorted array).
- The subset must be **contiguous** → that's [sliding window](./sliding-window.md), not two pointers.
- You need arbitrary range queries → **prefix sum**.

---

## Core Intuition

> If the array is sorted, the answer to "is there a pair summing to X" is decidable in one pass: too small → move left pointer right; too big → move right pointer left. Each move eliminates a whole row/column of the n² search space.

The brute force checks every `(i, j)` pair — O(n²) cells. Two pointers walks a single diagonal path through that grid, visiting each row and column at most once: O(n).

The three canonical shapes:

1. **Opposite ends, converging** — sorted array, target sum, palindrome.
2. **Same start, different speeds** — fast/slow on a linked list (cycle detection, find middle).
3. **Same start, both forward** — read/write pointers for in-place rewrites.

---

## Generic Algorithm

### Opposite ends (converging)

```text
1. Sort if needed.
2. left = 0; right = n - 1.
3. While left < right:
     a. Compute the current value (sum / comparison / etc.).
     b. If too small, left += 1.
     c. Else if too big, right -= 1.
     d. Else record answer and advance both (skipping duplicates if needed).
4. Return answer.
```

### Fast / slow (linked list)

```text
1. slow = head; fast = head.
2. While fast and fast.next:
     slow = slow.next
     fast = fast.next.next
3. (At end: slow is at the middle. If fast == slow ever, there's a cycle.)
```

### Read / write (in-place)

```text
1. write = 0.
2. For read = 0 .. n - 1:
     If arr[read] should be kept:
       arr[write] = arr[read]
       write += 1
3. Return write (= new length).
```

---

## Implementation

### JavaScript — opposite ends (Two Sum on sorted array)

```js
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}
```

### JavaScript — 3Sum (opposite ends + outer loop, dedupe carefully)

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicate anchor

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
```

### JavaScript — palindrome check (opposite ends, ignore non-alphanumeric)

```js
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !isAlnum(s[left])) left++;
    while (left < right && !isAlnum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

function isAlnum(c) {
  return /[a-zA-Z0-9]/.test(c);
}
```

### JavaScript — fast/slow (linked list cycle detection)

```js
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

### JavaScript — read/write (remove duplicates from sorted array, in place)

```js
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}
```

---

## Complexity

| Variant                       | Time        | Space | Notes |
|-------------------------------|-------------|-------|-------|
| Opposite ends on sorted array | O(n)        | O(1)  | Plus O(n log n) if you have to sort first. |
| 3Sum                          | O(n²)       | O(1)  | Outer loop × inner two-pointer pass. |
| Fast / slow (linked list)     | O(n)        | O(1)  | Floyd's cycle algorithm — no hash set. |
| Read / write (in place)       | O(n)        | O(1)  | Single pass, no allocation. |

---

## Common Mistakes

1. **Forgetting to sort first.** Two pointers on an unsorted array is just wrong — the elimination logic depends on order. If the problem requires *original* indices, sorting is off the table; use a hash map instead.
2. **Wrong loop condition.** Use `while (left < right)` for "find a pair" (you don't want `left === right`, that's the same element twice). Use `while (left <= right)` only if a single-element window makes sense.
3. **Not dedup-ing triplets.** After finding one valid `(i, left, right)`, advance past *all* equal values on both sides, not just one. Otherwise `[0,0,0,0]` returns `[0,0,0]` twice.
4. **Off-by-one on read/write.** The return value is `write` (the new length), not `write - 1`. After the loop, indices `0..write-1` are the kept elements.
5. **Fast pointer null check.** For fast/slow, you must check **both `fast` and `fast.next`** before doing `fast.next.next`, or you'll dereference null on even-length lists.
6. **Modifying the array while iterating with two pointers from opposite ends.** Easy to invalidate one of the pointers. If you must mutate, use the read/write variant instead.

---

## Related Problems

- 🟢 **Easy** — [Two Sum II — Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) — the canonical opposite-ends case.
- 🟢 **Easy** — [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) — opposite ends + skip non-alphanumeric.
- 🟢 **Easy** — [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) — read/write template.
- 🟢 **Easy** — [Move Zeroes](https://leetcode.com/problems/move-zeroes/) — read/write with a twist.
- 🟡 **Medium** — [3Sum](https://leetcode.com/problems/3sum/) — outer loop + two pointers + dedupe. Must-know.
- 🟡 **Medium** — [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) — opposite ends, move the *shorter* side. Greedy logic is the trick.
- 🟡 **Medium** — [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) — Floyd's algorithm; find the cycle's start.
- 🔴 **Hard** — [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) — opposite ends, track max-so-far on each side.

---

## Related Patterns

- **[Sliding Window](./sliding-window.md)** — both pointers move forward, but constrained to a contiguous range with an invariant. Two pointers on a sorted array is the more general shape.
- **[Binary Search](./binary-search.md)** — also exploits sorting, but jumps in halves instead of crawling from the ends. Reach for binary search when you need O(log n) lookup, not pair-finding.
- **[Arrays & Hashing](./arrays-hashing.md)** — the alternative when the array isn't sorted and you need original indices. Trade O(1) space for O(n) space to keep O(n) time.
- **[Linked List](./linked-list.md)** — fast/slow is the linked-list specialization of two pointers (cycle detection, find middle, find nth from end).
