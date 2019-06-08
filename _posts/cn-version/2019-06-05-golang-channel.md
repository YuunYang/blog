---
title: "Golang channel"
categories:
  - golang
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
本文参考：

- [*深入理解 Go Channel*](http://legendtkl.com/2017/07/30/understanding-golang-channel/) by Legendtkl
- [*Anatomy of Channels in Go - Concurrency in Go*](https://medium.com/rungo/anatomy-of-channels-in-go-concurrency-in-go-1ec336086adb) by Uday Hiwarale
- [*build web application with golang*](https://github.com/astaxie/build-web-application-with-golang/blob/master/zh/02.7.md) by astaxie

## Channel基础知识

### 创建channel
使用`make`创建一个channel：
```go
ch := make(chan int) // method 1
ch_N := make(chan int, N) // method 2
```
上面两个操作分别创建了一个无缓冲和有缓冲的大小为 N 的 channel，注意使用之前一定要用 make 创建，不然 channel 内容为 nil ，会无法读写数据而且会出现 dead lock 错误。

- 无缓冲channel：
> 发送和接受是同时发生的，如果没有 goroutine 读取 channel ，则发送者会一直阻塞。
- 有缓冲channel：
> 类似于一个有容量的队列。当队列满的时候发送者会阻塞；当队列空的时候接收者会阻塞。

默认情况下，channel接收和发送数据都是阻塞的。这样做的好处是使 goroutine 的同步变得简单，我们不需要显示 lock。 channel 会告诉调度程序调度另一个 gr ，因此程序永远不会在同一个 gr 上阻塞。

### channel读写与关闭
channel读写：
```go
ch := make(chan int, 10)
// 读操作
x <- ch
// 写操作
ch <- x
```

channel关闭：
```go
ch := make(chan int)
close(ch)
```

- 重复关闭 channel 、向关闭的 channel 发送数据都会 panic。
- 从关闭的 channel 读数据不会 panic，读出 channel 中已有的数据之后再读就是 channel 类似的默认值，比如 chan int 类型的 channel 关闭之后读取到的值为0。

可以使用 ok-idiom 方式，判断channel是否关闭：
```go
ch := make(chan int, 10)
...
close(ch)
// ok-idiom 
val, ok := <-ch
if ok == false {
    // channel closed
}
```

## Channel实践
首先看一下在goroutine中实践
```go
func greet(c chan string) {
    fmt.Println("Hello " + <-c + "!")
}
func main() {
    fmt.Println("main() started")
    c := make(chan string)
    go greet(c)
    c <- "John"
    fmt.Println("main() ended")
}
// main() started
// Hello John!
// main() ended
```
看一看上面代码的过程：
- greet操作不做赘述，接收一个channel并读取其中的数据
- main函数中打印 start ，然后创建一个 string 类型的 channel
- 将channel c传递给 greet 函数，但是使用go关键字将其作为 goroutine 执行。现在有了两个 goroutine （包含 main 和前面 go 创建的）。
- 然后我们将字符串 “John” 传入 c 。这个时候，goroutine 会阻塞直到另一个 goroutine 从中读取它。 Go 调度程序调度程序 greet goroutine。
- 最后结束。

### Deadlock
正如前面讨论过的，当从一个 channel 中写入或读取数据的时候， goroutine 会被阻塞，控制被传递给可用的 goroutine 。如果没有其他 goroutine 可用，例如都在休眠中。这个时候就会出现死锁。

> 当尝试从一个没有可用值的channel中读取数据的时候，当前 goroutine 会被阻塞，然后唤醒其他 goroutine 再来将值 push 到 channel 中。发送数据亦是如此。（所以我们上面会使用 go 关键字传递数据，因为必须要要保证有两个以上的 goroutine）

## 多种goroutine

### 单向 channel
前面说过的可读和可写的操作的 channel 可以称之为双向 channel。相对而言，也可以创建单向 channel ，即只读或只写的 channel。**使用单向 channel 增加了程序的安全性**

同样需要使用 make 函数创建，不同的是需要一个额外的箭头符号来表示单向 channel。

```go
roc := make(<-chan int) // read only, arrow point away from chan
soc := make(chan<- int) // write only, arrow point to chan
```

如果我们需要在例如 main 中读或写 goroutine， 但在另一个 goroutine 中却只需要只读或者只写。 Golang 提供了一种简单的方式：
```go
func foo(ch chan<- int) <-chan int {...}
```
foo 的形参是一个只能写的 channel（关键），那么就表示函数 foo 只会对 ch 进行写，当然你传入的参数可以是个普通 channel。foo 的返回值是一个只能读的 channel，那么表示 foo 的返回值规范用法就是只能读取。

### channel 类型的 channel
channel 可以被用在任何地方，包括另一个 channel 中。
```go
func greet(c chan string) {
  fmt.Println(<-c)
}
func greeter(cc chan chan string) {
  c := make(chan string)
  cc <- c
}
func main() {
  cc := make(chan chan string)
  go greeter(cc)
  c := <- cc
  go greet(c)
  c <- "John"
}
```

### Select
select 类似于 switch