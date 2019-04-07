---
title:  "JavaScript中的事件循环"
categories:
  - FrontTech
tags: 
  - Frontend
  - medium
  - event loop
  - JavaScript
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
header:
  image: /assets/images/2019-04-06-eventloop-in-JS/cover.jpeg
  caption: "Understanding JS: The Event Loop"
  cta_url: "https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40"
---
## 基本概念
“JavaScript是如何实现单线程和异步的？”，对于这个问题的简单解答就是JavaScript的单线程和异步特性是由其运行的环境所决定的。

单线程因为在浏览器中，我们需要进行dom操作，如果是多线程的那么势必会导致dom操作的脏操作，为了保证程序执行的一致性，JavaScript便选择只用一个主线程来执行代码。

异步，也可以说是非阻塞
## 基本构架
先看一个图
![浏览器中主要组件](/assets/images/2019-04-06-eventloop-in-JS/01.jpg){: .align-center}
### 栈stack
函数调用形成一个栈帧，当调用第函数时，创建追加一个帧，压在上一个帧智商，帧中包含参数和局部变量；当函数返回时，相应的帧也被弹出栈。
### 堆heap
对象被分配在堆中，即用以表示一大块非结构化的内存区域。如果某个函数有一个局部对象，在堆中存放对象，相应的栈存放对象的指针。
### 事件队列callback queue
一个JavaScript运行时包含了一个待处理的消息队列。每一个消息都关联着一个用以处理这个消息的函数。

在事件循环期间的某个时刻，运行时从最先进入队列的消息开始处理队列中的消息。为此，这个消息会被移出队列，并作为输入参数调用与之关联的函数。正如前面所提到的，调用一个函数总是会为其创造一个新的栈帧。

函数的处理会一直进行到执行栈再次为空为止；然后事件循环将会处理队列中的下一个消息（如果还有的话）。
### 浏览器web apis
即浏览器提供的一系列附加功能，如其中的一些方法比如XMLHttpRequest、setTimeOut之类的与事件队列中的事件结合也会影响事件的执行顺序。
## 事件循环
事件循环中有几个需要注意的点
### 微任务和宏任务
事件循环过程是一个宏观的表述，实际上因为异步任务之间并不相同，因此他们的执行优先级也有区别。不同的异步任务被分为两类：微任务（micro task）和宏任务（macro task）。
以下事件属于宏任务：
- setInterval()
- setTimeout()

以下事件属于微任务
- new Promise()
- new MutaionObserver()

在一个事件循环中，异步事件返回结果后会被放到一个任务队列中。然而，根据这个异步事件的类型，这个事件实际上会被对应的宏任务队列或者微任务队列中去。并且在当前执行栈为空的时候，主线程会查看微任务队列是否有事件存在。如果不存在，那么再去宏任务队列中取出一个事件并把对应的回到加入当前执行栈；如果存在，则会依次执行队列中事件对应的回调，直到微任务队列为空，然后去宏任务队列中取出最前面的一个事件，把对应的回调加入当前执行栈...如此反复，进入循环。

前面都不用看，只需记住**当当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行。**

## 实例
### 代码段一：开胃小菜
```javascript
function main(){
  console.log('A');
  setTimeout(
    function display(){
        console.log('B');
    },0);
  console.log('C');
}
main();
//  Output
//  A
//  C
//  B
```
代码中有一个main函数，在控制台中打印了’A‘和’C‘，然后中间是一个setTimeout调用，会在0ms等待后打印’B‘。
![执行时的内部工作过程](/assets/images/2019-04-06-eventloop-in-JS/02.png){: .align-center}
1. 首先将主函数的调用推入堆栈(作为帧)。然后浏览器将主函数中的第一条语句push到堆栈中，即`console.log('A')`。执行此语句并在完成时弹出该帧。控制台中显示字母表A。
2. 下一个语句(带有回调函数display()和0ms等待时间的setTimeout())被推入调用堆栈并开始执行。setTimeout函数使用浏览器API来延迟对所提供函数的回调。然后，一旦切换到浏览器(对于计时器)完成，就会弹出（pop）框架(带有setTimeout)。
3. `console.log('C')`被推到堆栈中，同时计时器在浏览器中运行，用于回调display()函数。在这种特殊情况下，由于提供的延迟为0ms，回调将在浏览器接收到它时立即添加到消息队列中(理想情况下，因为要考虑代码的执行时间)。
4. 在执行main函数中的最后一条语句之后，main()框架将从调用堆栈中弹出，从而使其为空。为了让浏览器将任何消息从队列推送到调用堆栈，调用堆栈必须首先为空。这就是为什么即使setTimeout()中提供的延迟为0秒，对display()的回调必须等到调用堆栈中所有帧的执行完成。
5. 现在回调函数display()被推入调用堆栈并执行。控制台上打印C。这是javascript的事件循环。
`因此setTimeout(函数，delayTime)中的延迟参数并不表示函数执行后的精确时间延迟。它表示在某个时间点之后函数将被执行的最小等待时间。`
### 代码段二：深入理解
```javascript
function main(){
  console.log('A');
  setTimeout(
    function exec(){ console.log('B'); }
  , 0);
  runWhileLoopForNSeconds(3);
  console.log('C');
}
main();
function runWhileLoopForNSeconds(sec){
  let start = Date.now(), now = start;
  while (now - start < (sec*1000)) {
    now = Date.now();
  }
}
// Output
// A
// C
// B
```
![执行时的内部工作过程](/assets/images/2019-04-06-eventloop-in-JS/02.png){: .align-center}
- 函数runwhile eloopfornseconds()的作用与它的名称完全相同。它不断地检查调用它所消耗的时间是否等于作为函数参数提供的秒数。要记住的要点是，while循环(像许多其他语句一样)是一个阻塞语句，这意味着它的执行发生在调用堆栈上，并且不使用浏览器api。因此，它会阻塞所有后续语句，直到执行完毕。
- 因此，在上面的代码中，即使setTimeout的延迟为0,while循环运行了3秒，exec()回调仍然会卡在消息队列中。while循环在调用堆栈(单线程)上继续运行，直到3s结束。当调用堆栈变为空后，回调exec()被移动到调用堆栈并执行。
- 因此setTimeout()中的延迟参数并不保证计时器完成延迟后执行的开始。它作为延迟部分的最小时间。
## 总结
最后简单的讲述一下什么是事件循环？就是由于JavaScript是单线程非阻塞的，所以当有异步事件来到时，JavaScript会将其放到一边，继续监听后续的事件，当异步回调后，再转去执行回调函数中的内容，如此反复，直到事件队列为空，这就是事件循环。

## reference
- [详解JavaScript中的Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)
- [JavaScript Event Loop Explained](https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4)