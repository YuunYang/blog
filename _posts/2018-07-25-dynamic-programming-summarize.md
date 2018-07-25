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
last_modified_at: 2018-07-25T22:54:00
---

Dynamic programming algorithms is a way to break down the problem into smaller and simpler pieces, that is [we wish to find a solustion to given problem which optimizes some quantity Q of interest](http://www.cs.mun.ca/~kol/courses/2711-w08/dynprog-2711.pdf); like we like to maximize profit or minimize cost.

Like divide-and-conquer algorithm, they will both break down the problem first; the divide-and-conquer algorithm's subproblem is independent, which means the intersection of all those subproblem is empty set, and the union is the problem itself, but different with the follow, DP's subproblem is not independent, because the previous subproblem could have impact on the subsequent steps, and this is the characteristic of those general problems. [**More specifically, it works by creating an array of related but simpler problems, and then finding the optimal value of Q for each of these problems; we calculate the values for the more complicated problems by using the values already calculated for the easier problems**](http://www.cs.mun.ca/~kol/courses/2711-w08/dynprog-2711.pdf). and then I will present this algorithm in 4 steps.

## The thinking of DP algorithm

### Step1

**Describe a array of values that we want to compute**, like the minimize cost; as a example, we compute the minimize of the table below, from bottom to top. how we design the array? each array index represent the optimum solution of corresponding row, for instance the solution of line 4 (or the line 1 from top to bottom) is *`array[4]`*, and we can compute the accurate answer is *`array[4][4]`* (4 -> 1 -> 2 -> 5 is the minimum sum). This is two dimensional array, we can also use just on dimensional, refer to [Leetcode No.120](https://leetcode.com/problems/triangle/discuss/38730/DP-Solution-for-Triangle).

| 2 | 8 | 9 | **5** | 8 |
| 4 | 4 | 6 | **2** | 3 |
| 5 | 7 | 5 | 6 | **1** |
| 3 | 2 | 5 | **4** | 8 |

### step2

waiting...