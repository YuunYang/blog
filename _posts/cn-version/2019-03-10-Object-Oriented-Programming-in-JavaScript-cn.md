---
title:  "JavaScript中的面向对象的介绍"
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
toc_label: "JavaScript中的面向对象的介绍"
toc_sticky: true
hidden: true
header:
  image: /assets/images/2019-3-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/01.png
  caption: "JavaScript and Object-Oriented Programming"
---
[Rainer Hahnekamp于2018年11月16日](https://medium.freecodecamp.org/an-introduction-to-object-oriented-programming-in-javascript-8900124e316a)

*这篇文章是为那些之前没有任何面向对象编程知识的学习JavaScript的学生准备的。本文聚焦的仅仅只是与JavaScript相关的OOP知识，而不是通常意义上的OOP；我跳过了多态因为这样更适合静态类型语言。*

## 为什么你需要知道这些
是否选用JavaScript作为首选语言？想成为一个在系统跨越十几万行代码或者更多的大型企业中工作的主力开发人员吗？

除非你学习完全接收面向对象编程，不然便没有机会。

## 不同的心态
在足球比赛中，你可以全力防守，你可以踢边路传中进攻，也可以不顾一切的全力进攻。所有的策略都有一个共同的目标：赢下比赛。

编程规范同样也是如此。总是有很多方法来解决问题和设计解决方案。

面向对象编程（OOP），是现代应用开发的范例，受到很多主要语言像Java、c#、JavaScript的支持。

## 面向对象范型
从面向对象的角度来看，一个应用程序是众多相互通信的“对象”集合。我们将这些对象建立在现实世界的基础之上，比如库存和员工记录的产品。对象包含数据，并根据数据执行一些逻辑。因此，OOP是很容易理解的，难的是如何首相将应用分解成小的对象。

如果你像我第一次听说它，你根本不知道这是个什么意思 —— 这些听起来就很抽象。有这种感觉完全没什么问题。更重要的是你曾经听过这种说法，记住它，并且尝试在你的代码中应用OOP。随着时间的推移，并从中汲取经验，可以使自己的代码更多地符合这个理论概念。

**Lesson**: OOP based on real-world objects lets anyone read your code and understand what’s going on.

## 对象作为核心

![img][02]{: .align-center}

一个简单的例子将帮助你了解JavaScript如何实现OOP的基本原则。思考一个超市购物用例，在这个用例中，你将商品放入篮子中，然后计算你将支付价格的总和。如果使用JavaScript的知识但不考虑OOP，代码将会是以下：

```javascript
const bread = {name: 'Bread', price: 1};
const water = {name: 'Water', price: 0.25};
const basket = [];
basket.push(bread);
basket.push(bread);
basket.push(water);
basket.push(water);
basket.push(water);
const total = basket
  .map(product => product.price)
  .reduce((a, b) => a + b, 0);
console.log('one has to pay in total: ' + total);
```

从从OOP的观点来看问题，可以使我们更容易的编写好的代码，因为我们可以将对象类比成我们在现实世界里会偶遇的东西。因为我们的用例包含一个购物车产品，所以我们已经有两种对象——购物车对象和产品对象。

OOP版本的购物用例可以这样写：

```javascript
const bread = new Product('bread', 1);
const water = new Product('water', .25)
const basket = new Basket();
basket.addProduct(2, bread);
basket.addProduct(3, water);
basket.printShoppingInfo();
```

正如你在第一行中所看到的，我们使用关键字`new`后跟一个类的名称来创建一个新对象(如下所述)。其将返回一个对象，我们将该对象存储到变量bread中。我们对变量water重复这个步骤，并采用类似的路径创建一个变量basket。当你将这些产品添加到您的购物篮后，最终打印出你需要支付的总额。

这两个代码片段的差别是显而易见的。OOP的版本读起来几乎像真正的英语句子，你可以很容易地知道发生了什么。

**Lesson**: An object modeled on real-world things consists of data and functions.

## 类模板

![img][03]{: .align-center}

我们使用OOP中的类作为创建对象的模板。对象是“类的实例”，“实例化”是基于类创建对象。代码是在类中定义的，但除非在活动对象中，否则无法执行。

查看类似汽车蓝图这样的类。它们定义了汽车的扭矩和马力等性能，内部功能如空气与燃料的比例，以及点火等公众可以使用的方法。然而，只有当工厂实例化汽车时，你才能转动钥匙并开车。

在我们的用例中，我们使用Product类实例化两个对象，bread 和 water。当然，这些对象需要在类中提供的代码。它是这样的:

```javascript
function Product(_name, _price) {
  const name = _name;
  const price = _price;
this.getName = function() {
    return name;
  };
this.getPrice = function() {
    return price;
  };
}
function Basket() {
  const products = [];
this.addProduct = function(amount, product) {
    products.push(...Array(amount).fill(product));
  };
this.calcTotal = function() {
    return products
      .map(product => product.getPrice())
      .reduce((a, b) => a + b, 0);
  };
this.printShoppingInfo = function() {
    console.log('one has to pay in total: ' + this.calcTotal());
  };
}
```

JavaScript中的类看起来像函数，但使用起来是不一样的。函数的名称是类的名称并且是大写的。因为它不反悔任何东西，我们不会用通常的方法像`const basket = Product('bread', 1);`来调用函数。事实上，我们会添加new关键字`const basket = new Product('bread', 1);`。

函数内部的代码称为构造函数（constructor）。每次实例化的时候都会执行代码。Product有参数_name和_price。每个新对象都将这些值存储在其中。

此外，我们可以定义对象将提供的函数。我们通过前缀this关键字来定义这些函数，这使得它们可以从外部访问(参见封装)。注意，函数具有对属性的完全访问权。

Basket类创建一个新对象不需要任何参数。实例化一个新的Basket对象就是简单的生成一个空的列表，然后程序可以填充这些产品。

**Lesson**: A class is a template for generating objects during runtime.

## 封装

![img][04]{: .align-center}

可能会遇到另一种声明类的方法：

```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
}
```

注意this变量的属性赋值。第一眼看，这似乎是一个更好的版本，因为它不再需要getter方法（getName & getPrice）因此也会更短。

然而，现在却已经从外部完全访问了这些属性。所以每个人都可以访问和修改它:

```javascript
const bread = new Product('bread', 1);
bread.price = -10;
```

这是你不想看到的事情，它使得你的应用更难的维护。如果添加验证代码，比如判断价格是否小于0，将会如何？任何直接访问价格（price）属性的代码都会跳过验证。这将会导致错误更难被追踪、定位。另一方面，使用对象getter方法的代码保证会通过对象的价格验证。

对象应该有掌控其代码的专属权。换句话说，对象“封装”它们的数据并且防止其他对象直接访问数据。访问数据的唯一方法是间接的通过写在对象中的函数（getter、setter之类的）。

数据和处理(又名逻辑)属于同一类。对于较大的应用程序尤其如此，在这些应用程序中，将数据处理限制在特定定义的位置非常重要。

如果处理得当，OOP通过设计产生模块化，这是代码开发中的圣杯🍸。这样的方式远离了令人生畏的意大利面式代码，这样的代码中的所有的东西都紧紧的耦合在一起，就是改一小段的代码都不知道会发生什么。

在我们的例子中，类Product的对象不允许在初始化后更改价格或名称。Product的实例是只读的。

`Lesson`: Encapsulation prevents access to data except through the object’s functions.

## 继承

![img][05]{: .align-center}

继承允许你通过使用附加属性和函数扩展现有类来创建新类。这个新类“继承”它的父类的所有特性，避免从头开始创建新代码。此外，对父类所做的任何更改都将自动对子类可用。这使得更新更加容易。

假设我们有一个叫Book的新类，这个类有姓名、价格和作者属性。使用继承，你可以说一本书与产品相同，但是带有附加的author属性。我们说 Product 是 Book 的超类，Book 是 Product 的子类:

```javascript
function Book(_name, _price, _author) {
  Product.call(this, _name, _price);
  const author = _author;
  
  this.getAuthor = function() {
    return author;
  }
}
```

注意第一个参数是 `this` 中的附加 `Product.call` 。请注意:虽然 book 提供了 getter 方法，但它仍然不能直接访问属性名和价格。Book 必须从 Product 类调用该数据。

你现在可以添加一个 book 对象到 basket 没有任何问题:

```javascript
const faust = new Book('faust', 12.5, 'Goethe');
basket.addProduct(1, faust);
```

Basket 期望对象类型为 Product。由于书籍是通过书籍从产品中继承而来的，所以它也是一种产品。

**Lesson**: Subclasses can inherit properties and functions from superclasses while adding properties and functions of their own.

## JavaScript and OOP
You will find three different programming paradigms used to create JavaScript applications. They are Prototype-Based Programming, Object-Oriented Programming and Functional-Oriented Programming.

The reason for this lies in JavaScript’s history. Originally, it was prototype-based. JavaScript was not intended as a language for large applications.

Against the plan of its founders, developers increasingly used JavaScript for bigger applications. OOP was grafted on top of the original prototype-based technique.

The prototype-based approach is shown below. It is seen as the “classical and default way” to construct classes. Unfortunately it does not support encapsulation.

Even though JavaScript’s support for OOP is not at the same level as other languages like Java, it is still evolving. The release of version ES6 added a dedicated `class` keyword we could use. Internally, it serves the same purpose as the prototype property, but it reduces the size of the code. However, ES6 classes still lack private properties, which is why I stuck to the “old way”.

For the sake of completeness, this is how we would write the Product, Basket and Book with ES6 classes and also with the prototype (classical and default) approach. Please note that these versions don’t provide encapsulation:

```javascript
// ES6 version
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}
class Book extends Product {
  constructor(name, price, author) {
    super(name, price);
    this.author = author;
  }
}
class Basket {
  constructor() {
    this.products = [];
  }
  addProduct(amount, product) {
    this.products.push(…Array(amount).fill(product));
  }
  calcTotal() {
    return this.products
      .map(product => product.price)
      .reduce((a, b) => a + b, 0);
  }
  printShoppingInfo() {
    console.log('one has to pay in total: ' + this.calcTotal());
  }
}
const bread = new Product('bread', 1);
const water = new Product('water', 0.25);
const faust = new Book('faust', 12.5, 'Goethe');
const basket = new Basket();
basket.addProduct(2, bread);
basket.addProduct(3, water);
basket.addProduct(1, faust);
basket.printShoppingInfo();
//Prototype version

function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Book(name, price, author) {
  Product.call(this, name, price);
  this.author = author;
}
Book.prototype = Object.create(Product.prototype);
Book.prototype.constructor = Book;

function Basket() {
  this.products = [];
}
Basket.prototype.addProduct = function(amount, product) {
  this.products.push(...Array(amount).fill(product));
};
Basket.prototype.calcTotal = function() {
  return this.products
    .map(product => product.price)
    .reduce((a, b) => a + b, 0);
};
Basket.prototype.printShoppingInfo = function() {
  console.log('one has to pay in total: ' + this.calcTotal());
};
```
**Lesson**: OOP was added to JavaScript later in its development.

## Summary
As a new programmer learning JavaScript, it will take time to appreciate Object-Oriented Programming fully. The important things to understand at this early stage are the principles the OOP paradigm is based on and the benefits they provide:

- Objects modeled on real-world things are the centerpiece of any OOP-based application.
- Encapsulation protects data from uncontrolled access.
- Objects have functions that operate on the data the objects contain.
- Classes are the templates used to instantiate objects.
- Inheritance is a powerful tool for avoiding redundancy.
- OOP is more verbose but easier to read than other coding paradigms.
- Since OOP came later in JavaScript’s development, you may come across older code that uses prototype or functional programming techniques.

## Further reading
- [https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS)
- [http://voidcanvas.com/es6-private-variables/](http://voidcanvas.com/es6-private-variables/)
- [https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)
- [https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance)
- [https://en.wikipedia.org/wiki/Object-oriented_programming](https://en.wikipedia.org/wiki/Object-oriented_programming)

[02]: /assets/images/2019-3-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/02.png
[03]: /assets/images/2019-3-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/03.png
[04]: /assets/images/2019-3-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/04.png
[05]: /assets/images/2019-3-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/05.png