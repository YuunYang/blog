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