---
title: "Cycle detection"
categories:
  - summarize
tags:
  - algorithm
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---
在计算机科学中，循环检测（Cycle detection）用来在迭代函数值序列中查找循环的算法，即检查环。

## 简述
对于任何将有限集$$\text{S}$$映射到自身的函数 $$\text{f}$$，以及任意初始值$$x_0$$，迭代函数值的序列为：

$$x_0,x_1=f(x_0),x_2=f(x_1),\dots,x_i=f(x_\text{i-1}),\dots$$

最后必须使用两次相同的值的情况：必定存在一对不同的索引 i 和 j ，使得$$x_i = x_j$$。如果这种情况出现，则序列必定周期性继续，通过重复$$x_i$$到$$x_{j-1}$$的相同值序列。循环检测算法就是寻找 i 和 j 的算法。

### Floyd 算法（龟兔算法）
这个 Floyd 算法不是那个求最短路径算法，这里说的 Floyd 算法又称为 龟兔算法（tortoise and hare algorithm）。

龟兔算法是一类 two pointer 算法，通过设置快慢指针来遍历一个序列值环（一般是龟走一步，兔走两步），直到他们指向相同的值。该算法将两个指针保持在给定的序列中，一个指针位于$$x_i$$处，另一个指针（兔）位于$$x_{2i}$$处。在算法的每个步骤中，它将i加1，将乌龟向前移动1步，将兔子向前移动2步，然后在这两个指针处比较序列值。乌龟和野兔指向相等值的i> 0的最小值是期望值ν。

> 龟兔算法的核型要义

在一串序列中，如果存在环，那么必定存在对于任意的整数 $$i \geqslant μ and k \geqslant 0, x_i = x_{i+kλ}$$，其中 λ 为找到时循环的长度（不是次数），而 μ 则是这个循环中第一个值的索引，也就是说，经过 λ 次循环，龟兔相遇。基于这些，我们可以证明，对于某些 k，当且仅当$$x_i=x_{2i}$$时有 $$i = kλ\geqslantμ$$。因此，这个算法仅仅只需要检查这种特殊形式的重复值，即距序列起始点距离另一端两倍的距离，即可找到重复的周期v，该周期为 λ 的倍数。一旦 v 找到，这个算法则会回溯这个序列，来找到序列中第一个重复的值 $$x_μ$$，因为 λ 可以整除 v，因此 $$x_μ=x_{μ+v}$$。最后，一旦 μ 的值知道了，通过搜索$$x_μ+λ$=x_μ$的第一个位置μ+λ来找到最短重复周期的长度λ是很简单的。

手写解释：

![手写解释](/assets/2020-01-18-cycle-detection/01.png){: .align-center}

## Kth Largest Element in an Array
[287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)
### description
degree of difficulty: $$\color{#ef6c00}{medium}$$

_Given an array nums containing n + 1 integers where each integer is between 1 and n (inclusive), prove that at least one duplicate number must exist. Assume that there is only one duplicate number, find the duplicate one._

_We are given a string S of '0's and '1's, and we may flip any '0' to a '1' or a '1' to a '0'._

_Return the minimum number of flips to make S monotone increasing._

Example 1:

    Input: [1,3,4,2,2]
    Output: 2

Example 2:

    Input: [3,1,3,4,2]
    Output: 3

**Note:**

1.  You must not modify the array (assume the array is read only).
2.  You must use only constant, O(1) extra space.
3.  Your runtime complexity should be less than O(n2).
4.  There is only one duplicate number in the array, but it could be repeated more than once.

### solution
[My easy understood solution with O(n) time and O(1) space without modifying the array. With clear explanation.](https://leetcode.com/problems/find-the-duplicate-number/discuss/72846/My-easy-understood-solution-with-O(n)-time-and-O(1)-space-without-modifying-the-array.-With-clear-explanation.)

> 题解代码

```cpp
int findDuplicate3(vector<int>& nums)
{
	if (nums.size() > 1)
	{
		int slow = nums[0];
		int fast = nums[nums[0]];
		while (slow != fast)
		{
			slow = nums[slow];
			fast = nums[nums[fast]];
		}

		fast = 0;
		while (fast != slow)
		{
			fast = nums[fast];
			slow = nums[slow];
		}
		return slow;
	}
	return -1;
}
```


讲道理，算法写起来很简单，但要理解其中原因我觉得没有第一次理解还是比较难的。

> 结合讨论和我的理解

在第一次循环中，快慢两个指针依次向前，当他们相遇时可以保证在环内，这是龟兔算法得出来的结论。


假设慢指针走了 s 步，则快指针走了 2s 步，环长度为 c，则一定有 $$2s = s + n\times{c}$$，也就是$$s=n\times{c}$$。然后在假设从起始点到环入口的长度为x，环入口到相遇点的长度为a，则一定有s=x+a（因为s就表示从起始点到相遇点的长度）。


根据上面的等式可以有：

$$\begin{cases}
x+a = s = n\times{c} \\
=> x+a = n\times{c} \\
=> x+a = (n-1)\times{c}+c \\
=> x = (n-1)\times{c}+c-a
\end{cases}$$

其中经过c - a步之后，点恰好可以从相遇点回到环的起点，因此，而后面的(n-1)*c步则相当于转了n-1个圈还是回到起点，所以算法中的第二个循环最后一定相遇于起点。
