---
layout: post
title:  "Dynamic Programming Summarize"
date:   2018-07-24
categories:
  - algorithm
  - summarize
tags: 
  - dynamic programming
author: yyk
taxonomy: articles
entries_layout: grid
image: 
  path: /images/2018-07-24-dynamic-programming-summarize/6b68f98.png
  thumbnail: /images/2018-07-24-dynamic-programming-summarize/6b68f98.png
  caption: "Photo from [hackerearth](https://www.hackerearth.com/zh/practice/algorithms/dynamic-programming/introduction-to-dynamic-programming-1/tutorial/)"
last_modified_at: 2018-07-26T15:21:00
---

Dynamic programming algorithms is a way to break down the problem into smaller and simpler pieces, that is [we wish to find a solustion to given problem which optimizes some quantity Q of interest](http://www.cs.mun.ca/~kol/courses/2711-w08/dynprog-2711.pdf); like we like to maximize profit or minimize cost.

Like divide-and-conquer algorithm, they will both break down the problem first; the divide-and-conquer algorithm's subproblem is independent, which means the intersection of all those subproblem is empty set, and the union is the problem itself, but different with the follow, DP's subproblem is not independent, because the previous subproblem could have impact on the subsequent steps, and this is the characteristic of those general problems. [**More specifically, it works by creating an array of related but simpler problems, and then finding the optimal value of Q for each of these problems; we calculate the values for the more complicated problems by using the values already calculated for the easier problems**](http://www.cs.mun.ca/~kol/courses/2711-w08/dynprog-2711.pdf). and then I will present this algorithm in 4 steps.

## The thinking of DP algorithm

### Step1

**Describe a array of values that we want to compute**, like the minimize cost; as a example, we compute the minimize of the table below, from bottom to top. how we design the array? each array index represent the optimum solution of corresponding row, for instance the solution of line 4 (or the line 1 from top to bottom) is $$min_{\{1\leqslant{j}\leqslant{m}\}}A(4, j)$$, and we can compute the accurate answer is *`A(4, 4)`* (4 -> 1 -> 2 -> 5 is the minimum sum). This is two dimensional array, we can also use just on dimensional, refer to [Leetcode No.120](https://leetcode.com/problems/triangle/discuss/38730/DP-Solution-for-Triangle).

| 2 | 8 | 9 | **5** | 8 |
| 4 | 4 | 6 | **2** | 3 |
| 5 | 7 | 5 | 6 | **1** |
| 3 | 2 | 5 | **4** | 8 |

### Step2(the core of the solution)

**Give a recurrence relating some values in the array to other values in the array.** the recurrence should say how to compute the values from scratch, so when we initialize the array, we always set $$A(1, j) = C(1, j) (for 1 ≤ j ≤ m)$$. A somewhat more elegant way is to make an additional zero row and $$\infty$$ col. so we compute the array $$A(i, j) for 1 ≤ i ≤ n, 1 ≤ j ≤ m$$ following:

$$A(i, j) \equiv
\begin{cases}
C(i, j) + min\{A(i − 1, j − 1), A(i − 1, j)\},  & \text{if $j$ = $m$} \\[2ex]
C(i, j) + min\{A(i − 1, j), A(i − 1, j + 1)\},  & \text{if $j$ = $1$} \\[2ex]
C(i, j) + min\{A(i − 1, j − 1), A(i − 1, j), A(i − 1, j + 1)\},  & \text{if ${j}\neq{1}$ and ${j}\neq{m}$}
\end{cases}$$

Because we add `some extra row and col` to the table, so we can immediately eliminate the cases, and the recurrence becomes. for $$1 ≤ i ≤ n, 1 ≤ j ≤ m$$

$$A(i, j) \equiv C(i, j) + min\{A(i − 1, j − 1), A(i − 1, j), A(i − 1, j + 1)\}$$

So, lets have a testing, for **line one**, because the values in line zero are all zero or $$\infty$$. Therefore, it is easy to calculate that the value in the first row is the value of the **corresponding row**; line two: $$\infty$$, 7, 9, 7, 10, 5, $$\infty$$, the optimal solution is 5.

But we still have one problem, that how we express each concrete steps, there are a little bit of a challenge. Please see following $$\Downarrow\Downarrow$$

| $$\infty$$ | 2 | 8 | 9 | **5** | 8 | $$\infty$$ |
| $$\infty$$ | 4 | 4 | 6 | **2** | 3 | $$\infty$$ |
| $$\infty$$ | 5 | 7 | 5 | 6 | **1** | $$\infty$$ |
| $$\infty$$ | 3 | 2 | 5 | **4** | 8 | $$\infty$$ |
| $$\infty$$ | 0 | 0 | 0 | 0 | 0 | $$\infty$$ |

### Step3

I write a javascript code to compute the array

``` javascript
//C is the original Array
var A  =[]
A[0] = new Array()
for(let i = 1;i <= m; i++){
  A[0][i] = 0
}
for(let i = 0; i <= n; i++){
	A[i] = new Array()
  A[i][0] = Infinity
  A[i][m+1] = Infinity
}
for (let i = 1;i <= n; i++){
	for(let j = 1;j <= m; j++){
  	A[i][j] = C[i][j] + Math.min(A[i - 1][j - 1], A[i - 1][j], A[i - 1][j + 1])
  }
}
```

### $$\Rightarrow$$Step4 (solve the above doubt)

this step is to compute the actual path with the smallest cost. refer to this [Doc](http://www.cs.mun.ca/~kol/courses/2711-w08/dynprog-2711.pdf), the idea is to retrace the decisions made when computing the array, the core thinking is retraction, but it's too complex. Refer to [leetcode No.368](https://leetcode.com/problems/largest-divisible-subset/discuss/84006/Classic-DP-solution-similar-to-LIS-O(n2)), we could directly compute the cost by recording the optimal value for previous value at each loop. here is the code.

```javascript
//C is the original Array
var A  =[],
	pre = [],
  index=-1;
A[0] = new Array()
pre = new Array()
for(let i = 1;i <= m; i++){
  A[0][i] = 0
  pre[0][j] = -1
}
for(let i = 0; i <= n; i++){
	A[i] = new Array()
  A[i][0] = Infinity
  A[i][m+1] = Infinity
}
for (let i = 1;i <= n; i++){
	for(let j = 1;j <= m; j++){
  	let minj = j - 1
    minj = A[i - 1][minj] < A[i - 1][j] ? minj : j
    minj = A[i - 1][minj] < A[i - 1][j + 1] ? minj : j + 1
  	A[i][j] = C[i][j] + A[i - 1][minj]
    pre[i][j] = minj
    index = j
  }
}
```

### Summarize

Dynamic programming algorithm has a wide range of application, and in the next few days, I'd like to post some additional content about the application in the Web Develope.

- - -

$$\mathcal{Yukun Yang}$$ at Beijing