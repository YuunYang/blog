---
layout: post
title:  "Concrete Math Reading Notes(01)"
date:   2018-08-02
categories:
  - reading-notes
  - ConcreteMath
tags: 
  - math
  - recurrent problems
  - the tower of hanoi
  - lines in the plane
  - the josephus problem
author: yyk
taxonomy: articles
entries_layout: grid
# last_modified_at: 2018-08-02T13:00:00
---
*`A Foundation for Computer Science`*

In this part, I'd like to write a serial reading notes about `Concrete Math`, and I will record my thought and understanding about this book.

And in this section, I read the chapter one of `Concrete Math`, and this chapter explores three recurrent problems, and gives some magic on how to solve those question.

## THE TOWER OF HANOI

`The tower of hanoi was invented by French mathematician Edouard Lucas in 1883, and we are given raise your hand a tower of eight disks, initially stacked in decreasing size on one of three pegs. The objective is to transfer the entire tower to one of the other pegs, moving only one disk at a time and never moving a larger one onto a smaller`

### Thinking

It is not easily obvious that this is a recurrent problem, if we didn't meet before. `The best way to tackle a question like this is to generalize it a bit`, we are not easy to find the regularity of this problem, but we can immediately see how to transfer the tower that contains only one or two disk, and then three. Using `look at small cases` strategy, we see $$T_{1}=1$$, $$T_{2}=3$$ and $$T_{3}=7$$

`But now let's change our perspective and try to think big`, experiments with three disks, this gives us a clue for transferring n disks in general: We first transfer the n − 1 smallest to a different peg, then move the largest, and finally transfer the n−1 smallest back onto the largest. How we verify our answer? First we can analyze from the problem itself, because the largest disk must be move, so the n - 1 smallest disks must move to a single peg before this, which cost $$T_{n-1}$% moves, and then transfer the n−1 smallest disks back onto the largest, require $$T_{n-1}$% moves. so we can confirm the formula is that: 

$$\begin{cases}
T_{0} = 0 \\[2ex]
T_{n} = 2T_{n-1} + 1 & \text{for n > 0}
\end{cases}$$

And also, if we have enough time, we can compute that: $$T_{3} = 2·3 + 1 = 7$$; $$T_{4} = 2·7 + 1 = 15$$; $$T_{5} = 2·15 + 1 = 31$$; $$T_{6} = 2·31 + 1 = 63$$, so it certainly looks right, at least for $$n\leqslant6$$

**`Mathematical induction` is a general way to prove that some statement about the integer n is true for all $$n>n_{0}$$**. Since $$T_{0} = 2^{0} − 1 = 0$$. And the induction follows for n > 0 if we assume that holds when n is replaced by n − 1:

$$T_{n} = 2T_{n−1} + 1 = 2(2^{n−1} − 1) + 1 = 2^{n} − 1$$

But usually it is not easy to find the formula, our analysis of the Tower of Hanoi led to the correct answer, but it
required an `inductive leap`, we relied on a lucky guess about the answer, if we look at that recurrence, we can add 1 to both sides of equations: 

$$\begin{cases}
T_{0} + 1 = 1 \\[2ex]
T_{n} + 1 = 2T_{n-1} + 2 & \text{for n > 0}
\end{cases}$$

We let $$U_{n}=T_{n} + 1$$:

$$\begin{cases}
U_{0} = 0 \\[2ex]
U_{n} = UT_{n-1} & \text{for n > 0}
\end{cases}$$

And It doesn't take genius to discover that the solution to this recurrence is just $$U_{n} = 2^{n}$$; hence $$T_{n} = 2^{n} − 1$$. Even a computer could discover this.

### Magic

Usually it always not easy to find the recurrence formula of a recurrence problem, so we should use recurrence thinking, and also we could find some magic to simplify the recurrence, and then we can immediately find the answer we want, `Think Small`, then `Think Big` and also need `think different`

## LINES IN THE PLANE

`How many slices of pizza can a person obtain by making n straight cuts with a pizza knife? Or, more academically: What is the maximum number Ln of regions dened by n lines in the plane`