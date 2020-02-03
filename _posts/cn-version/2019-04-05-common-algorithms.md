---
title: "常见JS代码题"
categories:
  - FrontTech
tags:
  - 工作
  - 前端
  - 算法
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---
记录前端面试中常出现的算法问题

[前端面试题总结](/fronttech/front-end/)

[前端面试题总结-01](/fronttech/front-end-01/)

[计算机网络总结](/fronttech/network/)
## 语言实现
### 原生js解析cookie

```javascript
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
```
正则解释：**^| name**表示匹配开始或者匹配空格，**=([^;]*)**匹配‘=’加上后面的一直的非‘;’，最后 **(;|$)**匹配最后的‘;’或最后结束

### jS实现兼容的div拖放功能

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>tmp.html</title>
    <style>
        .content {
            background-color: #bfbfbf;
            height: 500px;
        }
        .obj {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            border: 1px solid green;
            background-color: orange;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content" id="obja"></div>
        <div class="obj" id="objb"></div>
        <p id="para"></p>
    </div>
    <script>
        var flag = false;
        var sx, sy, cx, cy, dx, dy;
        var obj = document.getElementById("objb");
        if(obj.addEventListener) { // 除IE8已下都可以
            obj.addEventListener('mousedown', function(event) {dragStart(event);}, false);
            obj.addEventListener('mousemove', function(event) {dragMove(event);}, false);
            document.body.addEventListener('mouseup', function(event) {dragEnd(event);}, false);
        }
        else if(obj.attachEvent){
            obj.attachEvent('onmousedown', function(event) {dragStart(event);});
            obj.attachEvent('onmousemove', function(event) {dragMove(event);});
            document.body.attachEvent('onmouseup', function(event) {dragEnd(event);});
        } else {
            obj['onmousedown'] = function(event) {dragStart(event);}
            obj['onmousemove'] = function(event) {dragMove(event);}
            obj['onmouseup'] = function(event) {dragEnd(event);}
        }
        function dragStart(event) {
            flag =true;
            sx = event.clientX;
            sy = event.clientY; // client是moseevent，所以sx，sy为鼠标的位置，要判断鼠标在框框内
            dx = obj.offsetLeft;
            dy = obj.offsetTop;
        }
        function dragMove(event) {
            if(flag) {
                cx = event.clientX;
                cy = event.clientY;
                obj.style.left = cx - sx + dx + 'px';
                obj.style.top = cy - sy + dy + 'px';
                if(event.preventDefault) { // 可加可不加
                    document.addEventListener("mousemove", function(){
                        event.preventDefault(); // 默认动作不要做
                    }, false); // false代表事件冒泡，true代表事件捕获
                } else {
                    document.attachEvent("onmousemove", function(){
                        window.event.returnValue = false;
                    });
                }
            }
        }
        function dragEnd(event) {
            flag = false;
        }
    </script>
</body>
</html>
```

### css实现tab切换

关键代码是label的for标签，这样相当于可以和for绑定的radio有一个联动
```html
<div class="tabs">
  <div class="tab-pane">
    <input type="radio" name="tab" id="tab01" checked />
    <label class="tab-item" for="tab01">tab01</label>
    <div class="tab-content">111</div>
  </div>
  <div class="tab-pane">
    <input type="radio" name="tab" id="tab02"/>
    <label class="tab-item" for="tab02">tab02</label>
    <div class="tab-content">222</div>
  </div>
  <div class="tab-pane">
    <input type="radio" name="tab" id="tab03"/>
    <label class="tab-item" for="tab03">tab03</label>
    <div class="tab-content">333</div>
  </div>
</div>
```
各种选择器，注意+是选择紧接在xx元素之后的所有xx元素。
```css
.tabs{
  position:relative;
  width:400px;
  height:300px;
}
.tab-pane{
  display:inline-block;
}
.tabs input[type='radio']{
  position:absolute;
  clip:rect(0,0,0,0)
}
.tab-item{
  display:block;
  height:34px;
  line-height:34px;
  cursor:pointer;
  padding:0 10px
}

.tabs input[type='radio']:checked+.tab-item{
  background:orangered;
  color:#fff
}

.tab-content{
  position:absolute;
  border:1px solid #eee;
  padding:20px;
  left:0;
  top:36px;
  bottom:0;
  right:0;
  background:#fff;
}

.tabs input[type='radio']:checked+.tab-item+.tab-content{
  z-index:1
}
```

### 原生实现autocomple

```html
 <div id="div1">
    <input type="text" id="input" placeholder="有autocomplete的输入框"/>
    <ul id="ul">
    </ul>
</div>
```
```css
*{
    margin: 0;
    padding: 0;
    box-sizing:border-box;
}
ul{
    list-style: none;
    margin: 0 auto;
    background-color: #ededed;
    color: #3b200c;
    width: 400px;
    border: none;
}
li{
    cursor: pointer;
}
input{
    display: block;
    margin: 0 auto;
    line-height: 40px;
    height: 40px;
    width: 400px;
    font-size: 20px;
}
```
```javascript
var arr = ['a','apple','abandon','bilibili','beep','before','become','being','highmaintains','by','bye','banana']
input.addEventListener('input', function(event){
    var _value = event.target.value.trim()
    if(_value){
        autoComplete(_value, arr)
    }
    else{
        ul.innerHTML = ''
    }
})
function autoComplete(str, arr){
    var lis = []
    arr.forEach((word)=>{
        if(word.startsWith(str)){
            lis.push('<li>' + word + '</li>')
        }
    })
    ul.innerHTML = lis.join('')
}
function addToInput(li){
    var _txt = li.innerText
    input.value = _txt
}
ul.addEventListener('click', function(event){
    if(event.target.tagName.toLowerCase() === 'li'){
        addToInput(event.target)
    }
})
```

### JS浅拷贝与深拷贝
- 浅拷贝也就是拷贝引用；拷贝原对象的实例，但是对其内部的引用类型值，拷贝的是其引用，jQuery的一些方法`Array.prototype.slice()`、`Array.prototype.concat()`都可以返回一个对象或者数组的浅拷贝。

```javascript
function shallowClone(source) {
    if (!source || typeof source !== 'object') {
        throw new Error('error arguments');
    }
    var targetObj = source.constructor === Array ? [] : {};
    for (var keys in source) {
        if (source.hasOwnProperty(keys)) {
            targetObj[keys] = source[keys];
        }
    }
    return targetObj;
}
```
- 深拷贝即拷贝实例，深拷贝拷贝出一个新的实例，新的实例和之前的实例互不影响。

```javascript
// 递归实现一个深拷贝
function deepClone(source){
   if(!source || typeof source !== 'object'){
     throw new Error('error arguments', 'shallowClone');
   }
   var targetObj = source.constructor === Array ? [] : {};
   for(var keys in source){
      if(source.hasOwnProperty(keys)){
         if(source[keys] && typeof source[keys] === 'object'){
           targetObj[keys] = source[keys].constructor === Array ? [] : {};
           targetObj[keys] = deepClone(source[keys]);
         }else{
           targetObj[keys] = source[keys];
         }
      }
   }
   return targetObj;
}
```

### es5实现es6相关特性
首先是const：
```javascript
var __const = function __const (data, value) {
    window.data = value // 把要定义的data挂载到window下，并赋值value
    Object.defineProperty(window, data, { // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
        enumerable: false,
        configurable: false,
        get: function () {
            return value
        },
        set: function (data) {
            if (data !== value) { // 当要对当前属性进行赋值时，则抛出错误！
                throw new TypeError('Assignment to constant variable.')
            } else {
                return value
            }
        }
    })
}
```
然后还有super等，参考[Js ES6中的”Super“和”Extends](/fronttech/Super-and-Extends-In-ES6)以及原文链接[https://medium.com/@anurag.majumdar](https://medium.com/beginners-guide-to-mobile-web-development/super-and-extends-in-javascript-es6-understanding-the-tough-parts-6120372d3420)

### ES6实现event类
- on(event,fn)：监听event事件，事件触发时调用fn函数
- once(event,fn)：为指定事件注册一个单次监听器，单次监听器最多只触发一次，触发后立即解除监听器；
- emit(event,arg1,arg2,arg3...)：触发event事件，并把参数arg1,arg2,arg3....传给事件处理函数；
- off(event,fn)：停止监听某个事件（就是把event队列里，叫fn的方法移除）。
```javascript
class EventEmitter {
  constructor () {
    this._events = {};
  }
  on (event, callback) {
    //监听event事件，触发时调用callback函数
    let callbacks = this._events[event] || [];
    callbacks.push (callback);
    this._events[event] = callbacks;
    return this;
  }
  off (event, callback) {
    //停止监听event事件
    let callbacks = this._events[event];
    this._events[event] = callbacks && callbacks.filter (fn => fn !== callback);
    return this;
  }
  emit (...args) {
    //触发事件，并把参数传给事件的处理函数
    const event = args[0];
    const params = [].slice.call (args, 1);
    const callbacks = this._events[event];
    callbacks.forEach (fn => fn.apply (this, params));
    return this;
  }
  once (event, callback) {
    //为事件注册单次监听器
    let wrapFanc = (...args) => {
      callback.apply (this, args);
      this.off (event, wrapFanc);
    };
    this.on (event, wrapFanc);
    return this;
  }
}
```
## 前端算法
### 函数柯里化

```javascript
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = [].slice.call(arguments);
    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var adder = function () {
        var _adder = function() {
            [].push.apply(_args, [].slice.call(arguments));
            return _adder; // 在这里递归，用到了闭包的特性
        };
        // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
        _adder.toString = function () {
            return _args.reduce(function (a, b) {
                return a + b;
            });
        }
        return _adder;
    }
    return adder.apply(null, [].slice.call(arguments));
}
// 输出结果，可自由组合的参数
console.log(add(1, 2, 3, 4, 5));  // 15
console.log(add(1, 2, 3, 4)(5));  // 15
console.log(add(1)(2)(3)(4)(5));  // 15
```
还有一个版本
```javascript
function curry(fn, args) {
    var length = fn.length;
    args = args || [];
    return function() {
        var _args = args.slice(0),
            arg, i;
        for (i = 0; i < arguments.length; i++) {
            arg = arguments[i];
            _args.push(arg);
        }
        if (_args.length < length) {
            return curry.call(this, fn, _args);
        }
        else {
            return fn.apply(this, _args);
        }
    }
}
var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});
fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]
```

### 数组扁平化
```javascript
var arr = [1, [2, [3, 4, [5, 6]]]];
var deep = 3;
function flatten(arr, deep) {
    var result = [];
    if(deep == 0) {
        result.push(arr);
    }else{
        for (var i = 0, len = arr.length; i < len; i++) {
            if (Array.isArray(arr[i])) {
                result = result.concat(flatten(arr[i], deep-1));
            }
            else {
                result.push(arr[i])
            }
        }
    }
    return result;
}
console.log(flatten(arr, deep))
```
### 数组去重
这里的typeof是保证`1`和`'1'`不相等，如typeof 1 + 1就是`number1`，先算的typeof 1

```javascript
var array = [1, 2, 1, 1, '1'];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

