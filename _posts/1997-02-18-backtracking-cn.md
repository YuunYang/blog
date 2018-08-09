---
title:  "回溯法"
categories:
  - summarize
tags: 
  - backtracking
  - algorithm
  - leetcode
lang_change: true
lang: cn
author_profile: true
hide: true
last_modified_at: 2018-08-09T15:12:19-04:00
toc: true
toc_label: "回溯法"
---

`回溯算法试图逐步构建一个计算问题的解决方案。每当算法需要在解决方案的下一个组件的多个备选方案之间做出选择时，它都会递归地尝试所有可能的选项。`

Talk is cheap， 我们直接看问题

## N皇后问题

>这个问题要求放置N个皇后在N × N的棋盘上, 也就是两个皇后不可以攻击对方。 对于那些对国际象棋不熟悉的读者来讲，这意味着两个皇后不可以在同一行、列和对角线上。

我们有 $$N\times{N}$$ 个未被攻占的棋盘，同时我们需要$$N$$个皇后. 每一次当我们把皇后放置在 $$(i, j)\quad \text{for i<N, j<N}$$ 上时, 未被攻占的棋盘便减少了（一个）, 所以一直等下面两个条件满足，我们都可以持续进行这个操作:

- 被攻占的棋盘数不是$$0$$.
- 需要放置的皇后也不是$$0$$.

所以我们的边界条件就是当未被攻占的棋盘数变为0或者所有的皇后都被放置；对于皇后来说如果全部都被放置，游戏结束，我们找到了答案；而当未被攻占的棋盘数变为0时，意味着我们需要回溯（从之前的结果再次出发）；举例来说，把最后一个皇后从它现在的位置移开，然后放置到另一个棋盘上。我们可以做一个循环。

### 来自[`hackerearth`][hackerearth Recursion and Backtracking]的伪代码

```python
is_attacked( x, y, board[][], N)
    //检查行和列
    if any cell in xth row is 1
        return true
    if any cell in yth column is 1
        return true

    //检查斜对角线
    if any cell (p, q) having p+q = x+y is 1
        return true
    if any cell (p, q) having p-q = x-y is 1
        return true
    return false


N-Queens( board[][], N )
    if N is 0                     //所有的皇后都被置换了
        return true
    for i = 1 to N {
        for j = 1 to N {
            if is_attacked(i, j, board, N) is true
                skip it and move to next cell
            board[i][j] = 1            //替换在(i,j)位置的皇后
            if N-Queens( board, N-1) is true    // 问题解决
                return true                   // 找到答案返回true
            board[i][j] = 0            /* 回溯，同时不要忘记将之前的修改改回来 */
        }
    }
    return false
```

这是图片:

![n-queue](/assets/images/2018-08-06-backtracking/n-queue.png)

最后得到这样的结果:

![n-queue-end](/assets/images/2018-08-06-backtracking/n-queue-end.png){: .align-left}
通常来说，当我们处理回溯问题时，问题的关键是 `递归` 难点是 **找到递归规律和边界条件**，另外还需注意的是，当一次递归开始时，我们也需要设置一个标志，来表示我们到底置换了哪一个棋盘（`board[i][j] = 1`），当递归结束时，我们同样需要将它还原成原来的状态（`board[i][j] = 0`）。在代码编写过程中, 我们还需要考虑如何来计算这个棋盘（皇后）所处的位置是否是安全的。下面的代码便很巧妙的完成了这个需求。

### 来自[算法竞赛入门经典][算法竞赛入门经典]的代码

```cpp
void search(int cur) {
  if(cur == n) tot++;
  else for(int i = 0; i < n; i++) {
    if(!vis[0][i] && !vis[1][cur+i] && !vis[2][cur-i+n]) {
      //用一个二维数组来判断是否安全
      C[cur] = i; //如果无需打印，C是不需要的
      vis[0][i] = vis[1][cur+i] = vis[2][cur-i+n] = 1; //表示不安全
      search(cur+1);
      vis[0][i] = vis[1][cur+i] = vis[2][cur-i+n] = 0; //注意！一定要改回来
    }
  }
}
```
[C++文件](/assets/files/nqueue.cpp)

## 参考

上面所参考的一些文章、博客、论文等.

- [hackerearth Recursion and Backtracking]('https://www.hackerearth.com/zh/practice/basic-programming/recursion/recursion-and-backtracking/tutorial/')
- [Backtracking illinois]('http://jeffe.cs.illinois.edu/teaching/algorithms/notes/03-backtracking.pdf')
- [Leetcode No.79. Word Search]('https://leetcode.com/problems/word-search/description/')
- [算法竞赛入门经典]('http://www.xwood.net/docs/pdf/%E7%AE%97%E6%B3%95%E7%AB%9E%E8%B5%9B%E5%85%A5%E9%97%A8%E7%BB%8F%E5%85%B8_%E7%AC%AC2%E7%89%88_201703071237.pdf')

[hackerearth Recursion and Backtracking]:https://www.hackerearth.com/zh/practice/basic-programming/recursion/recursion-and-backtracking/tutorial/')
[Backtracking illinois]:http://jeffe.cs.illinois.edu/teaching/algorithms/notes/03-backtracking.pdf')
[Leetcode No.79. Word Search]:https://leetcode.com/problems/word-search/description/')
[算法竞赛入门经典]: 'http://www.xwood.net/docs/pdf/%E7%AE%97%E6%B3%95%E7%AB%9E%E8%B5%9B%E5%85%A5%E9%97%A8%E7%BB%8F%E5%85%B8_%E7%AC%AC2%E7%89%88_201703071237.pdf'