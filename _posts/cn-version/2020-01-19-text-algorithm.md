---
title: "文本匹配算法"
categories:
  - summarize
tags:
  - algorithm
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---

## Rabin-Karp 算法
在计算机科学中，Rabin karp算法是一类字符串查找算法。由美国科学家、图灵奖得主 Richard Karp 和 Michael Rabin 共同提出。下面简称RK算法

### overview
一般的字符串匹配算法会将给定的模式与给定字符串的所有位置进行比较。每一次比较的时间与模式的长度成正比，而所有位置的数量又是和字符串的长度为正比的。因此，此类算法的最坏时间复杂度与两个长度的乘积成正比。在很多案例中，一旦发现不匹配，就可以通过减少比较来显示减少时间，但这样的方法都无法真正减少时间复杂度。

一些算法，接下来会提到 KMP 算法和 BM 算法，通过对每一次不匹配过程提取更多信息，从而保证能直接跳过下一次不匹配的位置。而 RK算法则通过hash函数快速对每个位置进行近似检查，然后仅在通过此近似检查的位置执行精确比较，以实现加速。

hash函数的作用是将每一个字符串都转化为一个数字 —— 称之为哈希值（hash value）。例如，hash("hello")=5。如果两个字符串相等，他们的哈希值也是相等的。对于一个设计的很好的hash函数而言，在近似意义上来说，情况恰好相反：不同的字符串，及不可能会有相同的值。RK 算法通过在文本的每个位置计算从该位置开始与模式长度相等的字符串的哈希值来推进。如果当前哈希值等于模式的hash值，它就会从此位置开始做一个全面的比较。

