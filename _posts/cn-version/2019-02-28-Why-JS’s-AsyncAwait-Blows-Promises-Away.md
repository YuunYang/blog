---
title:  "JavaScript中Async/Await击败Promise的六个原因"
categories:
  - FrontTech
tags: 
  - Frontend
  - medium
entries_layout: grid
lang_change: true
lang: cn
author_profile: true
toc: true
toc_label: "JavaScript中Async/Await击败Promise的六个原因"
toc_sticky: true
---
[Mostafa Gaafar于2017年3月26日](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9)

为防止你错过，Node从7.6版本开始已经支持开箱即用的async/await了。如果你还没有尝试过，这里有一堆理由和例子，说明为什么你应该立即采用它并且永远永远不要回头。

【更新】：[Node 8 LTS](https://nodejs.org/en/blog/release/v8.0.0/)现在已经完全支持async/await了。
【编辑】：似乎嵌入的gist代码在medium的原生app上无法查看了，但在手机浏览器上是正常的。如果你在app上查看，可以点击分享按钮并选择“open in browser”以查看代码片段。

## Async/await 101
对于那些从未听说过这个话题的人，这里有一个简短的介绍
- Async/await是一种编写异步代码的新途径。之前异步的选择是回调和promises。
- Async/await实际上是建立在promises顶部的。他不能与普通回调或node回调一起使用。
- Async/await与promise一样是非阻塞的。
- Async/await使得异步代码看起来以及表现起来更像同步代码。这就是它全部力量的所在。
## 语法
声明一个`getJSON`函数返回一个promise，并且这个promise会resolve一些JSON对象。我们只想要调用并记录这些JSON，然后返回`"done"`。

下面是如何使用promises来实现
```javascript
const makeRequest = () =>
  getJSON()
    .then(data => {
      console.log(data)
      return "done"
    })

makeRequest()
```
使用async/await将会是
```javascript
const makeRequest = async () => {
  console.log(await getJSON())
  return "done"
}

makeRequest()
```
这里有一些不同点
1. 我们的函数前有一个`async`关键字。`await`关键字只能在有`async`定义的函数中使用。**任何一个`async`函数都隐式的返回一个promise，并且由promise resolve的值是你从该函数`return`的任何值（我们这个例子里是返回`"done"`）**
2. 上面这一点意味着我们不能在代码的顶层使用await，因为它不在`async`函数中。
```javascript
// this will not work in top level
// await makeRequest()

// this will work
makeRequest().then((result) => {
  // do something
})
```
3. `await getJSON()`意味着`console.log`调用会等待`getJSON()`promise resolves并打印值。
## 为什么会更好？
### 1. 简洁
看看我们没有写多少代码！即使在上面这个人为设计的例子中，我们明显节省了很多的代码。我们不需要写`.then`，创建一个匿名函数来处理响应，或者为不需要使用的变量提供一个名称数据。我们还避免了嵌套代码。这些小的优势快速累积，在下面的代码示例中会更加明显。
### 2. 错误处理
Async/await使得我们可以使用相同的结构（try/catch）处理同步和异步问题。在下面使用Promise的例子中，若`JSON.parse`错误`try/catch`将不会处理，因为这个错误是发生在promise内部的。我们需要调用`.catch`在promise之上，并且复制一份我们的错误处理代码，这将会在你的生产就绪代码中比简单的`console.log`更复杂。
```javascript
const makeRequest = () => {
  try {
    getJSON()
      .then(result => {
        // this parse may fail
        const data = JSON.parse(result)
        console.log(data)
      })
      // uncomment this block to handle asynchronous errors
      // .catch((err) => {
      //   console.log(err)
      // })
  } catch (err) {
    console.log(err)
  }
}
```
现在再来看使用async/await的同样代码。`catch`块会处理并解析错误。
```javascript
const makeRequest = async () => {
  try {
    // this parse may fail
    const data = JSON.parse(await getJSON())
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```
### 3. 条件语句
### 4. 中间值
### 5. 错误堆栈信息
### 6. 调试
## 总结
## 关注点