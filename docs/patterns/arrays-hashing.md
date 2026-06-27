# Arrays & Hashing

> Use hash maps and hash sets to turn repeated lookup, counting, and grouping work into **O(1)** average-time operations instead of scanning again and again.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** unsorted array/string + lookup/count/grouping/deduping, original indices matter, O(n²) brute force is too slow.
    - **Do:** scan once, store what you've seen in a `Map`/`Set`, answer each question from that state.
    - **Cost:** O(n) average time, O(n) space.
    - **Watch out:** prefer `Map`/`Set` over plain objects in JS; use `map.keys()` / `set.has()` semantics intentionally.

---

## Recognition

### Use arrays & hashing when you see…

- An **unsorted** array or string where you need fast membership: "have I seen this before?"
- A question about **counts / frequencies / duplicates / first unique / grouping**.
- A pair lookup where the brute force is O(n²), especially when you must return **original indices**.
- Constraints big enough that nested loops won't fit (typically `n >= 10^4`).
- You need to preserve scan order or insertion order while still checking membership quickly.

### Common phrases in the prompt

- "return the indices of the two numbers …"
- "contains duplicate"
- "valid anagram"
- "group strings that are anagrams"
- "frequency", "count occurrences", "most common"
- "first unique character"

### Don't use arrays & hashing when…

- The array is already **sorted** and the problem asks for a pair / triplet → [two pointers](./two-pointers.md) is usually O(1) space.
- The answer depends on a **contiguous range** → use [sliding window](./sliding-window.md) or [prefix sum](./prefix-sum.md), depending on the query.
- You need ordered min/max access after every update → use a heap, balanced tree, or monotonic structure instead of a hash table.
- The key is a mutable object in JS and you expect value equality. `Map` compares object keys by reference, not by deep structure.

---

## Core Intuition

> If the expensive part is "find the matching thing I've already seen," store each seen thing in a hash table so the next lookup is O(1) average time.

Brute force repeatedly asks the same question by scanning the array: "is there another value that matches this one?" Hashing pays O(n) space to remember enough information from the scan — an index, a count, or a bucket — so each future question is constant-time on average. The pattern is less about arrays specifically and more about choosing the right **key**: number value, character, sorted string, remainder, or serialized state.

---

## Generic Algorithm

### Seen-set / lookup pattern

```text
1. Initialize an empty hash map or hash set.
2. For each element at index i:
     a. Compute the key you need to look up.
     b. If the key is already present, return / update the answer.
     c. Otherwise store the current element, index, or count.
3. Return the default answer if no match was found.
```

### Frequency counting pattern

```text
1. Initialize counts = empty map.
2. For each item:
     counts[item] += 1.
3. Use counts to compare, find uniques, rank frequencies, or validate equality.
```

### Group-by-key pattern

```text
1. Initialize groups = empty map from key -> list.
2. For each item:
     a. Convert item into a canonical key.
     b. Append item to groups[key].
3. Return all grouped lists.
```

The hardest step is usually **choosing a key that makes equivalent things identical**: anagrams can use sorted letters (`"aet"`) or a 26-count signature; pairs can use the complement (`target - nums[i]`).

---

## Implementation

### JavaScript — Two Sum (unsorted, return original indices)

Store each number's index, then look up the complement before inserting the current number.

```js
function twoSum(nums, target) {
  const indexByValue = new Map();

  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (indexByValue.has(needed)) {
      return [indexByValue.get(needed), i];
    }
    indexByValue.set(nums[i], i);
  }

  return [-1, -1];
}
```

### JavaScript — valid anagram (character counts)

Count one string up and the other down; every count should return to zero.

```js
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const counts = new Map();
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }

  for (const ch of t) {
    if (!counts.has(ch)) return false;
    const nextCount = counts.get(ch) - 1;
    if (nextCount === 0) counts.delete(ch);
    else counts.set(ch, nextCount);
  }

  return counts.size === 0;
}
```

### JavaScript — group anagrams (sorted key -> list)

A sorted string is a canonical key: all anagrams collapse to the same bucket.

```js
function groupAnagrams(strs) {
  const groups = new Map();

  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(str);
  }

  return Array.from(groups.values());
}
```

### JavaScript — contains duplicate / first unique character

Use a `Set` for membership-only questions; use a `Map` when you need counts.

```js
function containsDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }

  return false;
}

function firstUniqChar(s) {
  const counts = new Map();

  for (const ch of s) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }

  return -1;
}
```

---

## Complexity

| Variant                    | Time        | Space | Notes |
|----------------------------|-------------|-------|-------|
| Seen-set / duplicate check | O(n)        | O(n)  | `Set.has` is O(1) average time. |
| Two Sum lookup             | O(n)        | O(n)  | One pass; stores at most one index per distinct value. |
| Character counts           | O(n)        | O(k)  | k = alphabet size / number of distinct characters. |
| Group anagrams             | O(n · m log m) | O(n · m) | n strings, max length m; sorting each key dominates. |

Hash-table operations are **average-case** O(1). In interviews, that's the expected model unless the prompt asks about adversarial hashing or ordered keys.

---

## Common Mistakes

1. **Using a plain object when keys are not guaranteed strings.** Object keys are coerced (`1` and `"1"` collide), and inherited names can surprise you. Use `Map` for arbitrary keys and `Set` for membership.
2. **Inserting before checking in Two Sum.** If `target = 6` and `nums[i] = 3`, inserting first can pair the element with itself. Check the complement first, then insert current index.
3. **Forgetting duplicate values need distinct indices.** A map value should be an index you've already passed; `[3, 3]` with target `6` works because the first `3` is stored before the second is checked.
4. **Comparing arrays as map keys by value.** In JS, `[1, 2] !== [1, 2]` as keys because arrays are references. Convert structural keys to strings like `counts.join('#')` or sorted strings.
5. **Mixing `Object.keys()` with `Map`.** `Object.keys(map)` is empty because `Map` stores entries internally. Use `map.keys()`, `map.values()`, `map.entries()`, or `Array.from(map.keys())`.
6. **Assuming a `Set` is sorted.** JS `Set` iteration follows insertion order, not numeric or lexicographic order. If order matters, sort explicitly or choose a different structure.

---

## Related Problems

- 🟢 **Easy** — [Two Sum](https://leetcode.com/problems/two-sum/) — canonical complement lookup while preserving original indices.
- 🟢 **Easy** — [Valid Anagram](https://leetcode.com/problems/valid-anagram/) — pure frequency counting over characters.
- 🟢 **Easy** — [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) — membership check with a `Set`.
- 🟢 **Easy** — [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/) — count first, then scan in original order.
- 🟡 **Medium** — [Group Anagrams](https://leetcode.com/problems/group-anagrams/) — choose a canonical key, then bucket strings by that key.
- 🟡 **Medium** — [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) — frequency map first, then heap or bucket sort for the ranking step.
- 🟡 **Medium** — [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) — use a set to start sequences only at numbers with no predecessor.

---

## Related Patterns

- **[Two Pointers](./two-pointers.md)** — reach for this when sorting is allowed and you can trade hash-space for ordered elimination.
- **[Sliding Window](./sliding-window.md)** — many window invariants use a `Map`/`Set` as state, especially distinct-character problems.
- **[Prefix Sum](./prefix-sum.md)** — often combined with a hash map when the key is a cumulative sum or remainder.
- **[Heap / Priority Queue](./heap.md)** — use after counting when the question asks for top-k, kth, or repeated best extraction.