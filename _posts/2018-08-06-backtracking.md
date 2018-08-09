---
title:  "Backtracking"
categories:
  - summarize
tags: 
  - backtracking
  - algorithm
  - leetcode
entries_layout: grid
lang_change: true
lang: en
author_profile: true
toc: true
toc_label: "Backtracking"
---
`A backtracking algorithm tries to build a solution to a computational problem incrementally.Whenever the algorithm needs to decide between multiple alternatives to the next component of the solution, it simply tries all possible options recursively.`

Talk is cheap, let's see the problems.

## N-Queens Problem

>The problem is to place n queens on an n × n chessboard, so that no two queens can attack each other. For readers not familiar with the rules of chess, this means that no two queens are in the same row, column, or diagonal

We have $$N\times{N}$$ unattacked cells where we need $$N$$ queues. and every time we place one queue at $$(i, j)\quad \text{for i<N, j<N}$$, the number of unattacked cells reduced, so continue doing this, as long as following conditions hold:

- The number of unattacked cells is not $$0$$.
- The number of queens to be placed is not $$0$$.

That is our terminal conditions is when the unattacked cells comes zero or the queues all placed; and for the queue, if all placed, then it's over, we found the solution; while the unattacked cells comes zero, means we need to backtrack,i.e. remove the last placed queen from its current cell, and place it at some other cell. We do this recursively.

### The pseudocode from [`hackerearth`][hackerearth Recursion and Backtracking]

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
Generally, when we dealing with backtracking problem, the key is `Recursion` and difficulty is to **find the recursive rule and find the terminal conditions**, and one should notice is that we should make a sign to show which cell we have placed `board[i][j] = 1` and when one recurrence starts, we need remember to change this sign to origin cell `board[i][j] = 0` when the recurrence ends. When writing program, we also need to think about how to compute if the queues are in a safe place. And the follow code is show this magic.

### Code from [算法竞赛入门经典][算法竞赛入门经典]

```cpp
void search(int cur) {
  if(cur == n) tot++;
  else for(int i = 0; i < n; i++) {
    if(!vis[0][i] && !vis[1][cur+i] && !vis[2][cur-i+n]) {
      //use a 2d array to judge if safe
      C[cur] = i; //if dont need to print, C is useless
      vis[0][i] = vis[1][cur+i] = vis[2][cur-i+n] = 1; //add a sign means not safe
      search(cur+1);
      vis[0][i] = vis[1][cur+i] = vis[2][cur-i+n] = 0; //Keep in mind! change it back
    }
  }
}
```
[Cpp code file](/files/nqueue.cpp)

## References

Some essay, blog or question referred above.

- [hackerearth Recursion and Backtracking]('https://www.hackerearth.com/zh/practice/basic-programming/recursion/recursion-and-backtracking/tutorial/')
- [Backtracking illinois]('http://jeffe.cs.illinois.edu/teaching/algorithms/notes/03-backtracking.pdf')
- [Leetcode No.79. Word Search]('https://leetcode.com/problems/word-search/description/')
- [算法竞赛入门经典]('http://www.xwood.net/docs/pdf/%E7%AE%97%E6%B3%95%E7%AB%9E%E8%B5%9B%E5%85%A5%E9%97%A8%E7%BB%8F%E5%85%B8_%E7%AC%AC2%E7%89%88_201703071237.pdf')

[hackerearth Recursion and Backtracking]:https://www.hackerearth.com/zh/practice/basic-programming/recursion/recursion-and-backtracking/tutorial/')
[Backtracking illinois]:http://jeffe.cs.illinois.edu/teaching/algorithms/notes/03-backtracking.pdf')
[Leetcode No.79. Word Search]:https://leetcode.com/problems/word-search/description/')
[算法竞赛入门经典]: 'http://www.xwood.net/docs/pdf/%E7%AE%97%E6%B3%95%E7%AB%9E%E8%B5%9B%E5%85%A5%E9%97%A8%E7%BB%8F%E5%85%B8_%E7%AC%AC2%E7%89%88_201703071237.pdf'