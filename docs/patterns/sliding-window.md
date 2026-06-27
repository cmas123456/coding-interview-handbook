# Sliding Window Pattern

## Overview

The Sliding Window pattern is used to efficiently process **contiguous subarrays or substrings** by maintaining a moving window instead of recalculating results from scratch.

---

## Recognition

### Use Sliding Window when:
- The input is a **string or array**
- You are asked about **subarrays or substrings**
- You need **max/min/sum/longest/shortest**
- The problem mentions **contiguous elements**

### Common phrases:
- "longest substring..."
- "minimum window..."
- "maximum sum of k elements"
- "subarray with condition..."

---

## Core Idea

Instead of recomputing for every subarray:

> Expand the right pointer → Maintain state → Shrink left pointer when invalid

We keep a "window" that represents the current valid range.

---

## Types of Sliding Window

### 1. Fixed Size Window
Window size is constant (k).

Example: Maximum sum of k elements.

### 2. Variable Size Window
Window grows and shrinks based on condition.

Example: Longest substring without repeating characters.

---

## Generic Algorithm (Variable Window)

```text
left = 0
state = empty

for right in range(n):
    add arr[right] to state

    while window is invalid:
        remove arr[left] from state
        left += 1

    update answer