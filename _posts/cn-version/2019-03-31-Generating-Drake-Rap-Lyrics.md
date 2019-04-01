---
title:  "使用语言模型和LSTMs生成Drake的Rap歌词"
categories:
  - Machine Learning
tags: 
  - Machine Learning
  - Lstm
  - medium
  - Text Mining
  - Word Processing
entries_layout: grid
author_profile: true
toc: true
toc_label: "使用语言模型和LSTMs生成Drake的Rap歌词"
toc_sticky: true
header:
  image: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/back.png
  caption: "Generating Drake Rap Lyrics using Language Models and LSTMs"
---
[Ruslan Nikolaev于2018年4月9日](https://towardsdatascience.com/generating-drake-rap-lyrics-using-language-models-and-lstms-8725d71b1b12)

未来所有人工智能应用的一个主要部分是构建能够从某些数据集学习然后生成原始内容的网络。这种想法已经应用于自然语言处理（Natural Language Processing），也就是人工智能社区开发语言模型的方式。

*语言模型的前提是了解句子是如何构建在文本中的，并使用这些知识生成新的内容*

于我而言，我希望试一试一个有趣的主题——生成rap，来看一看我是否可以再创作加拿大著名说唱歌手Drake（公鸭）的歌词。

我还想分享一个通用机器学习项目，因为我发现如果你并不是很准确的知道从何开始的话，创建一个自己的东西通常是非常困难的。

## 1. 从数据开始
开始训练之前，我们需要寻找Drake的所有歌曲作为数据集，我不想浪费太多时间，所以我自己创建了一个快速的脚本，从一个叫`metrolyrics.com`的流行网站上抓取网页。
```python
import urllib.request as urllib2
from bs4 import BeautifulSoup
import pandas as pd
import re
from unidecode import unidecode

quote_page = 'http://metrolyrics.com/{}-lyrics-drake.html'
filename = 'drake-songs.csv'
songs = pd.read_csv(filename)

for index, row in songs.iterrows():
    page = urllib2.urlopen(quote_page.format(row['song']))
    soup = BeautifulSoup(page, 'html.parser')
    verses = soup.find_all('p', attrs={'class': 'verse'})

    lyrics = ''

    for verse in verses:
        text = verse.text.strip()
        text = re.sub(r"\[.*\]\n", "", unidecode(text))
        if lyrics == '':
            lyrics = lyrics + text.replace('\n', '|-|')
        else:
            lyrics = lyrics + '|-|' + text.replace('\n', '|-|')

    songs.at[index, 'lyrics'] = lyrics

    print('saving {}'.format(row['song']))
    songs.head()

print('writing to .csv')
songs.to_csv(filename, sep=',', encoding='utf-8')
```
这个爬虫使用了一个很有名的python库叫BeautifulSoup，5分钟简单教程来自[Justin Yek](https://medium.com/@jyek)所写的[awesome tutorial](https://medium.freecodecamp.org/how-to-scrape-websites-with-python-and-beautifulsoup-5946935d93fe)。注意，我实际上预定义了我想从*metrolyrics*上获取的歌曲，这就是为什么你可能会注意到我在上面代码中迭代`songs`数据帧（dataframe）。

![Iterative process of word generation with Character-level Language Model][01]{: .align-center}

运行了scrapper之后，我将所有的歌词都以正确的格式保存在.csv文件中，并准备开始预处理数据和构建模型。
## 关于模型
现在，我们来谈谈文本生成模型，这也是你点进来的目的，这是最重要的点，也是很有趣的一部分。我将从谈论模型设计和一些使歌词生成成为可能的重要元素开始谈起，我们将直接进入它的实现。

*构建语言模型有两个主要方法（1）字符级模型（2）单词级模型*

两种模型的主要区别在于输入和输出是什么，我将在这里详细讨论它们是如何工作的。
### 字符级模型
在字符级模型的情况下，您的输入是一串字符`seed`，模型则负责预测下一个字符`new_char`。然后使用`seed + new_char`一起来生成下一个字符串，并依次类推。注意，由于模型网络输入必须始终保持相同的形状，因此在这个过程的每次迭代中，我们实际上都会损失seed中的一个字符。下面是一个简单的可视化：

![Iterative process of word generation with Word-level Language Model][02]{: .align-center}

在每次迭代中，模型基本上都在预测给定seed字符的下一个最可能的字符是什么，或者使用条件概率，这个过程可以被描述为查找`P(new_char|seed)`的最大值，其中`new_char`可能是字母表中的任何字符。在我们的示例中，字母表是由所有英文字母和空格字符组成的。（注意，你的字母表可能与此差别很大，取决于你所构建模型的语言，它可以包含任何你想要的字符）
### 单词级模型
单词级模型几乎和字符级是差不多的，但是它是生成下一个单词而不是下一个字符。下面是一个简单的例子：

![Iterative process of word generation with Word-level Language Model][03]{: .align-center}

现在，在这个模型中，我们向前看一个单位，但这个时候我们的一个单位是一个单词，而不是一个字符。所以，我们寻求的是`P(new_word|seed)`，其中`new_word`则是来自我们词表的任意单词。

注意，现在我们搜索的集合比以前大得多。使用字母表时，我们搜索大约30个条目，现在我们在每次迭代中都要搜索更多的条目，因此单词级模型算法在每次迭代中都要慢一些，但是由于我们生成的是一个完整的单词而不是单个字符，所以实际上它并没有那么糟糕。作为单词级模型的最后一点说明，我们可以有一个非常多样化的词汇表，我们通常通过从数据集(通常在数据预处理阶段完成)中找到的所有不同的单词来扩展它。由于词汇表可以变得无穷大，所以有许多技术可以提高算法的效率，比如单词嵌入（Word-Embedding），但这些都是后话。

出于本文的目的，我将重点介绍字符级模型，因为它在实现上更简单，而且了解完字符级模型后可以轻松地将其转化为更复杂的单词级模型。写这篇文章的同时，我还建了一个单词级模型，会在此文完成后附加链接。
## 2. 数据预处理
对于字符级模型，我们需要对数据进行如下处理：
1. **标记数据集** ——当我们将输入输入到模型中时，我们不想只输入字符串，而是要处理字符，因为这是一个字符级模型。所以我们要把所有的歌词分成字符列表。
2. **设计单词表**——现在，我们知道每一个每一个单独的字符都有可能出现在歌词中（从前面的标记阶段可知），我们想要找到所有不同的字符。为了简单和整个数据集不那么大(我只使用了140首歌)，我将坚持使用英文字母和一些特殊字符(比如空格)，并忽略所有的数字和其他东西(由于数据集很小，所以我希望模型只预测更少的字符)。
3. **创建训练序列**——我们将使用一个滑动窗口的概念，并通过在一个句子上滑动一个固定大小的窗口来创建一组训练示例。下面是一个很好的方法来将其形象化：
![ Sliding window on the dataset with input/output generation][04]{: .align-center}
通过每一次移动一个字符，我们生成一个长度为20的字符串和一个单独字符的输出。此外，一个额外的好处是，由于我们每次移动一个字符，实际上我们正在有效地扩展数据集的大小。
4. **标签编码训练序列**——最后，由于我们不希望模型处理原始字符串（尽管从理论上来讲是可能的，因为一个字符从技术的角度来看只是数字，所以你可以说ASCII为我们编码了所有字符串）。我们要把一个唯一的整数和字母表中的每个字符联系起来——你们可能听说过标签编码（Label Encoding）。这也是我们创建两个非常重要的映射`character-to-index`和`index-to-character`的时候。通过这两个映射，我们可以将任何字符串编码成为它特有的数字并且还能将模型的输出从索引解码为原始的字符。
5. **一位有效编码（One-Hot-Encode）数据集**——由于我们处理的是分类数据，其中所有字符都属于某种类别，所以我们必须对输入列进行编码。下面是由[Rakshith Vasudev](https://medium.com/@rakshithvasudev)编写的关于One-Hot-Encoding的[详细描述](https://hackernoon.com/what-is-one-hot-encoding-why-and-when-do-you-have-to-use-it-e3c6186d008f)。

一旦我们完成这五个步骤，我们就差不多完成了这个部分，现在我们需要做的便是构建模型并训练它。如果你想更深入的了解细节，下面是前面五步的代码。
```python
# load all songs
songs = pd.read_csv('data/drake-songs.csv')

# merge all the lyrics together into one huge string
for index, row in songs['lyrics'].iteritems():
    text = text + str(row).lower()
    
# find all the unique chracters
chars = sorted(list(set(text)))
print('total chars:', len(chars))

# create a dictionary mapping chracter-to-index
char_indices = dict((c, i) for i, c in enumerate(chars))

# create a dictionary mapping index-to-chracter
indices_char = dict((i, c) for i, c in enumerate(chars))

# cut the text into sequences
maxlen = 20
step = 1 # step size at every iteration
sentences = [] # list of sequences
next_chars = [] # list of next chracters that our model should predict

# iterate over text and save sequences into lists
for i in range(0, len(text) - maxlen, step):
    sentences.append(text[i: i + maxlen])
    next_chars.append(text[i + maxlen])
    
# create empty matrices for input and output sets 
x = np.zeros((len(sentences), maxlen, len(chars)), dtype=np.bool)
y = np.zeros((len(sentences), len(chars)), dtype=np.bool)

# iterate over the matrices and convert all characters to numbers
# basically Label Encoding process and One Hot vectorization
for i, sentence in enumerate(sentences):
    for t, char in enumerate(sentence):
        x[i, t, char_indices[char]] = 1
    y[i, char_indices[next_chars[i]]] = 1
```
## 3. 构建模型
为了使用一组先前的字符来预测下一个字符，我们将使用循环神经网络(RNN)，或者具体地说是长短时记忆网络(LSTM)。如果你对这两个概念都不熟悉，我建议你仔细阅读。[Pranoy Radhakrishnan](https://medium.com/@pranoyradhakrishnan)的[RNNs](https://towardsdatascience.com/introduction-to-recurrent-neural-network-27202c3945f3)和[Eugine Kang](https://medium.com/@kangeugine)的[LSMTs](https://medium.com/@kangeugine/long-short-term-memory-lstm-concept-cb3283934359)。如果你只是需要复习一下或感觉自己很了解，这里有一个快速纲要：
### RNN复习
通常，你看到的网络看起来像一个网，从多个节点聚合到一个输出。就像这样:

![Image of a Neural Network. credit][05]{: .align-left}

这里我们有一个输入点和一个输出点。这对于非连续的输入非常有用，因为输入的顺序不会影响输出。但在我们的例子中，字符的顺序实际上非常重要，因为字符的特定顺序是创建独特单词的关键。

RNNs通过创建一个接受连续输入的网络来解决这个问题，该网络还使用前一个节点的激活作为下一个节点的参数。

![Overview of a simple RNN][06]{: .align-center}

还记得我们例子中的序列`Tryna_keep_it_simple`，我们提取了下一个字符应该是`_`。这也正是我们希望我们的网络去做的。我们将输入字符串序列，其中每一个字符`T — > s<1>, r -> x<2>, n -> x<3>... e-> x<n>`，网络则会预测一个输出`y->_`，这是一个空格，也就是我们的下一个字符。
### LSTM复习
简单的RNN有一个问题，它们不擅长将信息从非常早期的单元传递到后面的单元。例如，如果你观察这个句子`Tryna keep it simple is a struggle for me`，如果不回头看看之前出现了什么词，那么预测最后一个单词`me`（可以是任何人、任何事比如Baka，猫，土豆）是很困难的。

LSTMs解决这个问题的方法是为每个存储之前发生的事情（之前出现了哪些单词）的信息的单元中添加一点内存，这就是LSTMs看起来像下面这样的原因：
![LSTM visualization, taken from Andrew Ng’s Deep Learning specialization][07]{: .align-center}

除了传递`a<n>`激活，同时也传递了`c<n>`，这其中就包含先前节点发生的信息。这就是为什么LSTMs更善于保存上下文，并且通常可以为语言建模等目的做出更好的预测。
### 实际的构建
作者之前学过一点Keras，所以下面的代码是使用它作为框架来构建网络的，但实际上，这个网络可以手动完成，唯一的不同点就是可能会长一点。
```python
# create sequential network, because we are passing activations
# down the network
model = Sequential()

# add LSTM layer
model.add(LSTM(128, input_shape=(maxlen, len(chars))))

# add Softmax layer to output one character 
model.add(Dense(len(chars)))
model.add(Activation('softmax'))

# compile the model and pick the loss and optimizer
model.compile(loss='categorical_crossentropy', optimizer=RMSprop(lr=0.01))

# train the model
model.fit(x, y, batch_size=128, epochs=30)
```
正如你所看到的，我们使用的是LSTM模型，我们还使用了批处理，这意味着我们对数据子集进行训练，而不是一次对所有数据进行训练，以略微加快训练过程。
## 生成歌词
在我们的网络训练之后，下面则是我们如何搜寻下一个字符。我们将会得到一些随机的seed，这将是一个用户输入的简单字符串。然后我们将用这个seed作为网络的输入来验证下一个字符，并且一直重复这个过程直到我们生成新行；类似于上面所示的图2。

下面是一些生成歌词的例子

注：歌词不经过审查，所以你可以随意查看

![ ][08]{: .align-center}
![ ][09]{: .align-center}
![ ][10]{: .align-center}
![ ][11]{: .align-center}
![ ][12]{: .align-center}

你可能注意到单词有时候没有发挥作用，这是单词级模型的通病，由于输入数据常常被单词分割，这使得网络学习并生成一些能在某种情况下也能满足条件奇怪的单词。

这是单词级模型解决的问题，但是对于少于200行代码，字符级模型仍然没有太大问题。
## 其他应用
在这个字符级网络中描述的思想可以扩展到许多比歌词生成更有用的其他应用程序。

例如，iPhone键盘上的下一个单词推荐便是如此。

![Keyboard next word prediction][13]{: .align-center}

想象一下，如果你构建一个足够精确的Python语言模型，你不仅可以实现关键字或变量名的自动补全，还可以自动完成大量代码，从而为程序员节省大量时间。

## 总结
你可能注意到这里的代码并不完整，有一些部分是没有的，这里是作者的[GitHub仓库](https://github.com/nikolaevra/drake-lyric-generator)，你可以自己构建类似项目来更深入地了解细节。

感谢Keras的例子来自[github](https://github.com/keras-team/keras/blob/master/examples/lstm_text_generation.py)

[01]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/01.png
[02]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/02.png
[03]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/03.png
[04]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/04.png
[05]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/05.png
[06]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/06.png
[07]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/07.png
[08]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/08.png
[09]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/09.png
[10]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/10.png
[11]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/11.png
[12]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/12.png
[13]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/13.png
