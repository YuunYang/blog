---
title: "Typescript 规范与总结"
categories:
  - FrontTech
  - Typescript
tags:
    - 前端
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---

在修复班课系统 `typescript` 错误和使用 `typescript` 编程的过程中，踩过了很多大大小小的坑，同时也收获了一些编程规范方面的东西。

## 踩坑记录

### 强制转换类型

强制类型转换是遇到的最难排查的一个坑，因为

- 强制类型转换改变了参数的数据结构，容易造成传参错误，更严重的容易导致取空值，导致页面整个垮掉
- 无法快速定位代码，使用vscode编程开发的时候，经常需要 cmd+click 快速定位函数或者代码，但是如果使用了强制类型转化就无法定位了。
- 造成代码的不规范，班课系统中，很多的 actions 都没有返回默认的 state，然后用一个强制类型转化将其转化为正常的函数，这样不规范的函数虽然没有造成实际的错误，但很多时候会让开发者放松警惕，产生其他派生的错误。

总结：最好不要在任何情况下使用强制类型转化，因为绝大多数强制转化的场景都可以避免

- 如果我们明确知道某个变量的类型，应该在它声明的时候就指定好
- 如果不知道具体的类型，或者有过类型的转化，我们应该在转化的函数或操作上指定返回的类型，并将变量增加或类型

### Any 类型的使用

一般来说，any 和 unknown 很多都是在一起说的，首先可以确定的一点是，在项目中使用 any 是绝对应该被拒绝的；下面将说一下 any 和 unknown 的基本情况。

- Any：any 类型允许我们像 JavaScript 一样去编写代码，Typescript 中，any 可以看作一种顶层类型，any 的意思也就是所有的类型都可以赋值给 any，因为使用 any 会使得代码没有具体的属性，因此变得没有可预见性，同时也很难维护，基本上，只推荐一种情况使用 any，那就是引入的第三方库没有具体的类型。

- unknown：unknown 最先在 Typescript 的3.0版本中提出来，unknown 同样可以被看作是一种顶层类型，但是相对来说会更安全一点，包括两个原因：

    1. unknown 只能赋值给 any 或者 unknown 类型的变量，为什么要做这个限制？我的理解是，如果我们都已经知道了我们想要赋值的对象目标，那么再使用 unknown 显然是不规范的了。
    2. 我们无法像使用 any 一样，直接像写 js 一样去获取例如某个对象的属性，也就是说，typescript 主张使用 unknown 更多的作为一个中转媒介，ts 不建议对 unknown 属性执行任意操作；相对应的，如果使用了 unknown，更多的是使用类型检测例如 typeof 来限制类型。

总结，当我们不确定属性的类型的时候，使用 unknown 会比使用 any 更加友好，因为，无法在 unknown 上进行任何操作，因此，相对而言，使用 unknown 也迫使我们在操作代码之前，思考代码的具体意义；很多时候，可以把 unknown 作为一种联合类型，只不过使用 unknown 就抛弃了语意化。

## 使用技巧总结

### interface 和 type

interface 和 type 应该是使用频率最多的一种 typescript 属性了，比较老生常谈的问题就是 interface 和 type 的区别，这里结合官网的知识具体总结几点：

- type 可以直接定义基本类型例如`type name = string;`，但是 interface 只能定义 object 类型的；
- type 使用 `&` 继承，而 interface 使用 `extends` 继承
- interface 可以合并声明

总结下来，interface 和 type 的使用其实并没有什么大的区别，事实上 interface 可以干的事 type 都可以做，但是为了语意话，interface 更多的表示`接口`的语意，而 type 则表达 `类型` 的意思，所以也更推荐用 interface 来表示一个接口类型，例如 props 或者 state，而 type 用来表示基本类型。

### 使用 keyof

keyof 的理解可以类比 Object.keys()，而且，使用 keyof 的场景也通常和 object 搭配，思考下面这种情况：

```typescript
const func(obj: {abroad: string}, a: string){
  return obj[a] ?? '';
}
```

这个代码看起来似乎没问题，如果确实不存在某个属性，我们将返回空字符串，这个代码虽然在运行时不会出错，但是 ts 的检测工具仍然会对这行代码报错，原因是单纯的使用 string 类型来获取obj的属性内容是不具有约束性的，虽然我们可以保证这行代码在执行上不出错，但是很有可能会带来业务上的错误，比如如果我们此时将传入的参数传为`aboard`，那么这个函数就会永远返回空字符串了，**因为我们拼错单词了！**而且当两个单词很相似的时候，我们真的很难排查出问题出在哪里。

> 使用 keyof 来限制类型

```typescript
type Obj = {abroad: string};
const func(obj: Obj, a: keyof Obj) {}
```

### Partial 的使用

Partial 我更愿意将其理解为 oneOf，partial 是 typescript 内置的一种类型，实现的方法很简单，使用 keyof 即可。

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

这样，我们就将一个类型的所有类型变成可选的了，在类似获取 localStorage 的场景中还是非常实用的。

### 使用 Pick 来代替 as

首先说明的是 as 是一种强制类型转换，所以并不推荐使用，但是实际情况是，在很多时候，某些历史的方法接收的参数是某一种通用的类型，但是只使用了其中的一部分类型；这时如果其他的组件想要复用这个方法，那么就会考虑将传入的类型强制转化一下；但是会存在的一个很大问题是如果我们改写了方法，那么就很容易使得之前所有用到这个方法都受到影响。

Pick 给开发者带来了一个很有好的体验，我们直接使用 Pick 来表达我们具体想要使用的某一属性，Pick 的语意就可以理解为 `用多少，拿多少`。

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## 工具使用总结

### tsconfig 配置别名

在使用 webpack 作为打包工具时，通常会配置别名，例如将 `～/` 配置为 `src/`，具体的配置方法如下：

```json
"moduleResolution": "node", // 不清楚
"baseUrl": "./", // 一般为项目地址在当前路径的相对地址
"paths": {
  "~/*": ["src/*"]
},
```
