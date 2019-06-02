---
title: "Golang第一次学习报告"
categories:
  - report
tags: 
  - Golang
  - Backend
  - Http
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---
开新坑，开始学Golang，许愿不烂尾。

基础的学习来自[https://github.com/astaxie/build-web-application-with-golang](https://github.com/astaxie/build-web-application-with-golang)
## Golang语言基础
### 定义变量
定义变量与JavaScript相似都是使用`var`关键字，有一点不同的是类型值在后面
```go
var variableName type
```
定义多个变量
```go
//定义三个类型都是“type”的变量
var name1, name2, name3 type
```
其中`type`是可以省略的，`var`也可以简写成类似于`name1, name2, name3 := v1, v2, v3`
### 常量
常量使用`const`定义，与变量不同，常量的类型放在常量与常量初始赋值之间（也可以不指定类型）
```go
const Pi float32 = 3.1415926
```
### 内置数据类型
- bool类型
- 整型可以分为`int`和`uint`即有符号型和无符号型，都是从8位到32位，表示例如`int8`与`uint8`，**不同类型之间是不允许**；浮点数有`float32`和`float64`（默认）两种（没有float类型）；甚至，go还支持复数分为`complex128`（默认，64位实数+64位虚数）和`complex64`等。
- 字符串`string`采用UTF-8编码，使用`""`和``` ```表示；可以使用`+`拼接字符串。当定义后，字符串是不可变的，如果需要修改则需要先转化为[]byte类型或使用切片：
    ```go
    s := "hello"
    c := []byte(s)  // 将字符串 s 转换为 []byte 类型
    c[0] = 'c'
    s2 := string(c)  // 再转换回 string 类型
    fmt.Printf("%s\n", s2)
    // 或
    s := "hello"
    s = "c" + s[1:] // 字符串虽不能更改，但可进行切片操作
    fmt.Printf("%s\n", s)
    ```
- 错误类型；Go内置error类型，Go的package里面还专门有一个包errors来处理错误：
    ```go
    err := errors.New("emit macho dwarf: elf header corrupted")
    if err != nil {
        fmt.Print(err)
    }
    ```
- Go数据底层的存储；基础类型底层都是分配了一块内存，然后存储了相应的值。
    ![Go底层存储结构][01]
- 枚举`iota`，这个关键字用来声明枚举类型，开始默认为0，const声明中每一行增加1

### 数组
声明一个数组：
```go
var arr [n]type
```
其中`n`表示数组的长度，`type`元素的类型，注意点：
- 长度也是数组的类型一部分，因此长度不一样的数组类型也不一样；数组的长度是事先定义好的，不可以再改变。
- 数组之间的赋值是值的赋值，即当把一个数组作为参数传入函数的时候，传入的其实是该数组的副本，而不是它的指针。
- 如果要使用指针，那么就需要用到后面介绍的`slice`类型了。

### slice
`slice`可以理解为“动态数组”（一般的理解是切片，是一个动词，但这里的切片也是一个名词）。它是一个引用类型，`slice`总是指向一个底层`array`。声明一个`slice`。和声明`array`不同的一点就是不需要指定长度：
```go
var slice1 []type
```
`slice`可以从一个数组或一个已经存在的`slice`中再次声明（就是一般理解的切片操作`a := arr[2:5]`）。`slice`是引用类型，所以当改变其中元素的值的时候，其它的所有引用都会改变该值。

看一下这个例子：
```go
Array_a := [10]byte{'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'}
Slice_a := Array_a[2:5]
```
上面代码的结构为：
![slice对应数组的结构][02]
对于`slice`有几个重要的点：
- `len`表示长度、`cap`表示最大容量
- `copy`函数从源`slice`的`src`中复制元素到目标`dst`，并且返回复制的元素的个数
- `append`操作会向`slice`中追加一个或多个元素，然后返回一个同样类型的`slice`。需要注意的是，`append`操作在`slice`还有剩余空间（即`(cap-len) != 0`）时，会修改引用的数组的内容。也就是说其他引用此数组的`slice`也会被修改。否则，将动态分配新的数组空间，返回的slice数组指针将指向这个空间，而原数组的内容将保持不变；其它引用此数组的`slice`则不受影响。
### map
`map`可以理解为python中字典的概念，它的格式为`map[keyType]valueType`，中间没有空格分离。使用无差，主要注意几点：
- 无序
- 长度不固定
- `len`属性返回`key`的数量
- `map`和其他基本型别不同，它不是thread-safe，在多个go-routine存取时，必须使用mutex lock机制
- 通过`delete(map, key)`来删除为`key`的元素
- 引用类型

### make、new操作
内建函数new本质上说跟其它语言中的同名函数功能一样：`new(T)`分配了零值**填充**的T类型的内存空间，并且返回其地址，即一个`*T`类型的值。用Go的术语说，**它返回了一个指针**，指向新分配的类型T的零值。

make只能创建slice、map和channel，并且返回一个**有初值（非零）的T类型**，而不是`*T`，原因是因为这三种类型在指向数据结构的引用在使用之前必须初始化。

下面这个图详细的解释了new和make之间的区别。
![make和new对应底层的内存分配][03]

## 函数
函数的结构：
```go
func funcName(input1 type1, input2 type2) (output1 type1, output2 type2) {
	//这里是处理逻辑代码
	//返回多个值
    return value1, value2 // 这里的返回值是与上面的output相对应的
    // 另一种返回写法
    // handle output1 and output2 as variables like output1 = xxx, then
    return
}
```

### 变参
Go函数支持变参。接受变参的函数是有着不定数量的参数的。
```go
func myfunc(arg ...int) {}
```
告诉函数接受不定数量的参数。这些参数的类型全部是`int`
### 传值与传指针
传值`func add(a int) int`，传指针`func add(a *int) int`
### defer
defer延迟语句，可以在函数中添加多个defer语句。当函数执行到最后时，这些defer语句会按照逆序执行（后进先出的模式），最后该函数返回。
### 函数作为值、类型
在Go中函数也是一种变量，我们可以通过type来定义它，它的类型就是所有拥有相同的参数，相同的返回值的一种类型。
```go
type typeName func(input1 inputType1 , input2 inputType2 [, ...]) (result1 resultType1 [, ...])
```
然后就可以像其他变量那样传递了。
### Panic和Recover
Go没有像Java那样的异常机制，它不能抛出异常，而是使用了panic和recover机制。原则就是少用。

Panic

> 是一个内建函数，可以中断原有的控制流程，进入一个panic状态中。当函数F调用panic，函数F的执行被中断，但是F中的延迟函数会正常执行，然后F返回到调用它的地方。在调用的地方，F的行为就像调用了panic。这一过程继续向上，直到发生panic的goroutine中所有调用的函数返回，此时程序退出。panic可以直接调用panic产生。也可以由运行时错误产生，例如访问越界的数组。

Recover

> 是一个内建的函数，可以让进入panic状态的goroutine恢复过来。**recover仅在延迟函数中有效**。在正常的执行过程中，调用recover会返回nil，并且没有其它任何效果。如果当前的goroutine陷入panic状态，调用recover可以捕获到panic的输入值，并且恢复正常的执行。

`Panic`可以理解成为抛出异常，而`Recover`则可以理解为监听异常，当发生的时候进行处理。

### main函数和init函数
init函数（能够应用于所有的package）和main函数（只能应用于package main）。Go程序会自动调用init()和main()，所以你不需要在任何地方调用这两个函数。每个package中的init函数都是可选的，但package main就必须包含一个main函数。

程序的初始化和执行都起始于`main`包。如果`main`包还导入了其它的包，那么就会在编译时将它们依次导入。有时一个包会被多个包同时导入，那么它只会被导入一次（例如很多包可能都会用到`fmt`包，但它只会被导入一次，因为没有必要导入多次）。当一个包被导入时，如果该包还导入了其它的包，那么会先将其它包导入进来，然后再对这些包中的包级常量和变量进行初始化，接着执行`init()`函数（如果有的话），依次类推。等所有被导入的包都加载完毕了，就会开始对`main`包中的包级常量和变量进行初始化，然后执行`main`包中的`init()`函数（如果存在的话），最后执行`main()`函数。下图详细地解释了整个执行过程：
![main函数引入包初始化流程图][04]
注意区分`main`包和`main()`函数
### import
- 点操作
```go
import(
    . "fmt"
)
```
这个点操作的含义就是这个包导入之后在你调用这个包的函数时，你可以省略前缀的包名，也就是前面你调用的fmt.Println("hello world")可以省略的写成Println("hello world")
- 别名操作

别名操作顾名思义我们可以把包命名成另一个我们用起来容易记忆的名字
```go
import(
    f "fmt"
)
```

- _操作

```go
import (
    "database/sql"
    _ "github.com/ziutek/mymysql/godrv"
)
```
_操作其实是引入该包，而不直接使用包里面的函数，而是调用了该包里面的init函数。

## struct


[01]: /assets/images/2019-06-02-Golang-report/01.png
[02]: /assets/images/2019-06-02-Golang-report/02.png
[03]: /assets/images/2019-06-02-Golang-report/03.png
[04]: /assets/images/2019-06-02-Golang-report/04.png