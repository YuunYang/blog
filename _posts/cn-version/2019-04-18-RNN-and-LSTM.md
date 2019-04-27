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
长期短期记忆网络 —— 通常简称 “LSTMs” —— 一种特殊的RNN，可以用来学习长期依赖。它们是由[Hochreiter & Schmidhuber (1997)](http://www.bioinf.jku.at/publications/older/2604.pdf)提出的。然后由很多人在后续的工作中优化和推广。它们在很多问题中都表现的非常好，如今也被广泛应用。

LSTMs是明确设计避免长期依赖问题的。能够长时间的记住信息实际上是他们的默认行为，而不是很难去实现的功能！

所有的循环神经网络都具有神经网络重复模块链的形式。在标准的RNNs中，这些重复的模块会是一些非常简单的结构，一个单个的`tanh`层。

![The repeating module in a standard RNN contains a single layer.][05]{: .align-center}

LSTMs同样会有这样的类链式结构，但其中重复模块具有不同的结构。其中有四个，而不是一个神经网络层，并以一种非常特殊的方式进行交互。

![LSTM chain][06]{: .align-center}

不要担心具体的实现的细节。我们将逐步介绍LSTM图。现在，我们先简单看一下接下来会用到的符号。

![LSTM notation][07]{: .align-center}

在上面的图中，每一行都携带一个整个向量，从一个节点的输出到其他节点的输入。粉红圆圈代表逐点操作，类似向量加法，而黄色框是学习神经网络层。两条线合并代表级联，而行分叉表示其内容被复制，副本将转移到不同的位置。

## LSTMs背后的核心理念
LSTMs的关键是cell状态，水平线贯穿图的顶部。

cell状态有点类似于一个传送带。它贯穿整个链式，只有一些次要的线性交互。信息很容易会沿着它不变的流动：

![LSTM C line][08]{: .align-center}

LSTM能够移除或添加信息到cell状态，由称为`gates`的结构精密调控。

`Gates`是一种可选择通过信息的方式。它们由sigmoid（S形）神经网络层和逐点乘法运算组成。

![LSTM gate][09]{: .align-center}

sigmoid层输出一个介于0-1之间的数字，用于描述每个组件应该通过多少。0表示“不允许任何通过”，1表示“允许所有通过”。一个LSTM有三种这样的`gates`，来保护和控制cell状态。
## LSTM渐进理解
我们LSTMs中的第一步是决定哪一些信息我们需要将其从cell状态中去除。这是由叫“遗忘门层”的sigmoid层所决定的。它会观察$$h_\text{t-1}$$和$$x_t$$并且为在cell状态$$\text{C}_\text{t-1}$$中的每一个数字再输出一个介于0到1之间的数字。其中1代表“全部保留”，0代表“完全舍去”。

回到之前语言模型的例子中，我尝试基于之前所有的单词来预测下一个单词。在这样一个问题中，cell状态可能包含当前主体的性别，以便可以使用正确的代词。当我们发现一个新的主体时，我们又希望忘记之前主体的性别。

![LSTM focus][10]{: .align-center}

下一步是决定我们要在cell状态中存储哪些新的信息。这其中分为两部分。第一，一个叫“输入门层”的sigmoid层将决定哪些值我们将会更新。接下来，tanh层创建新候选值的向量，$$\bar{\text{C}_t}$$，这些可以被添加到状态中。在下一步中，我们将结合这两个来创建状态更新。在接下来的一步里，我们将结合上面两点来为状态创建一个更新。

在我们语言模型的例子中，我们希望为cell状态增加一个新主体的性别，来代替我们之前旧版本

![LSTM focus-i][11]{: .align-center}

现在，是时候更新旧的cell状态$$C_\text{t-1}$$更新到新的cell状态$$C_\text{t}$$。先前的步骤已经决定了该做什么，现在我们照做就行了。

我们将旧的状态乘$$f_\text{t}$$，来忘记我们之前决定忘记的东西。然后加上$$i_t * \bar{\text{C}_t}$$。这就是成了新的候选值，根据我们决定更新的每个状态的值来缩放。

在语言模型的例子中，正如我们在前面的步骤中所做的那样，这就是我们实际上放弃旧主体性别信息并添加新信息的地方。

![LSTM focus-C][12]{: .align-center}

最后，我们需要决定我们将输出什么。输出将取决于我们的cell状态，但将会是一个过滤的版本。首先，我们运行一个sigmoid层用来决定我们将输出cell状态的哪些部分。然后，我们将cell状态置于tanh（将值转化成-1到1之间）然后与sigmoid门的输出相乘，以便我们只输出我们决定输出的部分。

回到语言模型的例子，因为只看到了一个主体，我们可能想要输出一些与动词相关的信息，以防我们后续会发生一些动作。例如，它可能输出主语是单数还是复数，以便我们知道动词应该以什么形式共轭，如果有的话。

![LSTM focus-o][13]{: .align-center}

## Variants on Long Short Term Memory
What I’ve described so far is a pretty normal LSTM. But not all LSTMs are the same as the above. In fact, it seems like almost every paper involving LSTMs uses a slightly different version. The differences are minor, but it’s worth mentioning some of them.

One popular LSTM variant, introduced by Gers & Schmidhuber (2000), is adding “peephole connections.” This means that we let the gate layers look at the cell state.

![LSTM var peepholes][14]{: .align-center}

The above diagram adds peepholes to all the gates, but many papers will give some peepholes and not others.

Another variation is to use coupled forget and input gates. Instead of separately deciding what to forget and what we should add new information to, we make those decisions together. We only forget when we’re going to input something in its place. We only input new values to the state when we forget something older.

![LSTM var tied][15]{: .align-center}

A slightly more dramatic variation on the LSTM is the Gated Recurrent Unit, or GRU, introduced by Cho, et al. (2014). It combines the forget and input gates into a single “update gate.” It also merges the cell state and hidden state, and makes some other changes. The resulting model is simpler than standard LSTM models, and has been growing increasingly popular.

![LSTM var GRU][16]{: .align-center}

These are only a few of the most notable LSTM variants. There are lots of others, like Depth Gated RNNs by Yao, et al. (2015). There’s also some completely different approach to tackling long-term dependencies, like Clockwork RNNs by Koutnik, et al. (2014).

Which of these variants is best? Do the differences matter? Greff, et al. (2015) do a nice comparison of popular variants, finding that they’re all about the same. Jozefowicz, et al. (2015) tested more than ten thousand RNN architectures, finding some that worked better than LSTMs on certain tasks.
## Conclusion
Earlier, I mentioned the remarkable results people are achieving with RNNs. Essentially all of these are achieved using LSTMs. They really work a lot better for most tasks!

Written down as a set of equations, LSTMs look pretty intimidating. Hopefully, walking through them step by step in this essay has made them a bit more approachable.

LSTMs were a big step in what we can accomplish with RNNs. It’s natural to wonder: is there another big step? A common opinion among researchers is: “Yes! There is a next step and it’s attention!” The idea is to let every step of an RNN pick information to look at from some larger collection of information. For example, if you are using an RNN to create a caption describing an image, it might pick a part of the image to look at for every word it outputs. In fact, Xu, et al. (2015) do exactly this – it might be a fun starting point if you want to explore attention! There’s been a number of really exciting results using attention, and it seems like a lot more are around the corner…

Attention isn’t the only exciting thread in RNN research. For example, Grid LSTMs by Kalchbrenner, et al. (2015) seem extremely promising. Work using RNNs in generative models – such as Gregor, et al. (2015), Chung, et al. (2015), or Bayer & Osendorfer (2015) – also seems very interesting. The last few years have been an exciting time for recurrent neural networks, and the coming ones promise to only be more so!

## Acknowledgments
I’m grateful to a number of people for helping me better understand LSTMs, commenting on the visualizations, and providing feedback on this post.

I’m very grateful to my colleagues at Google for their helpful feedback, especially Oriol Vinyals, Greg Corrado, Jon Shlens, Luke Vilnis, and Ilya Sutskever. I’m also thankful to many other friends and colleagues for taking the time to help me, including Dario Amodei, and Jacob Steinhardt. I’m especially thankful to Kyunghyun Cho for extremely thoughtful correspondence about my diagrams.

Before this post, I practiced explaining LSTMs during two seminar series I taught on neural networks. Thanks to everyone who participated in those for their patience with me, and for their feedback.

In addition to the original authors, a lot of people contributed to the modern LSTM. A non-comprehensive list is: Felix Gers, Fred Cummins, Santiago Fernandez, Justin Bayer, Daan Wierstra, Julian Togelius, Faustino Gomez, Matteo Gagliolo, and Alex Graves.↩

- - -
原文链接 [http://colah.github.io](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)

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
[16]:/assets/images/2019-04-18-RNN-and-LSTM/16.png