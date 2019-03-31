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

*`语言模型的前提是了解句子是如何构建在文本中的，并使用这些知识生成新的内容`*

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

存储所有歌曲歌词的DataFrame
![img01][01]{: .align-center}
运行了scrapper之后，我将所有的歌词都以正确的格式保存在.csv文件中，并准备开始预处理数据和构建模型。
## 关于模型
### 字符级模型
### 单词级模型
## 2. 数据预处理
## 3. 构建模型
### RNN复习
### LSTM复习
### 实际的构建
## 生成歌词
## 其他应用

[01]: /assets/images/2019-03-31-Generating-Drake-Rap-Lyrics/02.png
