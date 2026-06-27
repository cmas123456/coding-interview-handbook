# Linked List

> Manipulate nodes by rewiring `next` pointers directly, using dummy heads and fast/slow pointers to avoid extra arrays and special cases.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** nodes with `next`, head may change, cycle/middle/nth-from-end, or merge sorted lists.
    - **Do:** keep the next node before rewiring; use a dummy head when building/removing; use fast/slow for distance.
    - **Cost:** usually O(n) time, O(1) space.
    - **Watch out:** save `next = curr.next` before `curr.next = prev`, or you lose the rest of the list.

---

## Recognition

### Use this pattern when you see…

- The input is a **linked list node** (`head`) instead of an array.
- The answer requires **changing links**, not just reading values.
- The head might be removed, replaced, or produced by merging nodes.
- You need the **middle**, **cycle**, or **nth node from the end** without knowing the length first.

### Common phrases in the prompt

- "reverse a linked list"
- "merge two sorted lists"
- "detect a cycle"
- "remove the nth node from the end"
- "do it in O(1) extra space"

### Don't use this pattern when…

- Random access by index matters → arrays are better; linked lists make `list[i]` impossible without walking.
- You only need membership or duplicate detection → a **Set** is simpler unless O(1) space is required.
- The problem is really about sorted pair sums → use [two pointers](./two-pointers.md) on an array, not linked-list pointer rewiring.

---

## Core Intuition

> In a linked list, the structure is the pointers; once you can safely preserve the next node before changing a link, most problems become a small pointer dance.

Arrays make movement easy because indices remain stable. Linked lists make mutation cheap because changing one `next` pointer can insert, remove, reverse, or merge nodes in O(1). The tradeoff is that you must be disciplined: name each pointer's job, preserve references before rewiring, and use a dummy node whenever the real head might change.

---

## Generic Algorithm

### Reverse links

```text
1. prev = null; curr = head.
2. While curr is not null:
     a. next = curr.next        (save the rest)
     b. curr.next = prev        (reverse current link)
     c. prev = curr             (advance reversed side)
     d. curr = next             (advance unreversed side)
3. Return prev as the new head.
```

### Dummy head for building / removing

```text
1. dummy.next = head or null.
2. tail = dummy (for building) OR pointers start at dummy (for removing).
3. Rewire tail.next / prev.next instead of special-casing the real head.
4. Return dummy.next.
```

### Fast / slow pointers

```text
1. slow = head; fast = head.
2. Move fast more quickly than slow.
3. When fast hits the end, slow is at the desired offset.
4. If fast ever meets slow again, there is a cycle.
```

---

## Implementation

### JavaScript — reverse a linked list

Minimal node definition plus the three-pointer reversal:

```js
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}
```

### JavaScript — merge two sorted lists

Dummy head means you don't care which list provides the first node:

```js
function mergeTwoLists(list1, list2) {
  const dummy = { next: null };
  let tail = dummy;
  let left = list1;
  let right = list2;

  while (left && right) {
    if (left.val <= right.val) {
      tail.next = left;
      left = left.next;
    } else {
      tail.next = right;
      right = right.next;
    }
    tail = tail.next;
  }

  tail.next = left || right;
  return dummy.next;
}
```

### JavaScript — detect cycle and find cycle start

Floyd's algorithm: first find a meeting point, then reset one pointer to `head`:

```js
function detectCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let fromHead = head;
      let fromMeet = slow;
      while (fromHead !== fromMeet) {
        fromHead = fromHead.next;
        fromMeet = fromMeet.next;
      }
      return fromHead;
    }
  }

  return null;
}
```

### JavaScript — remove nth node from end

Create a gap of `n + 1` from dummy to fast, so slow lands before the node to remove:

```js
function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy;
  let slow = dummy;

  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }

  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next.next;
  return dummy.next;
}
```

---

## Complexity

| Variant                    | Time | Space | Notes |
|----------------------------|------|-------|-------|
| Reverse linked list        | O(n) | O(1)  | Each node's `next` pointer is changed once. |
| Merge two sorted lists     | O(n + m) | O(1) | Reuses existing nodes; dummy node is constant space. |
| Detect cycle + cycle start | O(n) | O(1)  | Floyd's algorithm avoids a hash set. |
| Remove nth from end        | O(n) | O(1)  | One pass after creating the fast/slow gap. |

---

## Common Mistakes

1. **Losing the rest of the list while reversing.** If you do `curr.next = prev` before saving `const next = curr.next`, you can no longer reach the unreversed suffix.
2. **Skipping the dummy head when the head can change.** Removing the first node or merging into an empty result becomes a special-case mess. Use `dummy.next` and return it.
3. **Off-by-one on nth-from-end gap.** For removal, advance `fast` `n + 1` steps from the dummy so `slow` stops on the node before the one to delete.
4. **Dereferencing `fast.next.next` too early.** In cycle detection, the loop guard must be `while (fast && fast.next)` before moving `fast = fast.next.next`.
5. **Comparing node values instead of node identity for cycles.** Two different nodes can both have `val = 3`; cycle detection must compare `slow === fast`.
6. **Returning the old head after rewiring.** Reverse and remove-head cases often change the head; return `prev` or `dummy.next`, not the original `head` by habit.

---

## Related Problems

- 🟢 **Easy** — [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) — the core three-pointer reversal.
- 🟢 **Easy** — [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) — dummy-head building pattern.
- 🟢 **Easy** — [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) — fast/slow detection without extra space.
- 🟡 **Medium** — [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) — after detection, find the exact cycle entry.
- 🟡 **Medium** — [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) — fast/slow offset plus dummy head.
- 🟡 **Medium** — [Reorder List](https://leetcode.com/problems/reorder-list/) — find middle, reverse second half, then merge alternating nodes.
- 🟡 **Medium** — [Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) — node identity matters; hash map or interleaving trick.
- 🔴 **Hard** — [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) — repeated bounded reversals with careful reconnection.

---

## Related Patterns

- **[Two Pointers](./two-pointers.md)** — fast/slow is two pointers specialized to node chains; use it for cycles, middles, and nth-from-end.
- **[Stack](./stack.md)** — a stack can reverse traversal order when pointer reversal is not allowed.
- **[Heap](./heap.md)** — merge k sorted linked lists by putting the current head of each list in a heap.