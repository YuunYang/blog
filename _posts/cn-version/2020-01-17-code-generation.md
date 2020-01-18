---
title: "代码自动生成"
categories:
  - FrontTech
tags:
  - algorithm
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---

代码自动生成调研与记录

## 项目总结
项目结构：

![项目结构][01]{: .align-center}

`_utils` 表示工具类代码，主要是 `analyze.js`。
### analyze.js

解析，以解析 props 为例：
```javascript
const parseProps = function(astTree){
  const checkMemberExpression = function(member){
    if((member && member.name === 'props')||
      (member && member.property && member.property.name === 'props')
      ){
      return true;
    }
  }
  const deepSearchProps = function(source){
    if(!source || typeof source !== 'object'){
      throw new Error('error arguments', 'shallowClone');
    }
    var targetArray = [];
    for(var keys in source){
      if(source.hasOwnProperty(keys) && source[keys] && typeof source[keys] === 'object'){
        if(source[keys].type === 'MemberExpression' && checkMemberExpression(source[keys].object)){ // 直接使用 this.props.a 获取 props
          targetArray.push(source[keys].property.name)
        }
        if(source[keys].type === 'VariableDeclarator' && checkMemberExpression(source[keys].init)){ // 使用 const {a,b,c} = this.props 获取 props
          targetArray.push(...source[keys].id.properties.map(property => property.key && property.key.name))
        }
        targetArray.push(...deepSearchProps(source[keys])); // 深度遍历
      }
    }
    return targetArray;
  }
  const body = astTree.program.body;
  return deepSearchProps(body);
}
```
首先，接收一个 astTree 参数，这个参数是一个树形结构，因为props所在的位置可以是类中的任意位置，其本质上是对象属性this的值，即`this.props`，或者直接从接收参数中获取，因此我们的思路就是找到所有 `props` 对象下的值（因为props在react中是保留变量）。因此定义一个`deepSearchProps`来深度遍历props。

### statistics.js

statistics.js 用来统计出现次数最多 props、methods等属性



[01]:/assets/images/2020-01-17-code-generation/structure.png
