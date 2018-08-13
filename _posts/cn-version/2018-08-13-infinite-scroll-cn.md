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
---

`无限滚动在互联网中随处可见. Google music的艺术家列表算一种，Facebook的时间线算一种，Twitter的live feed也是一种. 在到达底部之前，可以一直滑动，然后新的内容就会很神奇的出现。看起来很吸引人，这是一种无缝的用户体验。`

## begin with ABC

Coding begin with ABC.

### General way

The additional content appended dynamically to the bottom of the page or to the container as the user approaches the end of the content, the elements’s rendering and appending will be handled only if and when the user needs it. If the user doesn’t reach the end of the viewport, data that is not in the viewport won’t be loaded and handled

{:refdef .codepen title="https://codepen.io/Kfir-Zuberi/pen/PQyqqB"}
Set the pen
{: refdef}

The advantages are clear: data request dynamically, and it is sample to realize, we just need to judge if the bellow element is ready to show, if yes then rending it, we dont need to thinking about the upper datasets, means we increased the DOM node count, but when user scroll up, we save time of operation and requests. It is good when the datasets are not very big.

### The virtual scrollbar

We will learn from below about this way

- Object pool — based on “Object Pool” design pattern. A small subset of DOM elements are rendered and reused as the user scrolls down the page;
- Use, drop and recreate — Recreates the DOM elements each time they are in the viewport, and releases them once they leave;
- Just leave the elements — As in infinite scroll, creates the elements as they come into view.

{:refdef .codepen title="https://codepen.io/Kfir-Zuberi/pen/ddgoGV"}
Set the pen
{: refdef}

In this way, we easy release the element when it out of viewpoint, it keeps the element as constant count. and (index-1)*height is made by multiplying item-height by item-count. ~~Each element gets an absolute position over the padding layer, and is offset from the top padding according to the element index~~. This solution is not very good, because we should add each element a padding attribute, and should change anytime, it is expensive, like that, we could use [the blew way](./#dom-recycling)

## 来自[google][google team]的例子

在这个例子里，一个Google团队打算建立一个聊天的demo软件，而这其中，就包含无限滚动的例子（聊天信息），所以，在这样的情况下，Google建议了三种技术方案来优化这个问题。

![screenshot][screenshot]

### DOM回收

DOM回收的思想主要是在我们滚动屏幕的过程中减少DOM数，大概就是我们只使用初始创建的DOM或者说在屏幕之外的DOM，而不是创建一个新的，创建一个DOM很容易，但是每一个DOM在内存、布局、样式等都会存在额外的开销。And with the increasement of DOM node count, low-end devices will get noticeably slower, also that every relayout and reapplication of your styles (a process that is triggered whenever a class is added or removed from a node) grows more expensive with a bigger DOM.

The first hurdle is the scrolling itself. Since we will only have a tiny subset of all available items in the DOM at any given time, we need to find another way to make the browser’s scrollbar properly reflect the amount content that is theoretically there. We will use a 1px by 1px sentinel element with a transform to force the element that contains the items (the runway) to have the desired height. We will promote every element in the runway to their own layer to make sure the layer of the runway itself completely empty. No background color, nothing. If the runway’s layer is non-empty it is not eligible for the browser’s optimizations and we will have to store a texture on our graphics card that has a height of a couple of hundred thousand pixels. Definitely not viable on a mobile device.

Whenever we scroll, we will check if the viewport has come sufficiently close to the end of the runway. If so, we will extend the runway by moving the sentinel element and moving the items that have left the viewport to the bottom of the runway and populate them with new content.

The same goes for scrolling in the other direction. We will, however, never shrink the runway in our implementation, so that the scrollbar position stays consistent.

### Tombstones

Considering about the network latency and everything, if our users make use of flicky scrolling, they can easily scroll past the last element we have data for. If that happens, we will place a tombstone item – a placeholder – that will get replaced by the item with actual content once the data has arrived.

![Tombstones][Tombstones]{: .align-left}
Tombstones are also recycled and have a separate pool for re-usable DOM elements. We need that so we can make a nice transition from a tombstone to the item populated with content, which would otherwise be very jarring to the user and might actually make them lose track of what they were focusing on.

### Scroll anchoring

Our scroll anchoring will be invoked both when tombstones are being replaced as well as when the window gets resized (which also happens when the devices is being flipped!). We will have to figure out what the top-most visible element in the viewport is. As that element could only be partially visible, we will also store the offset from the top of the element where the viewport begins.

![anchoring][anchoring]

If the viewport is resized and the runway has changes, we are able to restore a situation that feels visually identical to the user. Win! Except a resized window means that each items has potentially changed its height, so how do we know how far down the anchored content should be placed? We don’t! To find out we would have to layout every element above the anchored item and add up all of their heights; this could cause a significant pause after a resize, and we don’t want that. Instead, we resort to assuming that every item above is the same size as a tombstone and adjust our scroll position accordingly. As elements are scrolled into the runway, we adjust our scroll position, effectively deferring the layout work to when it is actually needed.

## Reference

- [Complexities of an Infinite Scroller][google team]
- [medium-Showing elements to infinity — and beyond!](https://medium.com/walkme-engineering/showing-elements-to-infinity-and-beyond-a4f58f4b86d5)

[google team]: https://developers.google.com/web/updates/2016/07/infinite-scroller
[screenshot]: /assets/images/2018-08-13-infinite-scroll/screenshot.png
[Tombstones]: /assets/images/2018-08-13-infinite-scroll/tombstone.png
[anchoring]: /assets/images/2018-08-13-infinite-scroll/anchoring.png
[virtualscroll]: /assets/images/2018-08-13-infinite-scroll/virtualscroll.png