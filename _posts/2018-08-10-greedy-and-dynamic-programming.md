---
title:  "Greedy and Dynamic Programming"
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
toc_label: "Greedy and Dynamic Programming"
---

This is a problem comes from stack overflow.

What is the main difference between dynamic programming and greedy approach in terms of usage?
As far as I understood, the greedy approach sometimes gives an optimal solution; in other cases, the dynamic programming approach gives an optimal solution.
Are there any particular conditions which must be met in order to use one approach (or the other) to obtain an optimal solution?

Based on Wikipedia's articles.

## Greedy Approach

A greedy algorithm is an algorithm that follows the problem solving heuristic of making the locally optimal choice at each stage with the hope of finding a global optimum. In many problems, a greedy strategy does not in general produce an optimal solution, but nonetheless a greedy heuristic may yield locally optimal solutions that approximate a global optimal solution in a reasonable time.

We can make whatever choice seems best at the moment and then solve the subproblems that arise later. The choice made by a greedy algorithm may depend on choices made so far **but not on future choices or all the solutions to the subproblem**. It iteratively makes one greedy choice after another, reducing each given problem into a smaller one.

## Dynamic programming
The idea behind dynamic programming is quite simple. In general, to solve a given problem, we need to solve different parts of the problem (subproblems), **then combine the solutions of the subproblems to reach an overall solution**. Often when using a more naive method, many of the subproblems are generated and solved many times. The dynamic programming approach seeks to solve each subproblem **only once**, thus reducing the number of computations: once the solution to a given subproblem has been computed, it is stored or "memo-ized": the next time the same solution is needed, it is simply looked up. This approach is especially useful when the number of repeating subproblems grows exponentially as a function of the size of the input.

## Difference
Greedy choice property
We can make whatever choice seems best at the moment and then solve the subproblems that arise later. The choice made by a greedy algorithm may depend on choices made so far but not on future choices or all the solutions to the subproblem. It iteratively makes one greedy choice after another, reducing each given problem into a smaller one. In other words, a greedy algorithm never reconsiders its choices.

This is the main difference from dynamic programming, which is exhaustive and is guaranteed to find the solution. After every stage, dynamic programming makes decisions based on all the decisions made in the previous stage, and may reconsider the previous stage's algorithmic path to solution.

For example, let's say that you have to get from point A to point B as fast as possible, in a given city, during rush hour. A dynamic programming algorithm will look into the entire traffic report, looking into all possible combinations of roads you might take, and will only then tell you which way is the fastest. Of course, you might have to wait for a while until the algorithm finishes, and only then can you start driving. The path you will take will be the fastest one (assuming that nothing changed in the external environment).

On the other hand, a greedy algorithm will start you driving immediately and will pick the road that looks the fastest at every intersection. As you can imagine, this strategy might not lead to the fastest arrival time, since you might take some "easy" streets and then find yourself hopelessly stuck in a traffic jam.

## Some other details...
In mathematical optimization, greedy algorithms solve combinatorial problems having the properties of [matroids](https://en.wikipedia.org/wiki/Matroid).

Dynamic programming is applicable to problems exhibiting the properties of overlapping subproblems and optimal substructure.

## [stackoverflow](https://stackoverflow.com/questions/16690249/what-is-the-difference-between-dynamic-programming-and-greedy-approach)