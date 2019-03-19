---
title:  "回溯法"
categories:
  - summarize
tags: 
  - backtracking
  - algorithm
  - leetcode
author_profile: true
toc: true
toc_label: "回溯法"
toc_sticky: true
---
`递归回溯法是解决问题的算法技术通过渐进式地试图建立一个解决方案,一次一片,去除那些解决方案无法满足的约束问题在任何时间(时间,是指时间直到达到搜索树的任何级别)。例如，考虑数独问题，我们尝试一个一个地填充数字。每当我们发现当前的数字不能导致一个解决方案，我们删除它(回溯)，并尝试下一个数字。这比单纯的方法(生成所有可能的数字组合，然后一个接一个地尝试每个组合)要好，因为无论何时回溯，它都会抛出一组排列。`