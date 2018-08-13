---
title:  "Concrete Math Reading Notes(01)"
categories:
  - reading-notes
  - ConcreteMath
tags: 
  - math
  - recurrent problems
  - the tower of hanoi
  - lines in the plane
  - the josephus problem
toc: true
toc_label: "Concrete Math"
toc_sticky: true
---
*`A Foundation for Computer Science`*

In this part, I'd like to write a serial reading notes about `Concrete Math`, and I will record my thought and understanding about this book.

And in this section, I read the chapter one of `Concrete Math`, and this chapter explores three recurrent problems, and gives some magic on how to solve those question.

## THE TOWER OF HANOI

`The tower of hanoi was invented by French mathematician Edouard Lucas in 1883, and we are given raise your hand a tower of eight disks, initially stacked in decreasing size on one of three pegs. The objective is to transfer the entire tower to one of the other pegs, moving only one disk at a time and never moving a larger one onto a smaller`

### Thinking1

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

### Thinking2

`Again we start by looking at small cases`, so for Line 0, 1, 2 we can get the answer here:

![01 pic][01 pic]{: .align-center}

So we get the formula is $$L_{n}=2^{n}$$? because every new line doubles the number of regions, but the author told us its wrong, if we reflect on this problem, analyze every new line, we find that each line can split split an old region in at most two pieces, `A straight line can split a convex region into at most two new regions, which will also be convex`.

![02 pic][02 pic]{: .align-left} Add the third line, and we can analyze more clearly. 

`The nth line increases the number of regions by k if and only if it splits k of the old regions`, because each line can only spilt one region into two region; `and it splits k old regions if and only if it hits the previous lines in k − 1 different places`, because each k line can split one region into k+1 region; Therefore the new line can intersect the n−1 old lines in at most n−1 different points, and we must have $$k\leqslant{n}$$

$$\begin{cases}
L_{0} = 0 \\[2ex]
L_{n} = L_{n-1} + n & \text{for n > 0}
\end{cases}$$

It's easy to guess and compute the formula, but let's thinking in recursive: 

$$\begin{align}
L_{n} & = L_{n-1}\text{ + n}  \\
 & = L_{n-2}\text{ + (n-1) + n} \\
 & = L_{n-3}\text{ + (n-2) + (n-1) + n} \\
 & \vdots \\
 & = L_{0}\text{ + 1 + 2 + }\cdots\text{ + (n − 2) + (n − 1) + n} \\
 & = 1 + \sum_{i=1}^n i
\end{align}$$

Because $$\sum_{i=1}^n i$$ equal to $$\frac{n(n+1)}{2}$$, so $$L_{n}=1+\frac{n(n+1)}{2}$$, we got the "close forms" formula.

### More?

Now, support we use bent lines which contains one "zig":![03 pic][03 pic]{: .align-center} We see $$Z_{1}=2$$ and $$Z_{2}=7$$, because each line is bent line, we realize that a bent line is like two straight lines except that regions merge when the "two" lines don't extend past their intersection point.

![04 pic][04 pic]{: .align-right}Thinking if this "two" line beyond their intersection point, we got two more regions, actually we can find that, every time we beyond each intersection, we change one region into three, means we got two, so:

$$\begin{align}
Z_{n} & = L_{2n}\text{ - 2n} = \frac{2n(2n + 1)}{2} + 1 − 2n  \\
 & = 2n^{2} − n + 1, & n\leqslant0 \\
\end{align}$$

### Magic2

**Thinking small is important** we got the answer quickly by doing some tricks? maybe sometimes we are true, but along with the complication of problems the answer always wrong, more thing we should do is to find the relationships between one case and two case, and then find the recurrent function, and this is why told those problem a recurrent problem.

## THE JOSEPHUS PROBLEM

[01 pic]: /assets/images/2018-08-02-ConcreteMath-reading-notes(01)/01.png
[02 pic]: /assets/images/2018-08-02-ConcreteMath-reading-notes(01)/02.png
[03 pic]: /assets/images/2018-08-02-ConcreteMath-reading-notes(01)/03.png
[04 pic]: /assets/images/2018-08-02-ConcreteMath-reading-notes(01)/04.png