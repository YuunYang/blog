---
layout: post
title:  "Backtracking"
date:   2018-08-06
categories:
  - summarize
tags: 
  - backtracking
  - algorithm
  - leetcode
author: yyk
taxonomy: articles
entries_layout: grid
lang_change: true
lang: en
# last_modified_at: 2018-08-03T12:40:00
---
<!-- markdownlint-disable MD002 -->

`A backtracking algorithm tries to build a solution to a computational problem incrementally.Whenever the algorithm needs to decide between multiple alternatives to the next component of the solution, it simply tries all possible options recursively.`

Talk is cheap, let's see the problems.

## N-Queens Problem

>The problem is to place n queens on an n × n chessboard, so that no two queens can attack each other. For readers not familiar with the rules of chess, this means that no two queens are in the same row, column, or diagonal

We have $$N\times{N}$$ unattacked cells where we need $$N$$ queues. and every time we place one queue at $$(i, j)\quad \text{for i<N, j<N}$$, the number of unattacked cells reduced, so continue doing this, as long as following conditions hold:

- The number of unattacked cells is not $$0$$.
- The number of queens to be placed is not $$0$$.

That is our terminal conditions is when the unattacked cells comes zero or the queues all placed; and for the queue, if all placed, then it's over, we found the solution; while the unattacked cells comes zero, means we need to backtrack,i.e. remove the last placed queen from its current cell, and place it at some other cell. We do this recursively.

The pseudocode from [`hackerearth`]('https://www.hackerearth.com/zh/practice/basic-programming/recursion/recursion-and-backtracking/tutorial/')

```python
is_attacked( x, y, board[][], N)
    //checking for row and column
    if any cell in xth row is 1
        return true
    if any cell in yth column is 1
        return true

    //checking for diagonals
    if any cell (p, q) having p+q = x+y is 1          
        return true
    if any cell (p, q) having p-q = x-y is 1
        return true
    return false


N-Queens( board[][], N )
    if N is 0                     //All queens have been placed
        return true
    for i = 1 to N {
        for j = 1 to N {
            if is_attacked(i, j, board, N) is true
                skip it and move to next cell
            board[i][j] = 1            //Place current queen at cell (i,j)
            if N-Queens( board, N-1) is true    // Solve subproblem
                return true                   // if solution is found return true
            board[i][j] = 0            /* if solution is not found undo whatever changes 
                                       were made i.e., remove  current queen from (i,j)*/
        }
    }
    return false
```

And the pic is clear:

![n-queue](/images/2018-08-06-backtracking/n-queue.png)

At the end it reaches the following solution:

![n-queue-end](/images/2018-08-06-backtracking/n-queue-end.png){: .align-left}
Generally, when we dealing with backtracking problem, the key is `Recursion` and difficulty is to **find the recursive rule and find the terminal conditions**, and one should notice is that we should make a sign to show which cell we have placed `board[i][j] = 1` and when one recurrence ends, we need to remember to change this sign to origin cell.`board[i][j] = 0`

## References

Some essay, blog or question referred above.

- [hackerearth Recursion and Backtracking]('https://www.hackerearth.com/zh/practice/basic-programming/recursion/recursion-and-backtracking/tutorial/')
- [Backtracking illinois]('http://jeffe.cs.illinois.edu/teaching/algorithms/notes/03-backtracking.pdf')
- [Leetcode No.79. Word Search]('https://leetcode.com/problems/word-search/description/')