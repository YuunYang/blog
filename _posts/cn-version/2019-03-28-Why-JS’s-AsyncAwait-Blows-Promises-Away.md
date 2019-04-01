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
想象一下，下面的代码获取一些数据，并根据数据中的一些值决定是返回这些数据，还是获取更多细节。
```javascript
const makeRequest = () => {
  return getJSON()
    .then(data => {
      if (data.needsAnotherRequest) {
        return makeAnotherRequest(data)
          .then(moreData => {
            console.log(moreData)
            return moreData
          })
      } else {
        console.log(data)
        return data
      }
    })
}
```
光看着就让人头疼。在六层的嵌套、花括号、还有return语句中很容易出错，这些语句只是需要将最终结果传播到主promise。

当用async/await书写时，这个例子就变得更加易读了。
```javascript
const makeRequest = async () => {
  const data = await getJSON()
  if (data.needsAnotherRequest) {
    const moreData = await makeAnotherRequest(data);
    console.log(moreData)
    return moreData
  } else {
    console.log(data)
    return data    
  }
}
```
### 4. 中间值
你也许会发现自己处在这样一种情况下，你调用`promise1`，然后用它返回来调用`promise2`，然后用这两个promise的结果再调用`promise3`。你的代码也许长这个样子
```javascript
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // do something
      return promise2(value1)
        .then(value2 => {
          // do something          
          return promise3(value1, value2)
        })
    })
}
```
如果`promise3`不需要`value1`，那么很容易将promise嵌套更扁平化一些。如果你是无法忍受上述情况的人，你可以将values1和values2都放入`promise.all`中，来避免更深的嵌套，就像这样
```javascript
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // do something
      return Promise.all([value1, promise2(value1)])
    })
    .then(([value1, value2]) => {
      // do something          
      return promise3(value1, value2)
    })
}
```
这种方法为了可读性牺牲了语义性。没有理由让`value1`和`value2`共同属于一个数组，除非是为了避免嵌套promise。

同样的逻辑使用async/await会变得异常简单和直观。这会让你思考自己在努力使promise看起来不那么可怕的时间里，你本该去做的事。
```javascript
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```
### 5. 错误堆栈信息
想象一下一串链式调用多个promise的代码，并且在某处抛出一个错误。
```javascript
const makeRequest = () => {
  return callAPromise()
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => {
      throw new Error("oops");
    })
}

makeRequest()
  .catch(err => {
    console.log(err);
    // output
    // Error: oops at callAPromise.then.then.then.then.then (index.js:8:13)
  })
```
从promise链返回的错误堆栈没有给出任何错误发生地的线索。甚至于更糟的是这是一种误导；包含它的唯一一个函数`callAPromise`它完全与这个错误无关（不过，文件和行号仍然是有用的）。

但是，async/await中的错误堆栈指向的是包含错误的函数。
```javascript
const makeRequest = async () => {
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  throw new Error("oops");
}
makeRequest()
  .catch(err => {
    console.log(err);
    // output
    // Error: oops at makeRequest (index.js:7:9)
  })
```
当在本地开发环境、在编辑器中打开这个文件时，这种写法并不算一个很大的优势，但是当你试图理解来自生产服务器的错误日志时，它非常有用。在这种情况下，明白错误是发生在`makeRequest`中要比错误发生在一个接一个`then`中要好得多。
### 6. 调试
Last but not least，使用async/await的一个致命优势是它更容易调试。调试Promise一直以来都是痛苦的，原因有二

1. 无法在返回表达式（没有正文）的箭头函数中设置断点。
![img1](/assets/images/2019-03-28-Why-JS’s-AsyncAwait-Blows-Promises-Away/01.png){: .align-center}
2. 如果您在`.then`块中设置断点并使用诸如step-over之类的调试快捷方式，调试器将不会移动到下面的`.then`，因为它只“逐步”通过同步代码。
![img2](/assets/images/2019-03-28-Why-JS’s-AsyncAwait-Blows-Promises-Away/02.png){: .align-center}
## 总结
Async/await是JavaScript近几年添加的最具革命性的特性之一。它让你意识到语法混乱的promise是怎样的，并且提供一个更加直观的替代。
## 关注点
你可能会对使用这个特性有一个合理的怀疑
- 它使异步代码不太明显的：我们的眼睛习惯关注到是异步代码每当我们看到一个回调或`.then`时，它也许会花费一些时间来让双眼适应新的标识，但c#有这个特性已经很多年，熟悉的人都知道这是值得的，尽管有暂时的不便。
- Node 7不是一个LTS版本：但是Node 8将在下个月发布，将你的代码库迁移到新版本很可能只需要很少的工作，甚至不需要任何工作。[更新]:Node 8 LTS现在已经推出了。