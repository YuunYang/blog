---
title:  "LeetCode 85. Maximal Rectangle"
categories:
  - summarize
tags: 
  - algorithm
  - leetcode
  - dynamic problem
entries_layout: grid
author_profile: true
toc: true
toc_label: "Maximal Rectangle"
toc_sticky: true
---

This problem is a very hard problem, and I spend a lot of time to understand it. Im afraid someday may forgot the solution, so decide to record it.

## description

[85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/)

degree of difficulty: \color{red}{Hard}

*Given a 2D binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.*
    
    Example:
    Input:
    [
      ["1","0","1","0","0"],
      ["1","0","1","1","1"],
      ["1","1","1","1","1"],
      ["1","0","0","1","0"]
    ]
    Output: 6

## solution

First of all, why it is a DP problem? and if it is a DP, how we can find the formal of this problem, actually I have no idea, and even after reading the answer, I still very confusing, I really spent a lot of energy to understand it.

It is a DP problem, because, when we using **height[i]** record the current number of continuous '1' in column i; **left[i]** record the left most index j which satisfies that for any index k from j to  i, height[k] >= height[i], which means that for **every** j -> i, the height[i] is the **minimum one**; **right[i]** record the right most index j which satisfies that for any index k from i to  j, height[k] >= height[i], which means that for **every** i -> j, the height[i] is the **minimum one**; I misunderstand it for a long time. last the maximum of height[i] * (right[i] - left[i] + 1) be the answer.

Why should we use this definition? because it represent the max size of a rectangle of current height, it can make sure that we are computing a rectangle not another shape.

## code

```cpp
class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0] == null || matrix[0].length == 0) return 0;
        int m = matrix.length, n = matrix[0].length, maxArea = 0;
        int[] left = new int[n];
        int[] right = new int[n];
        int[] height = new int[n];
        Arrays.fill(right, n - 1);
        for (int i = 0; i < m; i++) {
            int rB = n - 1;
            for (int j = n - 1; j >= 0; j--) {
                if (matrix[i][j] == '1') {
                    right[j] = Math.min(right[j], rB);
                } else {
                    right[j] = n - 1;
                    rB = j - 1;
                }
            }
            int lB = 0;
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    left[j] = Math.max(left[j], lB);
                    height[j]++;
                    maxArea = Math.max(maxArea, height[j] * (right[j] - left[j] + 1));
                } else {
                    height[j] = 0;
                    left[j] = 0;
                    lB = j + 1;
                }
            }
        }
        return maxArea;
    }
}
```