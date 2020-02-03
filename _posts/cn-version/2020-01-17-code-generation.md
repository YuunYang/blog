---
title: "代码自动生成"
categories:
  - summarize
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

> 解析，以解析 props 为例：

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

statistics.js 用来统计出现次数最多 props、methods等属性。

> 根据 parent_id 生成层级树

```javascript
function list_to_tree(data) {
  let res = {};
  for(let i = 0; i < data.length; i++) {
    let row = data[i];
    row.parent = row.parent ? row.parent : 0;
    if(res[row.name]) {
      Object.assign(res[row.name], {
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
接受一个 data 数组参数，定义一个 res 对象作为结果输出，这个算法采用空间换时间，res 中存储所有节点及其 children ；每一次遍历，我们把 root 节点追加到 `0` 下，其余节点根据其 parent 的值追加到相应的 parent 的 children 名下。判断`res[row.name]`和`res[row.parent]`是密不可分的，因为可能在遍历过程中，出现 children 节点早出现于 parent 之前的情况，这种情况出现时，我们应该建立 parent 节点，并将当前节点追加到其中；当下次我们发现遍历到了这个 parent 节点时，再将其其他属性添加进去。

这个算法可以帮助我们在深度遍历 component 的过程中，由于采用的是递归的遍历算法，所以，建立 parent_id 为基础的层级结构会很顺手，但是对于这样一个层级树，如果不将其转化为 children 的多级数组，在渲染的时候显然是更麻烦的。

> 统计 components

统计 component 是最麻烦的一种，因为对于 component 来讲，每个 component 都有很多属性，对于这些属性的处理，我们需要将其合入到一起，同时前面提到的 parent 属性，对于很多 component 来讲，它的 parent 肯定不止出现一类，我们同样需要统统统计起来，但是因为我们统计的是出现次数最多的 component 所以，又要剔除掉不在其中的 parent。

[01]:/assets/images/2020-01-17-code-generation/structure.png
