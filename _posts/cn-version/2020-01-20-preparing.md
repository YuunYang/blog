---
title: "准备"
categories:
  - FrontTech
tags:
    - 工作
    - 前端
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---
[前端面试题总结](/fronttech/front-end/)

[前端面试题总结-01](/fronttech/front-end-01/)

[计算机网络总结](/fronttech/network/)

[常见代码题](/fronttech/common-algorithms/)

### dom react原理

> 虚拟 dom

React 会将 代码先转化为 JavaScript 对象，这个对象类似于 ast，然后在最后将对象转化为真实的 DOM。无论是创建还是更新，都会首先在虚拟 dom 上更新，对 dom 的时间监听也会先对 虚拟dom进行监听，虚拟dom代理原生dom作出响应。

### 取消 fetch 请求
场景考虑，Google 搜索时，有联想提示，当我们打到 “Google”时，前面的搜索提示例如“Goo”如果返回的结果还没传到，我们就要把它取消。

- 函数节流、函数防抖

  [函数节流](/fronttech/front-end/#%E5%87%BD%E6%95%B0%E8%8A%82%E6%B5%81)、[函数防抖](https://yukwan.cn/fronttech/front-end/#%E5%87%BD%E6%95%B0%E9%98%B2%E6%8A%96)；缺点是，对于函数节流，事实上，当我们打字的间隔在设定的定时区间时，会退出。。而对于函数防抖，则会只在我们打下最后一个字母，并等待一个时间区间时才会去执行。
- Abortable Fetch

  这是浏览器的新技术 —— [abortable](https://developers.google.com/web/updates/2017/09/abortable-fetch)。它依赖于浏览器的规范[AbortController](https://dom.spec.whatwg.org/#aborting-ongoing-activities)。这个控制器有signal属性，我们用它来传递。
  ```javascript
  autocompleteInput.addEventListener('keydown', function() {
    const url = "https://api.example.com/autocomplete"
    let controller;
    let signal;
    autocompleteInput.addEventListener('keyup', () => {
      if (controller !== undefined) {
          // Cancel the previous request
          controller.abort();
      }
      // Feature detect
      if ("AbortController" in window) {
          controller = new AbortController;
          signal = controller.signal;
      }
      // Pass the signal to the fetch request
      fetch(url, {signal})
        .then((response) => {
          // Do something with the response
          updateAutocompleteMenu()
      })
        .catch((error) => {
          // Something went wrong
          handleAutocompleteError(error);
      })
    });
  });
  ```

## Nodejs

### Nodejs 事件轮询
[event-loop-timers-and-nexttick](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)

首先理解 Javascript 是单线程的，也就是说虽然看起来好像是多线程，但在 JS 内部仍然是单线程的。具体的做法就是基于多线程的内核机制+nodejs的事件轮询机制

> 事件轮询机制

nodejs启动时，会初始化事件轮询；
```
┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
└───────────────────────────┘
```
每个阶段都有一个要执行的回调FIFO队列。虽然每个阶段都不太一样，但是当事件循环进入到给定的阶段时，它会执行所有与之相关的操作，然后，直到队列执行完毕或者回调达到限定值，事件循环就会进入到下一个阶段，以此类推。

由于其中任意一个操作都可能调度更多的操作和由内核排列在轮询阶段被处理的新事件。因此，长时间运行的回调可以允许轮询阶段运行长于计时器的阈值时间。

### Nodejs的特点及其使用场景
[cnblog.com](https://www.cnblogs.com/sysuys/p/3460614.html)

首先其特点是：
1. 它是一个Javascript运行环境
2. 依赖于Chrome V8引擎进行代码解释
3. 事件驱动
4. 非阻塞I/O
5. 轻量、可伸缩，适于实时数据交互应用
6. 单进程，单线程

NodeJS解决的第一个瓶颈问题是并发连接，从单线程到多线程、线程池是有一个明显的提升的，但随着请求量的提升，仍然会带来排队和系统资源要求提升的窘境。nodejs采用异步和事件驱动模型，类似与餐厅点餐，我们点完餐后拿到了一个号码，拿到号码，我们往往会在位置上等待，而在我们后面的请求会继续得到处理，同样是拿了一个号码然后到一旁等待，接待员能一直进行处理。等到饭菜做号了，会喊号码，我们拿到了自己的饭菜，进行后续的处理（吃饭）

这个喊号码的动作在NodeJS中叫做回调（Callback），能在事件（烧菜，I/O）处理完成后继续执行后面的逻辑（吃饭），这体现了NodeJS的显著特点，异步机制、事件驱动

整个过程没有阻塞新用户的连接（点餐），也不需要维护已经点餐的用户与厨师的连接

NodeJS解决的另外一个问题是I/O阻塞，NodeJS遇到I/O事件会创建一个线程去执行，然后主线程会继续往下执行的。Java、PHP也有办法实现并行请求（子线程），但NodeJS通过回调函数（Callback）和异步机制会做得很自然

总而言之，NodeJS适合运用在高并发、I/O密集、少量业务逻辑的场景；不适合CPU密集型应用。

### NodeJS异步编程

promise()，async+await

### Nodejs异步io
对于异步IO的实现，其中有几个组成部分：事件循环、观察者、请求对象

- 事件循环是node中的一种执行机制，这种机制是回调执行的基础部分，它保证了我们的回调函数能够被执行。

- 观察者是暴露回调函数的窗口，如果整体的场景为饮料工厂的话，我们的瓶子就是我们的回调函数，事件循环就是传送带在那一直转，而观察者就是瓶子就如机器的入口，机器就是我们的应用程序。所以应用程序从观察者这里获取事件，应用程序询问观察者是否还有事件。

- 请求对象，是应用程序封装的一个对象，里边包含了要做的IO操作类型，以及回调函数。

异步调用开始之后，应用程序封装一个请求对象，送入我们的线程池中的某个线程，该线程和操作系统的非阻塞IO通过epoll机制进行工作，这其中，会有观察者在线程池中进行检查，当某个线程的IO操作完成之后，观察者会将回调函数（封装在请求对象中的）放在事件循环上（上段提到的传送带），然后主线程调用回调函数。

### 隐式转换

- 转成 string 类型：`+`（字符串连接符，只要 + 号两边有一个是字符串）
- 转成 number 类型：`++/--`(自增自减运算符) `+ - * / %`(算术运算符) `> < >= <= == != === !===`(关系运算符)
- 转化为 boolean 类型：!（逻辑非运算符）

```javascript
console.log("2" > 10) // false; 两边一边是字符串一边是数字时，对字符串进行 Number() 操作，"2" 转化为 2。（字符串转化为NaN）
console.log("2" > "10") // true; 两边都是字符串时，不是Number()转化，而是 charCodeAt()；即转化为 unicode 编码。
console.log("abc" > "b") // false; 因为字符串比较大小时会转化为 number，这个 number 为 unicode 编码。
// 复杂数据转化为 number 顺序；
// 1、使用valueOf()获取其原始值
// 2、若原始值不是 number，则调用 toString，最后转为 number
console.log([] == 0) // true; [].valueOf().toString() => ""; number("") => 0
console.log(![] == 0) // true; ![] Boolean 类型转化，![] => 0
console.log(![] == []) // true; 同上理解
console.log([] == []) // false; 两边既不是字符串也不是数字也不是boolean，引用类型数据比较。
console.log(!{} == {}) // false; 因为 {}.valueOf().toString() => "[Object Object]"
```
