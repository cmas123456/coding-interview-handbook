# Stack

> Use a LIFO structure to remember unfinished work, then resolve the most recent item first when you find its matching partner.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** matched pairs, nested structure, or "process until the most recent unresolved item is closed."
    - **Do:** `push` when you open/start; `pop` when you close/finish; validate the popped item matches.
    - **Cost:** O(n) time, O(n) space in the worst case.
    - **Watch out:** check the stack is non-empty before popping; in JavaScript, `Array.push` / `Array.pop` is your stack.

---

## Recognition

### Use this pattern when you see…

- The problem has **last-in, first-out** behavior: the most recent thing must be handled first.
- You need to match **openers with closers**: parentheses, brackets, tags, nested encodings.
- The prompt describes **nested** or **recursive** structure, but you want an iterative solution.
- You need to evaluate expressions where operators consume the most recent operands.

### Common phrases in the prompt

- "valid parentheses / brackets"
- "nested expression"
- "decode string"
- "evaluate postfix / reverse Polish notation"
- "most recent unmatched …"

### Don't use this pattern when…

- You need the **next greater / smaller** element for every index → that's [monotonic stack](./monotonic-stack.md), not plain stack.
- You need FIFO order (oldest first) → use a **queue**.
- You only need counts and order doesn't matter → a **hash map** is simpler.

---

## Core Intuition

> A stack lets you postpone work until its partner appears, and because nested work closes from the inside out, the correct partner is always on top.

Brute force often rescans backward to find the most recent unresolved opener or operand. A stack keeps exactly that item at `stack[stack.length - 1]`, so each token is pushed once, popped once, and resolved in O(1). The key question is: **what object do you need to remember until a future token completes it?**

---

## Generic Algorithm

### Matched pairs

```text
1. Initialize an empty stack.
2. For each token:
     a. If token opens something, push it.
     b. If token closes something:
          if stack is empty, fail
          pop the most recent opener
          if opener does not match closer, fail
3. Succeed only if stack is empty.
```

### Expression / state evaluation

```text
1. Initialize an empty stack.
2. For each token:
     a. If token is a value, push it.
     b. If token is an operator / closer:
          pop the operands or saved state it needs
          compute the new value
          push or append the result
3. Return the final stack value or built output.
```

Plain stacks are about **LIFO bookkeeping**. If you are maintaining increasing/decreasing order inside the stack, switch mental models to [monotonic stack](./monotonic-stack.md).

---

## Implementation

### JavaScript — valid parentheses

Classic matched-pairs template:

```js
function isValidParentheses(s) {
  const stack = [];
  const matchingOpen = new Map([
    [")", "("],
    ["]", "["],
    ["}", "{"]
  ]);

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (matchingOpen.has(ch)) {
      if (stack.length === 0) return false;
      const open = stack.pop();
      if (open !== matchingOpen.get(ch)) return false;
    }
  }

  return stack.length === 0;
}
```

### JavaScript — Min Stack

Track the current minimum alongside each pushed value so `getMin()` is O(1):

```js
class MinStack {
  constructor() {
    this.stack = [];
  }

  push(value) {
    const minSoFar = this.stack.length === 0
      ? value
      : Math.min(value, this.getMin());
    this.stack.push({ value, minSoFar });
  }

  pop() {
    if (this.stack.length === 0) return undefined;
    return this.stack.pop().value;
  }

  top() {
    if (this.stack.length === 0) return undefined;
    return this.stack[this.stack.length - 1].value;
  }

  getMin() {
    if (this.stack.length === 0) return undefined;
    return this.stack[this.stack.length - 1].minSoFar;
  }
}
```

### JavaScript — evaluate Reverse Polish Notation

Operators consume the two most recent numbers:

```js
function evalRPN(tokens) {
  const stack = [];
  const ops = new Set(["+", "-", "*", "/"]);

  for (const token of tokens) {
    if (!ops.has(token)) {
      stack.push(Number(token));
      continue;
    }

    const right = stack.pop();
    const left = stack.pop();
    let value;

    if (token === "+") value = left + right;
    else if (token === "-") value = left - right;
    else if (token === "*") value = left * right;
    else value = Math.trunc(left / right);

    stack.push(value);
  }

  return stack.pop();
}
```

### JavaScript — decode string

Save the previous string and repeat count whenever a nested bracket opens:

```js
function decodeString(s) {
  const stack = [];
  let current = "";
  let count = 0;

  for (const ch of s) {
    if (/\d/.test(ch)) {
      count = count * 10 + Number(ch);
    } else if (ch === "[") {
      stack.push({ previous: current, repeat: count });
      current = "";
      count = 0;
    } else if (ch === "]") {
      const { previous, repeat } = stack.pop();
      current = previous + current.repeat(repeat);
    } else {
      current += ch;
    }
  }

  return current;
}
```

---

## Complexity

| Variant                | Time | Space | Notes |
|------------------------|------|-------|-------|
| Valid parentheses      | O(n) | O(n)  | Worst case all openers, e.g. `((((`. |
| Min Stack              | O(1) per op | O(n) | Stores one extra min value per pushed value. |
| Reverse Polish Notation| O(n) | O(n)  | Each token is pushed or consumes two stack values. |
| Decode String          | O(m) | O(n)  | m = expanded output length; stack depth = nesting depth. |

---

## Common Mistakes

1. **Popping from an empty stack.** In Valid Parentheses, input `")("` must fail immediately; `stack.pop()` returns `undefined`, which can hide the bug if you don't check `stack.length` first.
2. **Using `shift()` / `unshift()` as the stack.** JavaScript arrays are efficient stacks with `push()` and `pop()`. `shift()` is queue behavior and can be O(n).
3. **Forgetting the final empty-stack check.** `"(("` has no illegal closer, but it's still invalid because unresolved openers remain.
4. **Reversing operand order in RPN.** For `5 2 -`, `right = 2` and `left = 5`; the answer is `3`, not `-3`.
5. **Not resetting state after `[` in Decode String.** Once you push `{ previous, repeat }`, reset `current = ""` and `count = 0` or nested cases like `3[a2[c]]` break.
6. **Confusing plain stack with monotonic stack.** Daily Temperatures and Largest Rectangle are not just "push until close" problems; they maintain an ordered stack.

---

## Related Problems

- 🟢 **Easy** — [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) — the canonical matched-pairs stack problem.
- 🟡 **Medium** — [Min Stack](https://leetcode.com/problems/min-stack/) — augment each stack entry with the minimum so far.
- 🟡 **Medium** — [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) — operators pop the most recent operands.
- 🟡 **Medium** — [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) — not a direct stack simulation, but the same open/close validity rules drive backtracking.
- 🟡 **Medium** — [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) — starts from stack intuition, then becomes a monotonic-stack problem.
- 🟡 **Medium** — [Decode String](https://leetcode.com/problems/decode-string/) — nested saved state with counts and previous strings.
- 🔴 **Hard** — [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) — hard version of stack thinking; the real pattern is monotonic stack.

---

## Related Patterns

- **[Monotonic Stack / Deque](./monotonic-stack.md)** — use it when the stack must stay increasing/decreasing to answer next greater/smaller or range maximum questions.
- **[Backtracking](./backtracking.md)** — Generate Parentheses uses stack-like open/close constraints while exploring choices.
- **[Arrays & Hashing](./arrays-hashing.md)** — pair a stack with maps/sets when tokens need fast classification, like bracket matching or operator lookup.