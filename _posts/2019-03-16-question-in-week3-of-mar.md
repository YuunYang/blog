---
title:  "Questions from 03/11/19 - 03/17/19"
categories:
  - summarize
tags: 
  - algorithm
  - leetcode
  - dynamic problem
entries_layout: grid
author_profile: true
toc: true
toc_label: "catalog"
toc_sticky: true
---

## Minimum Window Substring
[76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)
### description
degree of difficulty: $$\color{#e91e63}{hard}$$

`Given a string S and a string T, find the minimum window in S which will contain all the characters in T in complexity O(n).`

Example:

Input: S = "ADOBECODEBANC", T = "ABC"
Output: "BANC"
Note:

- If there is no such window in S that covers all characters in T, return the empty string "".
- If there is such window, you are guaranteed that there will always be only one unique minimum window in S.
### solution
Solution is from [@zjh08177](https://leetcode.com/problems/minimum-window-substring/discuss/26808/Here-is-a-10-line-template-that-can-solve-most-'substring'-problems)

It is `hash table` and `two point` question, and @zjh08177 gives us a template of this kind of questions

Here comes the template.

For most substring problem, we are given a string and need to find a substring of it which satisfy some restrictions. A general way is to use a hashmap assisted with two pointers. The template is given below.
```c++
int findSubstring(string s){
    vector<int> map(128,0);
    int counter; // check whether the substring is valid
    int begin=0, end=0; //two pointers, one point to tail and one  head
    int d; //the length of substring

    for() { /* initialize the hash map here */ }

    while(end<s.size()){

        if(map[s[end++]]-- ?){  /* modify counter here */ }

        while(/* counter condition */){ 
                
                /* update d here if finding minimum*/

            //increase begin to make it invalid/valid again
            
            if(map[s[begin++]]++ ?){ /*modify counter here*/ }
        }  

        /* update d here if finding maximum*/
    }
    return d;
}
```
So, come to this problem, we need to find the min-distance substring which contains all element of string `T`, so first of all, we need two points one represent the start point - `begin`, and one represent the end point - `end`, we need to find the substring whatever it is the min-distance one, and then, we need to look backwards, we move the begin point to make sure that we skip every uncorrelated element, and than begin comes to next step (`like S = "DAOBECODEBANC", T = "ABC"`, begin first at index0, and we move it to index1, so we skipped the uncorrelated `D`, and next we move it to index2), so that we can start the next search, to make sure if there has shorter substring; for the end point, we only need to concerned that when we comes to the end point, the substring need to contains all T element, and every time, we change end first, and then change begin and calculate the min-distance (end - begin) in the meanwhile.

the cpp code:
```c++
class Solution {
public:
    string minWindow(string s, string t) {
        vector<int> map(128,0);
        for(auto c: t) map[c]++;
        int counter=t.size(), begin=0, end=0, d=INT_MAX, head=0;
        while(end<s.size()){
            if(map[s[end++]]-->0) counter--; //in t
            while(counter==0){ //valid
                if(end-begin<d)  d=end-(head=begin);
                if(map[s[begin++]]++==0) counter++;  //make it invalid
            }  
        }
        return d==INT_MAX? "":s.substr(head, d);
    }
};
```
## Minimum Window Substring
[42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
### description
degree of difficulty: $$\color{#e91e63}{hard}$$

`Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.`

![img](https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png){:. align-center}
`The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped. Thanks Marcos for contributing this image!`

Example:

Input: [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6

### solution
Solution is from [@mcrystal](https://leetcode.com/problems/trapping-rain-water/discuss/17357/Sharing-my-simple-c%2B%2B-code%3A-O(n)-time-O(1)-space)

It is a typical two point question. Usually, we would set two point - slow point and fast point start from beginning, but for this question, it will become a lit bit complex, and if we start from the left and right, we can have a easy-understanding solution.

We see the wall like a **pool**, we reduce this pool's scale using a left point move from left to right, and a right point move from right to left; and in this process, we can get a new, higher wall that can spilt the pool into a new, smaller scale, or we just pass a lower stage and this lower stage can storage the water.

```c++
class Solution {
public:
    int trap(vector<int>& height) {
        int n =height.size();
        int left=0; int right=n-1;
        int res=0;
        int maxleft=0, maxright=0;
        while(left<=right){
            if(height[left]<=height[right]){
                if(height[left]>=maxleft) maxleft=height[left];
                else res+=maxleft-height[left];
                left++;
            }
            else{
                if(height[right]>=maxright) maxright= height[right];
                else res+=maxright-height[right];
                right--;
            }
        }
        return res;
    }
};
```
## Edit Distance
[72. Edit Distance](https://leetcode.com/problems/edit-distance/)
### description
degree of difficulty: $$\color{#e91e63}{hard}$$

`Given two words word1 and word2, find the minimum number of operations required to convert word1 to word2.`

`You have the following 3 operations permitted on a word:`

- Insert a character
- Delete a character
- Replace a character

Example 1:

    Input: word1 = "horse", word2 = "ros"
    Output: 3
    Explanation: 
    horse -> rorse (replace 'h' with 'r')
    rorse -> rose (remove 'r')
    rose -> ros (remove 'e')
Example 2:

    Input: word1 = "intention", word2 = "execution"
    Output: 5
    Explanation: 
    intention -> inention (remove 't')
    inention -> enention (replace 'i' with 'e')
    enention -> exention (replace 'n' with 'x')
    exention -> exection (replace 'n' with 'c')
    exection -> execution (insert 'u')

### solution
Solution is from [@jianchao-li](https://leetcode.com/problems/edit-distance/discuss/25846/C%2B%2B-O(n)-space-DP)

This is a DP problem, we have two strings ready to compare, so it is better if we could use a 2D vector(one vector is good, but 2D is better to understand), we define the state `dp[i][j]` to be the minimum number of operations to convert `word1[0..i)` to `word2[0..j)`.

For the base case, that is, to convert a string to an empty string, the mininum number of operations (deletions) is just the length of the string. So we have `dp[i][0]` = i and `dp[0][j]` = j.

For the general case to convert word1[0..i) to word2[0..j), we break this problem down into sub-problems. Suppose we have already known how to convert word1[0..i - 1) to word2[0..j - 1) (`dp[i - 1][j - 1]`), if word1[i - 1] == word2[j - 1], then no more operation is needed and `dp[i][j] = dp[i - 1][j - 1]`.

If word1[i - 1] != word2[j - 1], we need to consider three cases.

Replace word1[i - 1] by word2[j - 1] (`dp[i][j] = dp[i - 1][j - 1] + 1`);

If word1[0..i - 1) = word2[0..j), means that word1[0..i - 1) convert word2[0..j - 1), and the redundant is the word1[i - 1], so we then delete word1[i - 1] (`dp[i][j] = dp[i - 1][j] + 1`);

If word1[0..i) + word2[j - 1] = word2[0..j) then insert word2[j - 1] to word1[0..i) (`dp[i][j] = dp[i][j - 1] + 1`).
So when word1[i - 1] != word2[j - 1], `dp[i][j]` will just be the minimum of the above three cases.

```c++
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 1; j <= n; j++) {
            dp[0][j] = j;
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = min(dp[i - 1][j - 1], min(dp[i][j - 1], dp[i - 1][j])) + 1;
                }
            }
        }
        return dp[m][n];
    }
};
```