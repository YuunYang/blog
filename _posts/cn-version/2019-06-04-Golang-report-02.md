---
title: "Golang第二次学习报告"
categories:
  - report
tags: 
  - Golang
  - Backend
  - web
  - form
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---
## Go搭建一个web服务器
Go语言中提出了一个完善的net/http包，通过http包可以很方便的搭建一个可以运行的web服务。

### http包建立web服务器

```go
func sayhelloName(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()  //解析参数，默认是不会解析的
	fmt.Println(r.Form)  //这些信息是输出到服务器端的打印信息
	fmt.Println("path", r.URL.Path)
	fmt.Println("scheme", r.URL.Scheme)
	fmt.Println(r.Form["url_long"])
	for k, v := range r.Form {
		fmt.Println("key:", k)
		fmt.Println("val:", strings.Join(v, ""))
	}
	fmt.Fprintf(w, "Hello astaxie!") //这个写入到w的是输出到客户端的
}

func main() {
	http.HandleFunc("/", sayhelloName) //设置访问的路由
	err := http.ListenAndServe(":9090", nil) //设置监听的端口
	if err != nil { // nil是一个预先声明的标识符，表示指针、通道、函数、接口、映射或片类型的零值。类型必须是指针、通道、函数、接口、映射或片类型
		log.Fatal("ListenAndServe: ", err)
	}
}
```
以下均是服务器端的几个概念

- Request：用户请求的信息，用来解析用户的请求信息，包括post、get、cookie、url等信息
- Response：服务器需要反馈给客户端的信息
- Conn：用户的每次请求链接
- Handler：处理请求和生成返回信息的处理逻辑

下面是Go实现web服务的工作模式的流程图

![http包执行流程][01]{: .align-center}

1. 创建Listen Socket, 监听指定的端口, 等待客户端请求到来。

2. Listen Socket接受客户端的请求, 得到Client Socket, 接下来通过Client Socket与客户端通信。

3. 处理客户端的请求, 首先从Client Socket读取HTTP请求的协议头, 如果是POST方法, 还可能要读取客户端提交的数据, 然后交给相应的handler处理请求, handler处理完毕准备好客户端需要的数据, 通过Client Socket写给客户端。

下面代码来自Go的http包的源码，通过下面的代码我们可以看到整个的http处理过程：
```go
func (srv *Server) Serve(l net.Listener) error {
	defer l.Close()
	var tempDelay time.Duration // how long to sleep on accept failure
	for {
		rw, e := l.Accept()
		if e != nil {
			if ne, ok := e.(net.Error); ok && ne.Temporary() {
				if tempDelay == 0 {
					tempDelay = 5 * time.Millisecond
				} else {
					tempDelay *= 2
				}
				if max := 1 * time.Second; tempDelay > max {
					tempDelay = max
				}
				log.Printf("http: Accept error: %v; retrying in %v", e, tempDelay)
				time.Sleep(tempDelay)
				continue
			}
			return e
		}
		tempDelay = 0
		c, err := srv.newConn(rw)
		if err != nil {
			continue
		}
		go c.serve()
	}
}
```
这个函数就是处理接收客户端的请求信息。这个函数里面起了一个for{}，首先通过Listener接收请求，其次创建一个Conn，最后单独开了一个goroutine，把这个请求的数据当做参数扔给这个conn去服务：go c.serve()。这个就是高并发体现了，用户的每一次请求都是在一个新的goroutine去服务，相互不影响。

整个连接处理过程
![一个http连接处理流程][02]{: .align-center}

[Go的http包详解](https://github.com/astaxie/build-web-application-with-golang/blob/master/zh/03.4.md)

## 表单
提交一个页面到服务器，服务器端的处理如下：
```go
func sayhelloName(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()       //解析url传递的参数，对于POST则解析响应包的主体（request body）
	//注意:如果没有调用ParseForm方法，下面无法获取表单的数据
	for k, v := range r.Form {
		fmt.Println("key:", k)
		fmt.Println("val:", strings.Join(v, ""))
	}
	fmt.Fprintf(w, "Hello astaxie!") //这个写入到w的是输出到客户端的
}
func login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("method:", r.Method) //获取请求的方法
	if r.Method == "GET" {
	} else {
		//请求的是登录数据，那么执行登录的逻辑判断
	}
}
```

## 预防跨站脚本

[01]: /assets/images/2019-06-04-Golang-report/01.png
[02]: /assets/images/2019-06-04-Golang-report/02.png