---
title: "RNN与LSTM的理解"
categories:
  - MachineLearning
tags: 
  - 论文
  - RNN
  - LSTM
  - Machine Learning
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---

{:refdef .cite data-title="Søren Kierkegaard, Journals"}
Life can only be understood backwards; but it must be lived forward.
{: refder}

只有向后看才能理解生活；但要生活好，则必须向前看。对于人工智能算法而言，如果能够从之前的数据中学习，那么算法也可以很优秀的向前预测。

## RNN
人们没有一秒钟不在从头思考。正如当你阅读这篇文章，你会根据你对之前单词的理解来理解每个单词。你不会扔掉所有的东西然后再一次从头思考。你的思考是具有一个持久性的。

传统的神经网络是不能做到的，这似乎是其的主要短板。例如，如果你想要对电影中每个点发生的事件进行分类。传统的算法是不能通过之前的事件来推理后续的结果的。

循环神经网络解决了这个问题。在其网络中，有一个循环，允许信息一直保存其中。

![Recurrent Neural Networks have loops.][01]{: .align-center}

在上面的图中，A —— 一堆神经网络，接受一些输入$$\text{x}_t$$并且输出一个值$$\text{h}_t$$。循环允许信息从网络的一个步骤传递到下一个步骤。

这些循环使得循环神经网络看起来有点神秘。然而，如果你再多思考一点，事实证明它们与普通的神经网络并没有什么不同。可以将循环神经网络视为同一网络的多个副本，每个副本都将消息传递给后继者。考虑一下如果我们展开循环会发生什么：

![An unrolled recurrent neural network.][02]{: .align-center}

这种类似链的性质表明，递归神经网络与序列和列表密切相关。它们是用于此类数据的神经网络的自然架构。

它们是肯定会被使用的，在过去的几年里，有很多RNN被广泛应用的案例：语音识别，语言模型，翻译，图像识别...等等。我们将讨论可以使用RNNs可以实现的一些牛X的功能，还有Andrej Karpathy的优秀博客[回归神经网络的不合理有效性](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)。但他们真的很棒。

这些案例的成功使用的关键是“LSTMs”，一个非常特殊的回归神经网络，对于许多任务而言，它比标准版本的RNNs好得多。几乎所有基于递归神经网络中令人兴奋的成果都是用它们实现的。这篇文章将探讨这里所说的LSTM。
## 长期依赖问题
RNNs一个吸引点就是它们可能会将先前的信息连接到当前的任务，例如使用先前视频帧也许可以告知对当前帧的理解。如果RNNs可以完成这样的操作，它们将会非常有用。但它们真的可以吗？这得看情况。

有时候，我们只需要观察最近的信息来执行当前的任务。例如，思考一下，在一个语言模型中，我们会基于前一个单词来尝试预测下一个单词。如果我们尝试预测“the clouds are in the *sky*,”的最后一个单词，我们不需要之前的所有内容 —— 我们很清楚下一个单词是`sky`。在这种情况下，相关信息与我们需要所处的位置之间的距离很小，RNNs就可以学习使用之前的信息了。

![RNN short term dependencies][03]{: .align-center}

但是也有一些案例需要我们有更多的上下文。思考一下，尝试预测“I grew up in France… I speak fluent *French*.”的最后一个单词，最近的信息提示我们下一个单词可能会是一种语言的名字，但是如果想把范围缩小到具体的语言，我们则需要进一步找到上下文中的`France`。相关信息与需要所处的位置之间的距离变得非常大是完全可能的。

不幸的是，随着距离的拉大，RNNs会无法学习连接信息。

![RNN long term dependencies][04]{: .align-center}

理论上，RNNs完全有能力处理这类“long-term dependencies”问题。人类可以仔细的挑选参数来解决这类小儿科的问题。然而在实际应用中，RNNs似乎很难学习他们。[Hochreiter (1991) [德国]](http://people.idsia.ch/~juergen/SeppHochreiter1991ThesisAdvisorSchmidhuber.pdf)和[Bengio, et al. (1994)](http://www-dsi.ing.unifi.it/~paolo/ps/tnn-94-gradient.pdf)对其进行了深入的研究，并且找到了为什么会很难的一些根本的原因。

不过值得庆幸的是，LSTM没有这方面的问题！
## LSTM网络


[01]:/assets/images/2019-04-18-RNN-and-LSTM/01.png
[02]:/assets/images/2019-04-18-RNN-and-LSTM/02.png
[03]:/assets/images/2019-04-18-RNN-and-LSTM/03.png
[04]:/assets/images/2019-04-18-RNN-and-LSTM/04.png
[05]:/assets/images/2019-04-18-RNN-and-LSTM/05.png
[06]:/assets/images/2019-04-18-RNN-and-LSTM/06.png
[07]:/assets/images/2019-04-18-RNN-and-LSTM/07.png
[08]:/assets/images/2019-04-18-RNN-and-LSTM/08.png
[09]:/assets/images/2019-04-18-RNN-and-LSTM/09.png
[10]:/assets/images/2019-04-18-RNN-and-LSTM/10.png
[11]:/assets/images/2019-04-18-RNN-and-LSTM/11.png
[12]:/assets/images/2019-04-18-RNN-and-LSTM/12.png
[13]:/assets/images/2019-04-18-RNN-and-LSTM/13.png
[14]:/assets/images/2019-04-18-RNN-and-LSTM/14.png
[15]:/assets/images/2019-04-18-RNN-and-LSTM/15.png