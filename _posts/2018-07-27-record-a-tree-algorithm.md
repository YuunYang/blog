---
title:  "Record A Tree Algorithm"
categories:
  - summarize
tags: 
  - binary-tree
  - algorithm
  - depth-first-search
  - leetcode
last_modified_at: 2018-07-29T11:19:00
toc: true
toc_label: "Tree Algorithm"
author_profile: true
toc_sticky: true
---
In computer science, a binary tree is type of data structure, in which each node has at most two children, and it is also a very common testing centre in postgraduate examinations. A binary tree has many characters and derive many ways of traversing a binary tree e.g. It not easy to understand a binary in a short time, and I will write down some about **Tree Traversal** through two algorithms in leetcode.

## Problem Description(1)

[106. Construct Binary Tree from Inorder and Postorder Traversal][No-106]
```
Given inorder and postorder traversal of a tree, construct the binary tree.

Note:
You may assume that duplicates do not exist in the tree.

For example, given

inorder = [9,3,15,20,7]
postorder = [9,15,7,20,3]
Return the following binary tree:
    3
   / \
  9  20
    /  \
   15   7
```

## Thinking(1)
This is a typical tree traversal problem, actually I came up with a idea immediately, it is easy to find the rules, because of the postorder traversal, so the `last element` of this must be the root of this tree, while as for the inorder traversal, the previous to this root are his left child, and the posterior are the right child; For [5, 2, 6, 13, 8, 7, 9, 12, 10, 3] and [5, 6, 2, 8, 12, 10, 9, 7, 3, 13] is like this.

$$\underbrace{\text{ 5, 2, 6}}_{\text{left}}\text{, }
\underbrace{\text{13}}_{\text{root}}\text{, }
\underbrace{8, 7, 9, 12, 10, 3}_{\text{right}}$$

So what's the left-first root and right-first root? obviously, is **2** and **3**, 2 is get from the first 3 element of postorder(because the left child has 3 element) and 3 is get form next 6 element, so for **2** and **3** we can get: 

$$\begin{cases}
\underbrace{\text{ 5}}_{\text{left}}\text{, }
\underbrace{\text{ 2}}_{\text{root}}\text{, }
\underbrace{6}_{\text{right}}, & \text{left child} \\[2ex]
\underbrace{\text{ 8, 7, 9, 12, 10}}_{\text{left}}\text{, }
\underbrace{\text{ 3}}_{\text{root}}\text{, }
\underbrace{  }_{\text{right}},  & \text{right child}
\end{cases}$$

Uh-huh, in this case, we can come to a conclusion, that it is a recurring problem, so how we write the code? Unfortunately I can't figure out how to write the code, so I made a full references to [this discuss][1st-discuss]. And the following is my code :(

My cpp solution?
``` c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
private: unordered_map <int, int> m;
public:
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        int n = inorder.size();
        int i = 0;
        for(auto value:inorder) m[value] = i++;
        return dfs(0, n-1, 0, n-1, inorder, postorder);
    }
    TreeNode* dfs(int left,int right, int pleft,int pright, vector<int>& inorder, vector<int>& postorder) {
        if(left > right){
            return NULL;
        };
        int value = postorder[pright];
        TreeNode* tree = new TreeNode(value);
        int mid = m[value];
        tree->right = dfs(mid + 1, right, pleft + mid - left, pright - 1, inorder, postorder);
        tree->left = dfs(left, mid - 1, pleft, pleft + mid - left - 1, inorder, postorder);
        return tree;
    }
};
```

## Problem description(2)

[105. Construct Binary Tree from Preorder and Inorder Traversal][No-105]
```
Given preorder and inorder traversal of a tree, construct the binary tree.

Note:
You may assume that duplicates do not exist in the tree.

For example, given

preorder = [3,9,20,15,7]
inorder = [9,3,15,20,7]
Return the following binary tree:

    3
   / \
  9  20
    /  \
   15   7
```

## Thinking(2)

It looks like the previous question, but the only difference is that the postorder has changed to preorder, so actually, it is more better to understand which for preorder, the first element is the root, and the following are the left and right, so the solution is also a recurring problem. I will show my javascript code.

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    if(inorder.length){
        var sign = inorder.indexOf(preorder.shift())
        let root = new TreeNode(inorder[sign])
        root.left = buildTree(preorder,inorder.slice(0,sign))
        root.right = buildTree(preorder,inorder.slice(sign + 1))
        return root
    }
    return null
};
```

## Summarize

In tree traversal problem, the key is to find the recurring function, it always build in the vast experiences, in fact it is very easy to find the relationships among preorder, inorder and postorder but it always complex us on how we compute the right or left subtree in a recurring function. So keep coding

_ _ _

## References

Some essay, blog or question referred above.

- [105. Construct Binary Tree from Preorder and Inorder Traversal][No-105]
- [106. Construct Binary Tree from Inorder and Postorder Traversal][No-106]
- [No.106 on discuss][1st-discuss]
- [Tree (data structure)](https://en.wikipedia.org/wiki/Tree_(data_structure))

$$\mathcal{Yukun Yang}$$ at Beijing

[No-105]: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/
[No-106]: https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/description/
[1st-discuss]: https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/discuss/34799/C++-O(n)-DFS-solution-beath-91-submissions