console.log(unique(array)); // [1, 2, "1"]
```

### 把一串数字表示成千位分隔

`/(\d)(?=(\d{3})+(?!\d))/g`；‘?=’表示前瞻，`exp1(?=exp2)`查找exp2前面的exp1（因此在这里就是查找三个数字前面的空白）；?! 表示负前瞻，`exp1(?!exp2)`查找后面不是exp2的exp。例如`12355.6789`，在匹配到`.`之前，都会忽略之后的内容。

### 驼峰与下划线命名互转
```javascript
// 下划线转换驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
function toLine(name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}
```

### 根据 parent_id 生成层级树
类似
```javascript
var data = [
    {id: 1, parent_id: 0, name: "A"},
    {id: 2, parent_id: 1, name: "AA"},
    {id: 3, parent_id: 1, name: "AB"},
    {id: 4, parent_id: 3, name: "ABA"},
    {id: 5, parent_id: 3, name: "ABB"},
    {id: 6, parent_id: 3, name: "ABC"},
    {id: 7, parent_id: 1, name: "AC"},
    {id: 8, parent_id: 7, name: "ACA"},
    {id: 9, parent_id: 8, name: "ACAA"},
    {id: 10, parent_id: 8, name: "ACAB"},
]
```
转化为一种层级关系：
```javascript
function list_to_tree(data) {
  let res = {};
  // res 存放结果
  for(let i = 0; i < data.length; i++) {
    let row = data[i];
    row.parent = row.parent ? row.parent : 0;
    if(res[row.name]) { // 多层层级时，因为 object 的引用关系，所以还是可以构建成多层层级。
      Object.assign(res[row.name], { // 在 children 出现在 parent 之前时，res[row.name] 为children
        name: row.name,
        attributes: row.attributes
      });
    } else {
      res[row.name] = {
        name: row.name,
        attributes: row.attributes,
        children: []
      };
    }
    if(res[row.parent]) {
      res[row.parent].children.push(res[row.name]);
    } else {
      res[row.parent] = {children: [res[row.name]]};
    }
  }
  return res[0].children;
}
```


## 传统/常见算法
### 大数相加

```javascript
function sumStrings(a, b) {
    var res = '', c = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || c) {
        c += ~~a.pop() + ~~b.pop(); // ~~将字符串转化为数字
        res = c % 10 + res;
        c = c > 9; // 如果大于9则有进位，c=1
    }
    return res.replace(/^0+/, '');
}
```
### 合并两个有序数组

```javascript
function combine(n1, n2){
    let i = n1.length - 1, j = n2.length - 1, tar = i + j + 1;
    while (j >= 0) {
        n1[tar--] = i >= 0 && n1[i] > n2[j] ? n1[i--] : n2[j--];
    }
    return n1;
}
```
### 链表逆序

先把 head->next 拿出来存在 next 中，预备下一次 while 使用；

然后将 head->next 赋予为 new_head（可以看到依次是NULL、1、2->1...），然后 head 临时变成1，2->1...；

后续好理解了。

```c++
ListNode* reverseList(ListNode* head){
  ListNode *new_head = NULL;
  while(head){
    ListNode *next = head->next;
    head->next = new_head;
    new_head = head;
    head = next;
  }
  return new_head;
}
```
### 快速排序

`[4,3,5,2,1]`第一趟排序的结果为`[2,3,1,4,5]`;；即先$$1<4$$且$$5>4$$，5与1先交换，然后到2时$$i=j$$，此时2与初始4交换。
```javascript
function _quickSort(num, left, right) {
    if (left >= right) return num;
    var i = left, j = right, temp = num[left];
    while (i != j) {
        while (num[j] >= temp && i < j) j--;
        while (num[i] <= temp && i < j) i++;
        if(i < j){ // 选一大一小交换
            let t = num[i];
            num[i] = num[j];
            num[j] = t;
        }
    }
    num[left] = num[i]; // 已下将最终基数归位
    num[i] = temp;
    _quickSort(num, left, j - 1);
    _quickSort(num, i + 1, right);
}
```
### 全排列

```javascript
function permute(nums){
    var result = [];
    backtrack(nums, 0, result);
    return result;
}

