---
title:  "无限滚动"
categories:
  - FrontTech
tags: 
  - Frontend
  - Dom
  - google
  - medium
entries_layout: grid
lang_change: true
lang: cn
author_profile: true
toc: true
toc_label: "无限滚动"
toc_sticky: true
hidden: true
---

`无限滚动在互联网中随处可见. Google music的艺术家列表算一种，Facebook的时间线算一种，Twitter的live feed也是一种. 在到达底部之前，可以一直滑动，然后新的内容就会很神奇的出现。看起来很吸引人，这是一种无缝的用户体验。`

## 从简单的开始

首先从简单的实现开始编码。

### 一般的方法

当用户接近到内容的末尾时，附加的内容会动态的添加到页面底部或容器中，只有当用真正需要的时候，组建的渲染和追加才会被执行。而如果当用户没有到达viewpoint的底部时，不在viewpoint中的数据也不会被加载和处理。

{:refdef .codepen title="https://codepen.io/Kfir-Zuberi/pen/PQyqqB"}
Set the pen
{: refdef}

好处的话很明显：数据是动态请求的，而且也很好实现，我们只需要判断底部的组建现在是否需要渲染， 而我们不需要考虑上面的数据集，也就意味着我们增加了DOM的数量，但当用户向上滑的时候，节省了DOM操作和数据请求的时间和开销。当数据集不是很大时，提升的效果还是很明显的。

### 虚拟滚动条

有三种比较常见的虚拟滚动条的实现方法

- **对象池**  —  基于`“对象迟”`的设计模式。一小部分的DOM节点被渲染和循环使用，当用户在滑动页面的时候；
- **使用、去掉、重建**  — 即每次在viewpoint中时重建，在外面是release掉。
- **仅仅只是添加元素**  — 就好像上面的无限滚动一样，即来即加。

{:refdef .codepen title="https://codepen.io/Kfir-Zuberi/pen/ddgoGV"}
Set the pen
{: refdef}

与无限滚动条不同，对于虚拟滚动条，滚动的大小是在附加元素之前计算的，它将元素保持为常量计数。(index-1)*高度是用项高乘以项数得到的。~~每个元素在填充层上都有一个绝对的位置，并根据元素索引与顶部填充偏移~~。这个解决方案并不是很好，因为我们应该为每个元素添加一个padding属性，并且在任何时候都应该改变它，这是很昂贵的，像这样的，我们可以使用“对象池”的方法。

## 来自[google][google team]的例子

在这个例子里，一个Google团队打算建立一个聊天的demo软件，而这其中，就包含无限滚动的例子（聊天信息），所以，在这样的情况下，Google建议了三种技术方案来优化这个问题。

![screenshot][screenshot]

### DOM回收

DOM回收的思想主要是在我们滚动屏幕的过程中减少DOM数，大概就是我们只使用初始创建的DOM或者说在屏幕之外的DOM，而不是创建一个新的，创建一个DOM很容易，但是每一个DOM在内存、布局、样式等都会存在额外的开销。并且随着DOM数的增加，低端设备会感到很明显的缓慢，并且每一次重新布局或重绘（每一次node添加或删除class时触发的进程）会随着越来越多的DOM而变得越来越昂贵。

第一个障碍就是滚动条本身。因为在任何时候，DOM中只有很少一部分的使用项，所以，我们需要想办法，让滚动条滚动的位置能在理论上反应正确的容量。我们将使用一个1px * 1px的哨兵节点和转换来强制表示包含项目（滚动的跑到）所需的高度。我们将滚动道上的每一个元素提升到他们自己的图层，以保证滚动道本身的图层是空的。没有背景颜色等等。如果滚动道不是空的，便不利于浏览器优化，而且我们还需要在显卡上存储一个几十万高度的纹理。对于移动设备来说这是绝对不行的。

我们每次滚动的时候，都检查viewpoint是否足够接近滚动道的底部。如果是这样的，我们将通过移动哨兵元素来扩展滚动道，并且将已经离开viewpoint的元素移动到底部，并且填充的内容。

反方向的滚动也是如此。然而，在我们的实现中，我们将永远不会收缩跑道，以便滚动条的位置保持一致。

### 占位格

考虑到网络延迟和一些其他的因素，如果我们的用户flicky scrolling，他们会很容易的滚动到我们有数据的那一个元素。如果发生了的话，我们就需要放置一个Tombstones（嗯。一个站位格placeholder），等数据请求到的时候将它喜欢成包含新内容的元素。

![Tombstones][Tombstones]{: .align-left}
站位格通常都是循环使用的，并且有一个单独的池来存放复用的DOM元素。我们需要这样做，这样我们就可以在站位格到填充了内容的节点之间很友好的转换，否则用户会觉得很不舒服，有可能还会使他们忘记所关注的内容。

### 滚动锚

当站位格被替换或者窗口大小调整时（同时包括设备翻转），滚动锚会被调用。我们需要搞清楚viewpoint最上面可见的节点到底是哪一个。由于这个元素只是部分可见，我们还需要存储视图开始的元素顶部的偏移量。

![anchoring][anchoring]

如果视口调整了大小，滚动道发生了变化，我们就可以恢复到用户在视觉上相同的情况。WIN!除了调整大小的窗口意味着每个项都可能改变其高度，那么我们如何知道锚定内容应该放置在多低的位置呢？我们不知道！为了找到答案，我们必须将锚定项目上方的每个元素都进行布局，并将它们的所有高度相加;这可能会在调整大小后导致明显的停顿，我们不希望这样。相反，我们假设上面的每一项都和站位格一样大，并相应地调整滚动位置。当元素被滚动到跑道上时，我们调整滚动位置，有效地将布局工作推迟到实际需要的时候了。

## Reference

- [Complexities of an Infinite Scroller][google team]
- [medium-Showing elements to infinity — and beyond!](https://medium.com/walkme-engineering/showing-elements-to-infinity-and-beyond-a4f58f4b86d5)

[google team]: https://developers.google.com/web/updates/2016/07/infinite-scroller
[screenshot]: /assets/images/2018-08-13-infinite-scroll/screenshot.png
[Tombstones]: /assets/images/2018-08-13-infinite-scroll/tombstone.png
[anchoring]: /assets/images/2018-08-13-infinite-scroll/anchoring.png
[virtualscroll]: /assets/images/2018-08-13-infinite-scroll/virtualscroll.png