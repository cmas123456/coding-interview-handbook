# Prefix Tree for String Search

> Use a trie to share prefixes across many strings so prefix lookup takes O(L) time, where L is the query length, not the dictionary size.

!!! tip "Cheat Card (30-second review)"
    - **Spot it:** prefix, starts with, autocomplete, dictionary lookup, word search.
    - **Do:** walk one character at a time through shared child links; mark complete words with `isEnd`.
    - **Cost:** O(L) per insert/search, O(total characters) space.
    - **Watch out:** `startsWith` does not require `isEnd`; `search` does.

---

## Recognition

### Use trie when you see…

- Many queries ask whether a word exists or whether any word has a given **prefix**.
- The prompt says **dictionary**, **autocomplete**, **starts with**, or **replace words by roots**.
- You need to search a grid against many words, as in Word Search II.
- Repeated string comparisons against a large list would be too slow.

### Common phrases in the prompt

- "prefix"
- "starts with"
- "autocomplete"
- "dictionary lookup"
- "word search"
- "longest common prefix across many strings"

### Don't use trie when…

- You only need exact whole-word membership → a `Set` is simpler and usually faster.
- You have one prefix query over a sorted list → sorting plus [binary search](./binary-search.md) may be enough.
- You are matching arbitrary substrings, not prefixes → consider rolling hash or suffix structures outside this handbook.

---

## Core Intuition

> A trie stores each shared prefix once, so every query follows the characters of the query instead of scanning every word.

If you store `apple`, `app`, and `apply` in a list, checking prefix `app` may require comparing against many words. In a trie, those three words share the nodes `a -> p -> p`. The lookup cost depends only on the query length. `isEnd` separates "this path exists as a prefix" from "this path is a complete word," which is why `app` and `apple` can both be represented correctly.

---

## Generic Algorithm

### Insert a word

1. Start at the root node.
2. For each character:
   1. If the child node does not exist, create it.
   2. Move to that child.
3. After the last character, mark the node as a complete word with `isEnd = true`.

### Search a whole word

1. Walk the trie character by character.
2. If any child is missing, return false.
3. After the last character, return whether the current node has `isEnd = true`.

### Search a prefix

1. Walk the trie character by character.
2. If any child is missing, return false.
3. If the full prefix path exists, return true; do not check `isEnd`.

---

## Implementation

### JavaScript — TrieNode class

Use an object map for children. For lowercase interview problems, this is simpler than `Map` and easier to write quickly.

```js
class TrieNode {
  constructor() {
    this.children = Object.create(null);
    this.isEnd = false;
  }
}
```

### JavaScript — insert / search / startsWith

This is the classic LeetCode 208 API.

```js
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) {
        node.children[ch] = new TrieNode();
      }
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  search(word) {
    const node = this._findNode(word);
    return node !== undefined && node.isEnd;
  }

  startsWith(prefix) {
    return this._findNode(prefix) !== undefined;
  }

  _findNode(text) {
    let node = this.root;
    for (const ch of text) {
      if (!node.children[ch]) return undefined;
      node = node.children[ch];
    }
    return node;
  }
}
```

### JavaScript — Word Search II sketch

Build a trie from the word list, then DFS from each grid cell. Prune as soon as the path is not a trie prefix.

```js
function findWords(board, words) {
  const trie = new Trie();
  for (const word of words) trie.insert(word);

  const rows = board.length;
  const cols = rows === 0 ? 0 : board[0].length;
  const found = new Set();
  const path = [];

  function dfs(r, c, node) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const ch = board[r][c];
    if (ch === "#" || !node.children[ch]) return;

    const next = node.children[ch];
    path.push(ch);
    if (next.isEnd) found.add(path.join(""));

    board[r][c] = "#";
    dfs(r + 1, c, next);
    dfs(r - 1, c, next);
    dfs(r, c + 1, next);
    dfs(r, c - 1, next);
    board[r][c] = ch;

    path.pop();
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, trie.root);
    }
  }

  return [...found];
}
```

---

## Complexity

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| Insert word | O(L) | O(L) new nodes worst case | L = word length; shared prefixes reduce actual new nodes. |
| Search word | O(L) | O(1) | Must end on a node with `isEnd = true`. |
| startsWith | O(P) | O(1) | P = prefix length; path existence is enough. |
| Build dictionary | O(T) | O(T) | T = total characters across all words. |
| Word Search II | O(R · C · 4^L) worst case | O(T + L) | Trie pruning is what makes it practical. |

---

## Common Mistakes

1. **Confusing prefix existence with word existence.** `startsWith("app")` can be true while `search("app")` is false unless `isEnd` is set.
2. **Forgetting to mark `isEnd` during insert.** The path exists, but every exact search for that word returns false.
3. **Using a plain `{}` without thinking about inherited keys.** `Object.create(null)` avoids surprises with keys like `constructor`; `{}` is often accepted, but know the tradeoff.
4. **Overusing `Map` in an interview.** `Map` is fine, but for lowercase letters an object is shorter and familiar. For fixed 26-letter alphabets, `Array(26)` also works but is noisier.
5. **Not restoring the board in Word Search II.** If you mark visited cells with `"#"`, restore the original character before returning.
6. **Trying to implement deletion under pressure.** Deletion requires pruning nodes only when no other word uses them. Unless asked, leave it out.

---

## Related Problems

- 🟡 **Medium** — [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) — canonical insert/search/startsWith API.
- 🟡 **Medium** — [Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) — trie plus wildcard DFS.
- 🟡 **Medium** — [Replace Words](https://leetcode.com/problems/replace-words/) — choose the shortest root prefix for each word.
- 🟡 **Medium** — [Longest Word in Dictionary](https://leetcode.com/problems/longest-word-in-dictionary/) — requires every prefix to be a complete word.
- 🟡 **Medium** — [Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs/) — trie nodes carry prefix sums.
- 🔴 **Hard** — [Word Search II](https://leetcode.com/problems/word-search-ii/) — trie plus backtracking over a grid.
- 🔴 **Hard** — [Concatenated Words](https://leetcode.com/problems/concatenated-words/) — dictionary structure plus DP/search.
- 🔴 **Hard** — [Stream of Characters](https://leetcode.com/problems/stream-of-characters/) — often uses a reversed trie for suffix queries.

---

## Related Patterns

- **[Backtracking](./backtracking.md)** — Word Search II combines trie pruning with DFS/backtracking on the board.
- **[Arrays & Hashing](./arrays-hashing.md)** — use `Set`/`Map` for exact lookup; upgrade to trie when prefixes matter.
- **[Tree](./tree.md)** — a trie is a rooted tree where edges are characters.
- **[Graph](./graph.md)** — grid word search is graph traversal constrained by trie prefixes.
- **[DP 1D](./dp-1d.md)** — word break and concatenated words often combine dictionary lookup with dynamic programming.
