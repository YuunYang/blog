---
title:  "Js ES6中的”Super“和”Extends“"
categories:
  - FrontTech
tags: 
  - JavaScript
  - super keywords
  - Extends keywords
author_profile: true
toc: true
toc_label: "Js ES6中的”Super“和”Extends“"
toc_sticky: true
---
译自[https://medium.com/@anurag.majumdar](https://medium.com/beginners-guide-to-mobile-web-development/super-and-extends-in-javascript-es6-understanding-the-tough-parts-6120372d3420)

ES6通过类语法及其附加特性使JavaScript看起来简单得多。今天，我们将结合类语法特性和继承概念来运行一些代码。是的，你猜对了，我们来看一看 JavaScript' ES6中的 super和 extends关键字。学习新特性的最好方法是通过一个例子来深入了解它。所以，让我们开始吧!

## super和extends实例
如果希望扩展一个JavaScript类，我们可以通过`super`和`extends`关键字来完成。看一下接下来的例子。
```javascript

class Animal {
    constructor(name, weight) {
        this.name = name;
        this.weight = weight;
    }
    eat() {
        return `${this.name} is eating!`;
    }
    sleep() {
        return `${this.name} is going to sleep!`;
    }
    wakeUp() {
        return `${this.name} is waking up!`;
    }
}
class Gorilla extends Animal {
    constructor(name, weight) {
        super(name, weight);
    }
    climbTrees() {
        return `${this.name} is climbing trees!`;
    }
    poundChest() {
        return `${this.name} is pounding its chest!`;
    }
    showVigour() {
        return `${super.eat()} ${this.poundChest()}`;
    }
    dailyRoutine() {
        return `${super.wakeUp()} ${this.poundChest()} ${super.eat()} ${super.sleep()}`;
    }
}
function display(content) {
    console.log(content);
}
const gorilla = new Gorilla('George', '160Kg');
display(gorilla.poundChest()); // George is pounding its chest!
display(gorilla.sleep()); // George is going to sleep!
display(gorilla.showVigour()); // George is eating! George is pounding its chest!
display(gorilla.dailyRoutine()); // George is waking up! George is pounding its chest! George is eating! George is going to sleep!
```
上面的代码包含两个JavaScript类分别为`Animal`和`Gorilla`。

`Gorilla`类是`Animal`类的子类，它使用`extends`关键字将它自己设置成一个子类。

然而，`super`关键字却有两种不同的用法。在Gorilla的构造函数里，`super`作为一个”函数“。然后在Gorilla的**showVigour()**和**dailyRoutine()**方法里，则使用super作为”对象“。

super关键字有两种用法，原因如下: 第一种，super关键字用作一个“函数”，它调用父类Animal，并将参数传递给Gorilla。这是为了确保Gorilla是Animal的一个实例而进行的关键步骤。
第二种，super用作一个“对象”，它引用一个Animal实例(父类)。这里的super关键字用于显式调用父类Animal的方法。

熟悉c#、Java、Python等语言的人可以很好地理解这一切的工作原理。然而，在ES6出现之前，JavaScript并不是这么简单，尤其是对于类。那么，人们如何在不使用类语法、super和extends关键字的情况下编写代码呢？或者他们以前从未使用过这样的概念，然后突然决定添加这些？让我们来看看！
## 传统的JavaScript类
事实是，面向对象的JavaScript确实存在，并使用原型继承来扩展类。让我们看看完全相同但是是使用传统的JavaScript语法的例子。也许这能帮助我们找到隐藏的真相。
```javascript
function Animal(name, weight) {
    this.name = name;
    this.weight = weight;
}
Animal.prototype.eat = function() {
    return `${this.name} is eating!`;
}
Animal.prototype.sleep = function() {
    return `${this.name} is going to sleep!`;
}
Animal.prototype.wakeUp = function() {
    return `${this.name} is waking up!`;
}
function Gorilla(name, weight) {
    Animal.call(this, name, weight);
}
Gorilla.prototype = Object.create(Animal.prototype);
Gorilla.prototype.constructor = Gorilla;
Gorilla.prototype.climbTrees = function () {
    return `${this.name} is climbing trees!`;
}
Gorilla.prototype.poundChest = function() {
    return `${this.name} is pounding its chest!`;
}
Gorilla.prototype.showVigour = function () {
    return `${Animal.prototype.eat.call(this)} ${this.poundChest()}`;
}
Gorilla.prototype.dailyRoutine = function() {
    return `${Animal.prototype.wakeUp.call(this)} ${this.poundChest()} ${Animal.prototype.eat.call(this)} ${Animal.prototype.sleep.call(this)}`;
}
function display(content) {
    console.log(content);
}
var gorilla = new Gorilla('George', '160Kg');
display(gorilla.poundChest());
display(gorilla.sleep());
display(gorilla.showVigour());
display(gorilla.dailyRoutine());
```
看过代码之后，你们也许会在想，等等，Class这个词在哪儿？还有constructor？在没有extends和super关键字的情况下，如何在旧JavaScript代码中使用继承？这段代码看起来不难看吗？

是的，我知道你们的感受，我们意见一致。不幸的是，JavaScript的底层功能从未改变。无论添加了什么特性，它们始终保持不变。新关键字的使用，如类、构造函数、super，只是为代码增加了语法风格，使其可读性和开发人员友好。

让我解释一下ES6示例中的哪些代码行符合传统JavaScript示例。

如果你对JavaScript中的原型和继承概念还不熟悉，请在进入比较部分之前阅读以下文章:

[Prototypes in JavaScript](https://hackernoon.com/prototypes-in-javascript-5bba2990e04b)

[Inheritance in JavaScript](https://hackernoon.com/inheritance-in-javascript-21d2b82ffa6f)

这两个参考资料将帮助你很好地理解下一节。

## ES6与传统JavaScript代码的比较
下面几节将分解并比较用ES6和传统JavaScript风格编写的代码。
### Class申明
在下面的代码片段中比较类声明。
```javascript
// ES6 style
class Animal {
    constructor(name, weight) { // line 3
        this.name = name;
        this.weight = weight;
    }
    //...
}

// Check Type of ES6 class
typeof Animal // function // line 11

// Traditional style
function Animal(name, weight) { //line 14
    this.name = name;
    this.weight = weight;
}
// ...
```
ES6中的类声明直接使用Class关键字，然后在构造函数中定义实例变量。在传统JavaScript中，没有类这样的东西。实际上，类实际上是JavaScript的底层函数(请参考这段代码的第11行)。

第3行中的构造函数与第14行完全相同。函数Animal实际上是这里的构造函数。
## 方法作为类的一部分
```javascript
// ES6 style
class Animal {
    // ...
    eat() { // line 4
        return `${this.name} is eating!`;
    }

    sleep() {
        return `${this.name} is going to sleep!`;
    }

    wakeUp() {
        return `${this.name} is waking up!`;
    } // line 14
    // ...
}

// Traditional style
Animal.prototype.eat = function() { // line 19
    return `${this.name} is eating!`;
}

Animal.prototype.sleep = function() {
    return `${this.name} is going to sleep!`;
}

Animal.prototype.wakeUp = function() {
    return `${this.name} is waking up!`;
} // line 29
```
从4到14的代码行是存在于用于ES6样式的Animal类上的方法。然而，传统上这是不可能的，因为没有类这样的东西可以如此容易地声明方法。在传统JavaScript中，向原型添加方法使类可以使用这些方法。第19至29行是传统JavaScript类的方法。
## 映射扩展到传统JavaScript
当我们试图用子类扩展父类时，会出现更大的差异。请参考以下代码片段：
```javascript
// ES6 style
class Gorilla extends Animal {
    constructor(name, weight) {
        super(name, weight);
    }
  //...
}

// Traditional style
function Gorilla(name, weight) { // line 10
    Animal.call(this, name, weight);
}

Gorilla.prototype = Object.create(Animal.prototype); // line 14
Gorilla.prototype.constructor = Gorilla;
//...
```
我们可以看到`extends`关键字负责以ES6方式将父类Animal扩展到子类，但是这里也使用了super关键字，以确保通过Gorilla的构造函数调用Animal类，从而继承Animal的特性和行为。在这里，super关键字用作一个函数来调用Animal类来初始化Gorilla。在这里，super等同于Animal.call(this, ...)。

要使同样的事情在传统的JavaScript上发生，需要一些额外的步骤。Gorilla子类的函数需要按照第10行创建。由于Gorilla将继承Animal的特性和行为，因此必须在Gorilla的构造函数中调用Animal的构造函数，如第11行所示，这一行与第4行类似，并执行相同的操作。我们只需要显式地将“this”引用传递给Animal类，以确保调用来自Gorilla类。

此外，我们需要将Gorilla函数的原型设置为从Animal的原型创建的新对象，如第11行所示。在此过程中，我们覆盖了Gorilla的原型对象。因此，在接下来的第15行中，我们需要显式地设置Gorilla的构造函数。这些步骤负责将Gorilla类设置为Animal类的子类。（其实就是之前记录过的组合继承）
## super到传统JavaScript的映射
我们已经看到一个super关键字的映射，即例如下面代码片段中的第4行和第19行使用super作为函数。
```javascript
// ES6 style
class Gorilla extends Animal {
    constructor(name, weight) {
        super(name, weight);
    }

    showVigour() {
        return `${super.eat()} ${this.poundChest()}`;
    }

    dailyRoutine() {
        return `${super.wakeUp()} ${this.poundChest()} ${super.eat()} ${super.sleep()}`;
    }
    // ...
}

// Traditional style
function Gorilla(name, weight) {
    Animal.call(this, name, weight);
}

Gorilla.prototype = Object.create(Animal.prototype);
Gorilla.prototype.constructor = Gorilla;

Gorilla.prototype.showVigour = function () {
    return `${Animal.prototype.eat.call(this)} ${this.poundChest()}`;
}

Gorilla.prototype.dailyRoutine = function() {
    return `${Animal.prototype.wakeUp.call(this)} ${this.poundChest()} ${Animal.prototype.eat.call(this)} ${Animal.prototype.sleep.call(this)}`;
}
// ...
```
根据第8行和第12行，关键字super还可以用作父类的实例，以调用Animal类的特定细节。

为了达到同样的效果，在传统样式中，第26行和第30行显示了如何完成。super实例实际是ParentClassName.prototype.methodName.call(this, …)。因此，需要编写大量代码来确保显式调用父类的方法。
## 总结
我非常确定，你们会马上开始使用ES6的类和继承特性，不需要一眨眼的功夫，因为现在你已经知道了传统方法所提供的复杂性。另外，Chrome和Firefox目前都支持ES6，但为了使所有浏览器都支持ES6特性，需要babel转置器将所有ES6代码转换为ES5代码。

Happy hacking! 😄