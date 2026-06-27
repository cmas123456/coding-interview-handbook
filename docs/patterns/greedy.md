# Greedy

> Make the locally best choice at each step, then rely on a proof (or a known pattern) that those local wins combine into the global optimum.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** "minimum number of …", "can you reach", schedule the most, or a sort + single pass feels enough.
    - **Do:** choose the best-looking option now, maintain the invariant that past choices never need revisiting, and scan once.
    - **Cost:** usually O(n) after setup, often O(n log n) if sorting is required, O(1) extra space.
    - **Watch out:** greedy is wrong by default — sanity-check 1–2 small counter-examples before trusting it.

---

## Recognition

### Use greedy when you see…

- The prompt asks for a **minimum number of moves / jumps / arrows / resources** or whether you **can reach** an end state.
- A sorted order seems to make every future decision easier: smallest first, largest first, earliest end first, last occurrence first.
- DP feels possible but heavy, and each step seems to have an obvious best local choice.
- You can phrase an invariant like: "after processing index `i`, I have the farthest reachable point" or "I have used the fewest partitions so far."

### Common phrases in the prompt

- "minimum number of …"
- "can you reach the last index"
- "schedule the most …"
- "assign as many as possible"
- "partition so that each character appears in at most one part"
- "sort the input and scan once"

### Don't use greedy when…

- A small counter-example breaks the local choice. Example: choosing the biggest coin first is wrong for coin systems like `[1, 3, 4]` and amount `6`.
- The best decision depends on **future combinations** you cannot summarize with one invariant → use [Dynamic Programming (1D)](./dp-1d.md) or [2D DP](./dp-2d.md).
- You need to enumerate all valid answers, not just optimize one answer → use [Backtracking](./backtracking.md).

---

## Core Intuition

> Greedy works only when you can prove that taking the best local choice never blocks a better global answer.

The coding is usually short. The hard part is recognition. For every greedy solution, ask: **what choice am I making, and why can I commit to it forever?**

Two common proof shapes:

1. **Exchange argument.** If an optimal solution made a different first choice, you can swap in the greedy choice without making the answer worse.
2. **Invariant.** After each step, your state is at least as good as any other strategy's state for the processed prefix.

Echo the DP warning: the failure mode is not "I couldn't code it." The failure mode is **"I picked greedy and it is wrong on a counter-example."** Before you commit, test one or two tiny adversarial inputs by hand. If the local choice cannot survive that, fall back to DP.

---

## Generic Algorithm

1. Identify the local choice. Examples: farthest reachable index, earliest finishing interval, smallest cookie that fits.
2. Decide whether the input must be sorted first. If yes, choose the sort key carefully — the key is the algorithm.
3. Initialize the smallest state that proves progress.
4. Scan once:
     - Update the state using the current item.
     - If the current greedy segment / candidate fails, reset or commit.
     - Record the best answer so far.
5. Return the committed answer.
6. Sanity-check against a small counter-example before finalizing.

---

## Implementation

### JavaScript — Jump Game (track farthest reachable index)

`farthest` is the best reach any jump can give you among indices you've already been able to visit.

```js
function canJump(nums) {
  let farthest = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;
  }
  return true;
}
```

### JavaScript — Gas Station (reset when the current start cannot work)

If `tank` drops below zero at station `i`, no station inside the failed segment can be the answer, so the next candidate is `i + 1`.

```js
function canCompleteCircuit(gas, cost) {
  let total = 0;
  let tank = 0;
  let start = 0;

  for (let i = 0; i < gas.length; i++) {
    const delta = gas[i] - cost[i];
    total += delta;
    tank += delta;

    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}
```

### JavaScript — Assign Cookies (sort both, satisfy smallest child first)

Use the smallest cookie that can satisfy the least-greedy remaining child. Bigger cookies stay available for harder children.

```js
function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let child = 0;
  let cookie = 0;

  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      child++;
    }
    cookie++;
  }
  return child;
}
```

### JavaScript — Partition Labels (last occurrence defines the boundary)

Once the scan reaches the farthest last occurrence of every character seen in the current partition, you can cut.

```js
function partitionLabels(s) {
  const last = new Map();
  for (let i = 0; i < s.length; i++) {
    last.set(s[i], i);
  }

  const result = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i]));
    if (i === end) {
      result.push(end - start + 1);
      start = i + 1;
    }
  }
  return result;
}
```

---

## Complexity

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| Jump Game reach scan | O(n) | O(1) | One pass; `farthest` summarizes all previous jumps. |
| Gas Station reset scan | O(n) | O(1) | One pass after total feasibility check. |
| Assign Cookies | O(n log n + m log m) | O(1) | Sort both arrays, then two pointers. |
| Partition Labels | O(n) | O(k) | k = alphabet size stored in `last`. |
| Sort-then-greedy intervals | O(n log n) | O(1) | Sort key dominates; scan is linear. |

---

## Common Mistakes

1. **Assuming greedy works because it feels natural.** For coin change with `[1, 3, 4]`, amount `6`, "take the largest coin" gives `4 + 1 + 1` (3 coins), but `3 + 3` is better. If you cannot justify the local choice, use DP.
2. **Sorting by the wrong key.** Interval scheduling usually sorts by **end** time; merging intervals sorts by **start**. The wrong key still passes easy tests and fails adversarial ones.
3. **Forgetting the feasibility check.** In Gas Station, returning `start` without `total >= 0` says a route exists even when total gas is less than total cost.
4. **Resetting too early or too late.** In Gas Station, reset only when `tank < 0`, not when it is exactly `0`; zero still lets you continue.
5. **Treating Jump Game as "jump to the locally farthest index".** You do not need to choose an actual jump for Jump Game I. Track the farthest reachable index across all choices.
6. **Using greedy when the problem needs a count of all ways.** "How many ways" usually needs DP/backtracking; greedy returns one optimized path, not a count.

---

## Related Problems

- 🟢 **Easy** — [Assign Cookies](https://leetcode.com/problems/assign-cookies/) — sort both lists and spend the smallest sufficient cookie.
- 🟢 **Easy** — [Lemonade Change](https://leetcode.com/problems/lemonade-change/) — keep the change that preserves future flexibility.
- 🟡 **Medium** — [Jump Game](https://leetcode.com/problems/jump-game/) — farthest-reach invariant.
- 🟡 **Medium** — [Jump Game II](https://leetcode.com/problems/jump-game-ii/) — greedily expand the current jump range layer by layer.
- 🟡 **Medium** — [Gas Station](https://leetcode.com/problems/gas-station/) — failed segment reset + total feasibility.
- 🟡 **Medium** — [Partition Labels](https://leetcode.com/problems/partition-labels/) — last occurrence tells you when a partition is safe to cut.
- 🟡 **Medium** — [Hand of Straights](https://leetcode.com/problems/hand-of-straights/) — greedily start groups from the smallest available card.
- 🟡 **Medium** — [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) — interval greedy by earliest end.

---

## Related Patterns

- **[Intervals](./intervals.md)** — many interval problems are greedy after sorting. The sort key (start vs end) is the whole problem.
- **[Two Pointers](./two-pointers.md)** — sort + two pointers is a common greedy shape, especially when matching smallest with smallest sufficient.
- **[Arrays & Hashing](./arrays-hashing.md)** — frequency maps often support greedy scans, like grouping cards or tracking last occurrences.
- **[Dynamic Programming (1D)](./dp-1d.md)** — the fallback when local choices fail. If a small counter-example breaks greedy, define `dp[i]` instead.
