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

## JavaScript 和 OOP
你将找到三种不同的用于生成JavaScript应用的编程范例，分别是基于原型编程，面向对象的程序设计和面向函数编程。

原因是JavaScript的历史遗留，最初它是基于原型的。JavaScript并不打算作为一门面向大型应用的语言。

为反对其创始人的计划，开发人员越来越多的使用JavaScript来构建大型应用，OOP是在原有原型技术的基础上移植的。

基于原型的方法如下所示它。它被视为构造类的“经典和默认方法”。遗憾的是他并不支持封装。

即时JavaScript支持OOP的程度并没有达到其他语言向Java的水平，但它始终是在进化。发行的ES6版本添加了一个专有的`class`关键字以供我们使用。在内部，它的作用和prototype属性相同，但是它减少的代码的大小。然而，ES6类仍然缺少私有属性，这就是为什么我坚持使用“旧方法”。

基于完整性的考量，我们将使用ES6类以及原型(经典和默认)方法编写Product、Basket和 Book。请注意这些版本不提供封装：

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

## 总结
作为一名学习JavaScript的新程序员，完全理解面向对象编程需要花费一些时间。在这个早期阶段，重要的是理解OOP范例所基于的原则以及其提供的便利：

- 对象基于现实世界建模是任何基于OOP的应用程序的核心。
- 封装保护数据不受非受控访问。
- 对象具有对对象包含的数据进行操作的函数。
- 类是用于实例化对象的模板。
- 继承是避免冗长的有利手段。
- OOP看起来啰嗦，但是其会比其他编码范例更易读。
- 由于OOP在JavaScript开发中后来出现，你可能会遇到使用原型或函数式编程技术的旧代码。
## Further reading
- [https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS)
- [http://voidcanvas.com/es6-private-variables/](http://voidcanvas.com/es6-private-variables/)
- [https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)
- [https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance)
- [https://en.wikipedia.org/wiki/Object-oriented_programming](https://en.wikipedia.org/wiki/Object-oriented_programming)

[02]: /assets/images/2019-03-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/02.png
[03]: /assets/images/2019-03-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/03.png
[04]: /assets/images/2019-03-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/04.png
[05]: /assets/images/2019-03-10-An-introduction-to-Object-Oriented-Programming-in-JavaScript/05.png