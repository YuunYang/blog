---
layout: post
title:  "Record A Tree Algorithm"
date:   2018-07-26
categories:
  - summarize
tags: 
  - binary-tree
  - algorithm
  - depth-first-search
  - leetcode
author: yyk
taxonomy: articles
entries_layout: grid
# last_modified_at: 2018-07-26T15:21:00
---

## Problem Description

[106. Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/description/)
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
My cpp solution
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
