---
title: "使用Tensorflow构建LSTM模型"
categories:
  - MachineLearning
tags: 
  - 论文
  - RNN
  - LSTM
  - Machine Learning
  - Tensorflow
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---
本篇依然是译作，译自[https://adventuresinmachinelearning.com/recurrent-neural-networks-lstm-tutorial-tensorflow/](https://adventuresinmachinelearning.com/recurrent-neural-networks-lstm-tutorial-tensorflow/)

可以先回顾一下 LSTM 单元的基本结构[http://colah.github.io/posts/2015-08-Understanding-LSTMs/](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)

## 减少梯度消失问题
回想一下，普通递归神经网络的问题是计算梯度以更新权重涉及级联术语，如：

$$\frac{\partial\text{h}_n}{\partial\text{h}_{n-1}}\frac{\partial\text{h}_{n-1}}{\partial\text{h}_{n-2}}\frac{\partial\text{h}_{n-2}}{\partial\text{h}_{n-3}}\cdots$$

这里有一个问题，因为存在于上述所有偏导数中的sigmoid导数<0.25（通常非常大）。还有一个涉及权重的因子，因此如果它们始终<1，我们将会得到相似的结果 —— 也就是梯度消失。

在 LSTM 单元中，LSTM单元的内部状态的复发性涉及一个加法 —— 下所示：

$$s_t=s_{t-1}\circ f + g\circ i$$

如果我们像上面对普通循环神经网络那样采用这种重复性的偏导数，我们发现如下：

$$\frac{\partial s_t}{\partial s_{t-1}} = f$$

请注意，$$g\circ i$$消失了，我们只是重复乘$$f$$。因此，对于三个时间步，我们会有
$$fxfxf$$。请注意，如果有输出$$f=1$$，则不会出现梯度衰减。通常，在训练开始时，$$f$$中的sigmoid的偏差变大，以便$$f$$从1开始，这意味着所有过去的输入状态将在单元格中被“记住”。在训练期间，遗忘门将减少或消除状态$$s_{t-1}$$的某些组件的记忆。

这可能有点令人困惑，所以在我们在继续下一步之前先解释另一种方式。想象一下，如果我们在第一个时间步让单个输入进入，但是我们阻止所有后续的输入（通过将输入门设置为输出零）并记住所有先前的状态（通过将忘记门设置为输出门）。我们设置一个$$s_t$$的循环存储，它永远不会衰变，即st = st-1。“进入”此循环的反向传播错误也永远不会衰减。然而，对于普通递归神经网络，如果我们做同样的事情，我们的反向传播误差将会被隐藏节点激活函数的梯度连续降级，并因此最终衰减为零。

希望这有助于你至少能部分地理解为什么LSTM单元是消除梯度问题的一个很好的解决方案，也是为什么它们目前能被如此广泛地使用。现在，到目前为止，我们一直在处理LSTM单元格中的数据，就像它们是单个的值（即标量）一样，但实际上，它们是张量或向量，这可能也会让人感到困惑。因此，在下一节中，我将花一点时间来解释我们可以想到的在展开的LSTM网络中流动的张量大小。
## LSTM单元内的数据维度
在下面将讨论的示例代码中，我们将进行文本预测。现在，如在先前关于Word2Vec算法的教程中所讨论的，使用有意义的单词向量将单词输入到神经网络中，即单词“cat”可以由例如长度为650的向量表示。该向量以捕获单词含义的某些方面的方式编码（其中含义通常被解释为在该单词中找到的上下文）。因此，输入到我们下面LSTM网络中的每个字都将是650长度向量。接下来，因为我们将在我们展开的LSTM网络中输入一系列单词，对于每个输入行，我们将输入这些单词向量中的35个。因此每行的输入大小为（35 x 650）。最后，使用TensorFlow，我们可以通过多维张量处理批量数据（要了解有关基本TensorFlow的更多信息，请参阅此[TensorFlow教程](https://adventuresinmachinelearning.com/python-tensorflow-tutorial/)）。如果我们的批量大小为20，我们的训练输入数据将变为（20 x 35 x 650）。为了将来参考，我在这里提出张量大小的方式（即（20 x 35 x 650））被称为“批量 - 主要”排列，其中批量大小是张量的第一维。我们也可以选择以“时间 - 主要”格式排列数据，这将是（35 x 20 x 650） —— 相同的数据，只是一个不同的排列。

现在，接下来要考虑的是输入，遗忘和输出门以及内部状态变量$$s_t$$和压缩函数中的每一个都不是具有单个/标量权重的单个函数。相反，它们构成了神经网络的隐藏层，因此包括多个节点，连接权重，偏差值等。由我们来设置隐藏层的大小。因此，展开的LSTM网络的输出将包括隐藏层的大小。展开的LSTM网络的输出大小为650隐藏层，长度为20的批量大小和35个时间步长——（20,35,650）。通常，展开的LSTM的输出将被部分展平并馈送到softmax层以进行分类 —— 因此，例如，张量的前两个维度被平坦化以给出softmax层输入大小（700,650）。然后，softmax的输出与训练期间的预期训练输出相匹配。下图显示了所有这些：
[LSTM network architecture][01]{:. align-center}

[01]: yuunyang.github.io/assets/images/2019-04-27-build-LSTM-model-using-tf/01.png