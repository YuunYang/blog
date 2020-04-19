---
title: "Redux 源码分析"
categories:
  - FrontTech
  - Redux
tags:
    - 源码
    - 前端
entries_layout: grid
author_profile: true
toc: true
toc_label: "Redux 源码分析"
toc_sticky: true
---

Redux 源码分析，考虑到 Redux 源码并不多，所以打算首先看完 Redux 源码。

## The concepts of Redux

[Motivation](https://redux.js.org/introduction/motivation#!)

Redux 源码虽然不多，但是整个的 Redux 思想确实不太好理解，最先接触的时候可以说完全难以理解；结合 Redux 官方文档理解：

> Redux 为何诞生？

随着单页面应用的流行，应用中的 state 也就是状态越开越复杂，各个模块之间的数据交流也越来越复杂，以及伴随着开发过程中新需求越来越频繁，Redux 提供了一个统一的状态管理方案，将状态分离出来，并统一的进行分发处理。

> Redux 核心概念和流程

- action：action 描述了修改 state 的一种意愿，actions 是将数据传送数据到 store 的唯一荷载，也就是所有的数据最终都需要以 action 来调度。

- reducer：reducers 指定了应用状态的变化如何响应 actions 并发送到 store。reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。简单理解就是 reducer 是一个过滤器。

- Store：store 用来管理整个状态，并且暴露一些方法。

## CreateStore

> CreateStore 顾名思义就是生成 store。

首先从源码来看，createStore 接收三个参数分别为 reducer，preloadedState，enhancer；reducer 就是 reducer；preloadedState 是默认 state，需要注意的是，如果之前的 reducer 传递的是 combineReducers，这里指定的对象形状需和 combineReducers 相同；enhancer 为 store 增强器，可以指定第三方库来增强 store。

> 逐行分析

```javascript
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function.'
    )
  }
```

首先是判断 enhancer 的数量，需要限制在一个方法。当 enhancer 作为函数时，直接传入当前 createStore 方法，并返回。

```javascript
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(
      reducer,
      preloadedState as PreloadedState<S>
    ) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
  }
```

- getState：直接返回 currentState，如果正在调用 dispatch 则跑出错误，因为 dispatch 传入了 state 作为参数不需要使用 api 获取。

- subscribe：接收一个 listener 函数作为参数，subscribe 需要获取 dispatch 之前的 state 快照，所以如果当前正在 dispatch 过程中（回调函数有使用 dispatch），则直接报错；然后，对当前监听器做一个浅拷贝，并传入当前监听器到下一阶段监听器中，因为后面 dispatch 的时候可能会对当前 state 做很多修改，所以需要用一个新的监听器列表来保存下一个监听器列表。

- dispatch：接收的 action 必须为纯对象，如果没有问题则执行对应 reducer 函数（传入当前 state 和 action 到 reducer 函数，这个函数很多时候是返回的 combineReducer），最后执行所有监听函数。

## combineReducers

combineReducer 的核心作用就是组合 reducer，同时通过设置相对应的 key 值分发 reducer，然后返回一个接收 `state` 和 `action` 的 `combination` 函数，这个函数可以在 dispatch 中调用，`combination` 在接受这两个参数之后，先将 state 分别提取出来，然后分发到每一个 reducer 中，也就是说写的每一个 reducer 函数里接收的 state 都只是当前 key 对应的 state。

## bindActionCreators

把一个 value 为不同 action creator 的对象，转成拥有同名 key 的对象。同时使用 dispatch 对每个 action creator 进行包装，以便可以直接调用它们。没什么可说的。

## compose

对传入的函数列表执行一次 reduce，并将前一个函数的返回值作为下一个函数的参数执行。

## applyMiddleware

applyMiddleware 源码：

```javascript
  return (createStore: StoreCreator) => <S, A extends AnyAction>(
    reducer: Reducer<S, A>,
    ...args: any[]
  ) => {
    const store = createStore(reducer, ...args)
    let dispatch: Dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI: MiddlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
```

applyMiddleware 通过传递 middleware 到 dispatch 函数创建一个 store enhancer。

首先看 applyMiddleware 接收的参数和返回的类型；函数接收一系列中间件参数，返回一个 storeEnhancer 函数；

首先定义 middleware 需要的参数，分别为 getState 和 dispatch，然后将其依次传送给 middleware，同时又将 middleware 执行后返回的值 map 进一个 chain 数组，最后将 chain 传入 compose，并传入 当前 dispatch 作为参数并将最后返回的值作为新的 dispatch。

### applyMiddleware 在 createStore 中的应用

回过头来看 applyMiddleware 在 createStore 中是怎样工作的。看一下中文文档提供的例子 [自定义 Logger Middleware](https://www.redux.org.cn/docs/api/applyMiddleware.html)

```javascript
import { createStore, applyMiddleware } from 'redux'
import todos from './reducers'

function logger({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action)

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    let returnValue = next(action)

    console.log('state after dispatch', getState())

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue
  }
}

let store = createStore(
  todos,
  [ 'Use Redux' ],
  applyMiddleware(logger)
)

store.dispatch({
  type: 'ADD_TODO',
  text: 'Understand the middleware'
})
```

在 createStore 中，applyMiddleware 实际上是作为 enhancer 参数输入的，enhancer 会连续为返回的函数传入 createStore 和 reducer, preloadedState 作为参数，所以上面来看，因为只有一个 middleware，所以 next 就是当前 dispatch，这个 dispatch 是源码中 `dispatch = compose<typeof dispatch>(...chain)(store.dispatch)` 的 store.dispatch，所以 action 自然也是 Add_TODO。