function backtrack(nums, begin, result) {
    if(begin >= nums.length){
        return result.push(nums.slice());
    }
    for(let i = begin; i < nums.length; i++){
        var temp;
        temp = nums[begin];
        nums[begin] = nums[i];
        nums[i] = temp;
        backtrack(nums, begin + 1, result);
        nums[i] = nums[begin];
        nums[begin] = temp;
    }
}
```
### 二叉树的层次遍历
进行层次遍历，需要建立一个循环队列。先将二叉树的头结点入队列，然后出队列访问该节点，如果有左子树，将左子树的根节点入队，如果有右子树，右子树根节点入队列；然后再依次出队。

```cpp
void level(BTNode *p){
    int front, rear;
    BTNode *que[maxSize];
    front=rear=0;
    BTNode *q;
    if(p!=NULL){
        rear = (rear+1)%maxSize;
        que[rear] = p; // 根节点入队
        while(front != rear){  // 当列表不为空
            front = (front+1)%maxSize;
            q = que[front]; // 根节点出队
            visit(q); // 访问队头结点
            if(q->left != NULL){
                rear = (rear+1)%maxSize;
                que[rear] = q->left;
            }
            if(q->right != NULL){
                rear = (rear+1)%maxSize;
                que[rear] = q->right;
            }
        }
    }
}
```
