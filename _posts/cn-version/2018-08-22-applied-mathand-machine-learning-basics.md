---
title:  "【译】深度学习数学基础"
categories:
  - MachineLearning
tags: 
  - machine learning
  - deep learning
  - applied math
entries_layout: grid
author_profile: true
toc: true
toc_label: "深度学习数学基础"
toc_sticky: true
---
这一部分介绍了理解深度学习所需的基本数学概念，包括线性代数、概率论和数值计算。

## 线性代数

线性代数作为一门数学分支，广泛应用于科学和工程。掌握好线性代数对于我们再去理解和从事机器学习算法特别是深度学习算法相关工作还是很有必要的。

### 标量、向量、矩阵和张量

- 标量是一个单独的数，通常我们会说“$$Let s\in{R}\text{ be the shope of the line}$$”，当定义一个实数标量时；“$$Let n\in{N}\text{ be the number of units}$$”，当定义一个自然数标量时。
- 向量是一列数，通常这样定义一个向量：
  $$x = \left[
  \begin{array}
    x_{1}\\
    x_{2}\\
    \vdots\\
    x_{n}
  \end{array}
  \right] $$
  有时我们需要索引向量中的一些元素。在这种情况下，我们定义一个包含这些元素索引的集合，并且将集合写在脚标处。比如$$S={1,3,6}$$，我们写作$$x_{S}$$，$$x_{-1}$$表示包含除了$$x_{1}$$的所有元素，$$x_{-S}$$表示包含除了$$x_{1}$$，$$x_{3}$$，$$x_{6}$$的所有元素。
- 矩阵可以理解为一个二维数组，通常通过$$\boldsymbol{A}\in{R^{m\times{n}}}$$定义一个矩阵，使用$$A_{i,j}$$来取一个项；同时还有$$\boldsymbol{A}_{:,i}$$
  来表示$$\boldsymbol{A}$$第i行。我没用方括号括起来表示矩阵
  $$x = \left[
  \begin{array}{cc}
    A_{1,1} & A{1,2}\\
    A_{2,1} & A{2,2}\\
  \end{array}
  \right] $$
  有时候，我们需要索引矩阵表达式，而不是单个字母。在这种情况下，我们在表达式后面接下标，但不必将其小写化，比如，$$f(\boldsymbol{A})_{i,j}$$表示函数$$f$$作用在$$\boldsymbol{A}$$上输出的矩阵的$$(i,j)$$元素
- 张量表示超过两维的数组，一般用$$\mathbf{A}$$表示，并写作$$\mathit{A_{i,j,k}}$$

### 相关运算