为了能更好的工作，hash函数应从不太可能产生很多误报的哈希函数系列中随机选出，误报是指文本某个位置与模式具有相同的哈希值，但最后实际上却并匹配。这些情况会使算法造成不必要的时间浪费。另外，hash函数的使用需要是 [rolling hash](https://en.wikipedia.org/wiki/Rolling_hash)（滚动窗口的形式），一个hash函数就可以从文本任何一个位置到另一个位置来很快的更新。在每一个位置从头开始计算hash函数是非常慢的。

### algorithm

```c++
function RabinKarp(string s[1..n], string pattern[1..m])
    hpattern := hash(pattern[1..m]);
    for i from 1 to n-m+1
        hs := hash(s[i..i+m-1])
        if hs = hpattern
            if s[i..i+m-1] = pattern[1..m]
                return i
    return not found
```

第2、4、6行都需要O(m)的时间。但是第二行只执行了一次，第六行也仅当匹配通过时执行，所执行的次数也是很少的。第五行需要O(n)次，但每一次比较只需要固定的时间，因此它的影响度也就是O(n)，问题在于第四行，第四行循环n+m-1次，并计算hash值，所以总的时间复杂度为o(mn)，这个时间复杂度与简单的字符串匹配算法的时间复杂度是一样的。如何加快？hash的计算必须要是一个常数的时间。技巧就是变量 hs 早就包含了前一个字符串`s[i..i+m-1]`的哈希值。如果如果这个值可以在一个常数时间内计算下一个哈希值，则计算一串连续不断的hash值会非常快。

这个技巧就是使用前面说过的 `rolling hash`。rolling hash 是专门为此操作而设计的hash函数。一个简单的（效果不好）rolling hash函数要做的就是添加子字符串中每一个字符的值。rolling hash公式如下（~~哈希值不是一个与模式等长的串确定的值？？？~~，hash计算还是基于每一个字符的）

`s[i+1..i+m] = s[i..i+m-1] - s[i] + s[i+m]`

接下来有性能更好的 hash函数。

### Hash function
hash函数的选取是RK算法性能提高的关键所在。

> [Rabin fingerprint](https://en.wikipedia.org/wiki/Rabin_fingerprint)

它将每个子字符串视为某个基数中的一个数字，该基数通常是字符集的大小。例如子字符串为 "hi"，基数为 256，素模数是101，哈希值则会是：
```
[(104 × 256 ) % 101  + 105] % 101  =  65
(ASCII of 'h' is 104 and of 'i' is 105)
```

### longest-duplicate-substring
[1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/)
> description

degree of difficulty: $$\color{#e91e63}{Hard}$$

_Given a string S, consider all duplicated substrings: (contiguous) substrings of S that occur 2 or more times.  (The occurrences may overlap.)_

_Return any duplicated substring that has the longest possible length.  (If S does not have a duplicated substring, the answer is "".)_

Example 1:

    Input: "banana"
    Output: "ana"
    Example 2:

    Input: "abcd"
    Output: ""


**Note:**

-   2 <= S.length <= 10^5
-   S consists of lowercase English letters.

> 题解

[C++ solution using Rabin Karp and binary search with detailed explaination](https://leetcode.com/problems/longest-duplicate-substring/discuss/291048/C%2B%2B-solution-using-Rabin-Karp-and-binary-search-with-detailed-explaination)

解此题可以用到 RK算法。

首先，通过二分查找，确定每次RK算法的起点，如果找到匹配的字符串，则缩小查找范围；如果查找失败，则扩大：
```c++
int low = 0, high = S.length();
while (low <= high) {
    int mid = low + (high - low) / 2;
    string tmp = validate(mid, S);
    if (tmp.length() == 0) {
        high = mid - 1;
    } else {
        if (tmp.length() > ans.length()) {
            ans = tmp;
        }
        low = mid + 1;
    }
}
```

然后查看一下如何设计 RK 算法。假设素模数为 19260817 —— 一个足够大的数，基数为26。

计算所有素模数：
```c++
int prime = 19260817;
vector<int> power;
power = vector<int>(S.length(), 1);
for (i = 1 ; i < S.length(); i++) {
    power[i] = (power[i - 1] * 26) % prime;
}
```
在具体的 hash 函数中，我们先初始化0-desire（`str[i]-a`为当前字符的ascii）：
```c++
for (i = 0 ; i < desire; i++) {
    current = ((current * 26) % prime + (str[i] - 'a')) % prime;
}
```
具体的比较代码：
```c++
hash[current] = vector<int>(1, 0);
for (i = desire ; i < str.length(); i++) {
    // sliding window to maintain the current substr's hash value
    // be aware of overflow
    current = ((current - (long long) power[desire - 1] * (str[i - desire] - 'a')) % prime + prime) % prime;
    current = (current * 26 + (str[i] - 'a')) % prime;
    // if that hash value is not in our set we do nothing and add the value to our map
    if (hash.find(current) == hash.end()) {
        hash[current] = vector<int>(1, i - desire + 1);
    } else {
        // otherwise, start a string by string comparason and see if there's a match
        for (auto it : hash[current]) {

            if (strcmp((str.substr(it, desire)).data(), str.substr(i - desire + 1, desire).data()) == 0) {
                return str.substr(it, desire);
            }
        }

        hash[current].push_back(i - desire + 1);
    }
}
```
在这个具体的算法中，由于我们是不知道具体的模式长度是多少的，在滑动窗口的过程中，我们便可以假设 0 - (i - desire + 1)为模式长度，也就是说对于每一个字符，它对应的模式长度都是从自身到起点的距离（注意不是到i=0的距离）。

全部算法 + 楼主自己的思路：
思路
```
This is a tricky one on two sides:

1. how to find the length of the lonest string
2. how to compare the string of the same length

For the first point, we can use binary search for answer since if a string of length n is invalid then for all k > n, there's definetly no solution because length n strings would become a substring of the length k string. Similarly if a string of length n is valid, we have no use of checking strings with length less than n. Due to these properties we can use binary search for final answer.

For the second point, we are actually trying to compare a sliding window of string, and Rabin Karp algorithm is perfect for doing so. The algorithm basically computes the hash value of all the string and start a character by character comparison only if the two strings have the same hash value. In order to avoid collision we can use a large prime number. 

Such as 1e9 + 7, 19260817, 99999989, etc.

The implementation looks as follows:
```
代码
```c++
class Solution {
public:
    string longestDupSubstring(string S) {
        ans = "";
        power = vector<int>(S.length(), 1);
        int i;
		// precompute all the pow(26, k) 0 < k < S.length() modulus prime
        for (i = 1 ; i < S.length(); i++) {
            power[i] = (power[i - 1] * 26) % prime;
        }
        int low = 0, high = S.length();
		// code for the binary search, very trivial
        while (low <= high) {
            int mid = low + (high - low) / 2;
            string tmp = validate(mid, S);
            if (tmp.length() == 0) {
                high = mid - 1;
            } else {
                if (tmp.length() > ans.length()) {
                    ans = tmp;
                }
                low = mid + 1;
            }
        }

        return ans;
    }

private:
   // large prime number
    int prime = 19260817;
    string ans;
    vector<int> power;
    string validate(int desire, string &str) {
       // if the desire length is 0, return the empty string
        if (desire == 0) return "";
        unordered_map<int, vector<int>> hash = unordered_map<int, vector<int>>();
        long long current = 0;
        int i;
		// compute the hash value of the first "length" characters
        for (i = 0 ; i < desire; i++) {
            current = ((current * 26) % prime + (str[i] - 'a')) % prime;
        }
        // store the result in a hashmap that maps from hashvalue to starting index
        hash[current] = vector<int>(1, 0);
        for (i = desire ; i < str.length(); i++) {
		    // sliding window to maintain the current substr's hash value
			// be aware of overflow
            current = ((current - (long long) power[desire - 1] * (str[i - desire] - 'a')) % prime + prime) % prime;
            current = (current * 26 + (str[i] - 'a')) % prime;
           // if that hash value is not in our set we do nothing and add the value to our map
            if (hash.find(current) == hash.end()) {
                hash[current] = vector<int>(1, i - desire + 1);
            } else {
			   // otherwise, start a string by string comparason and see if there's a match
                for (auto it : hash[current]) {

                    if (strcmp((str.substr(it, desire)).data(), str.substr(i - desire + 1, desire).data()) == 0) {
                        return str.substr(it, desire);
                    }
                }

                hash[current].push_back(i - desire + 1);
            }
        }

        return "";
    }
};
```


## KMP算法

## 马拉车算法

## BM算法
Boyer–Moore string-search algorithm
