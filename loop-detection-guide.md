# Complete Guide: Detecting Loops in a Linked List

## Understanding the Problem

A linked list is a linear data structure where each element (node) points to the next element in the sequence. A loop occurs when a node's "next" pointer points back to a previous node, creating a cycle.

**Example of a loop:**

```
1 -> 2 -> 3 -> 4
     ^         |
     |_________|
```

## The Floyd's Cycle Finding Algorithm (Tortoise and Hare)

This is the most efficient algorithm for detecting loops. It's based on the idea of using two pointers that move at different speeds.

### Complete Implementation

```javascript
// Node class for linked list
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Function to detect loop in linked list
function hasLoop(head) {
  // Edge case: empty list or single node
  if (!head || !head.next) {
    return false;
  }

  // Initialize two pointers
  let slow = head; // Tortoise - moves 1 step at a time
  let fast = head; // Hare - moves 2 steps at a time

  // Move pointers until they meet or fast reaches end
  while (fast && fast.next) {
    slow = slow.next; // Move slow pointer 1 step
    fast = fast.next.next; // Move fast pointer 2 steps

    // If pointers meet, there's a loop
    if (slow === fast) {
      return true;
    }
  }

  // If fast pointer reaches end, no loop exists
  return false;
}

// Advanced: Function to find the start of the loop
function detectLoopStart(head) {
  if (!head || !head.next) {
    return null;
  }

  let slow = head;
  let fast = head;

  // Phase 1: Detect if loop exists
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      break; // Loop detected
    }
  }

  // If no loop found
  if (!fast || !fast.next) {
    return null;
  }

  // Phase 2: Find the start of the loop
  slow = head; // Reset slow to head

  // Move both pointers one step at a time
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }

  return slow; // This is the start of the loop
}

// Function to get loop length
function getLoopLength(head) {
  if (!head || !head.next) {
    return 0;
  }

  let slow = head;
  let fast = head;

  // Detect loop
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // Loop detected, now count length
      let length = 1;
      let current = slow.next;

      while (current !== slow) {
        current = current.next;
        length++;
      }

      return length;
    }
  }

  return 0; // No loop
}
```

### Alternative Approaches

#### 1. Hash Set Approach (Using Extra Space)

```javascript
function hasLoopWithHashSet(head) {
  let visited = new Set();
  let current = head;

  while (current) {
    if (visited.has(current)) {
      return true; // Loop detected
    }
    visited.add(current);
    current = current.next;
  }

  return false; // No loop
}
```

#### 2. Marking Nodes Approach (Modifies the List)

```javascript
function hasLoopWithMarking(head) {
  let current = head;

  while (current) {
    if (current.visited) {
      return true; // Loop detected
    }
    current.visited = true;
    current = current.next;
  }

  return false; // No loop
}
```

## Complete Test Cases

```javascript
// Test Case 1: No loop
function testNoLoop() {
  let head = new ListNode(1);
  head.next = new ListNode(2);
  head.next.next = new ListNode(3);
  head.next.next.next = new ListNode(4);

  console.log("No loop:", hasLoop(head)); // false
}

// Test Case 2: Loop exists
function testWithLoop() {
  let head = new ListNode(1);
  let node2 = new ListNode(2);
  let node3 = new ListNode(3);
  let node4 = new ListNode(4);

  head.next = node2;
  node2.next = node3;
  node3.next = node4;
  node4.next = node2; // Creates loop back to node2

  console.log("With loop:", hasLoop(head)); // true
  console.log("Loop start:", detectLoopStart(head).val); // 2
  console.log("Loop length:", getLoopLength(head)); // 3
}

// Test Case 3: Single node loop
function testSingleNodeLoop() {
  let head = new ListNode(1);
  head.next = head; // Points to itself

  console.log("Single node loop:", hasLoop(head)); // true
}

// Test Case 4: Empty list
function testEmptyList() {
  console.log("Empty list:", hasLoop(null)); // false
}

// Run all tests
testNoLoop();
testWithLoop();
testSingleNodeLoop();
testEmptyList();
```

## Algorithm Analysis

### Time Complexity: O(n)

- In the worst case, we visit each node once
- Fast pointer moves at most 2n steps
- Slow pointer moves at most n steps

### Space Complexity: O(1)

- Only uses two pointer variables
- No additional data structures needed

### Why It Works

**Mathematical Proof:**

1. If there's a loop, both pointers will eventually enter the loop
2. Once in the loop, the fast pointer gains one position on the slow pointer in each iteration
3. Since the loop is finite, the fast pointer will eventually "lap" the slow pointer
4. The meeting point proves a loop exists

## Edge Cases Handled

1. **Empty list** (`head = null`)
2. **Single node** (`head.next = null`)
3. **Single node loop** (`head.next = head`)
4. **Loop at the beginning**
5. **Loop at the end**
6. **No loop**

## Real-World Applications

1. **Memory Management**: Detecting circular references
2. **Graph Algorithms**: Cycle detection in directed graphs
3. **Database Systems**: Detecting infinite loops in queries
4. **Network Protocols**: Detecting routing loops
5. **File Systems**: Detecting symbolic link cycles

This comprehensive solution provides multiple approaches to solve the loop detection problem with detailed explanations, complete implementations, and thorough testing.
