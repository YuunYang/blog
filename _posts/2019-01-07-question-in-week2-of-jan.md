---
title:  "Questions from 01/07/19 - 01/13/19"
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

## Flip String to Monotone Increasing
[926. Flip String to Monotone Increasing](https://leetcode.com/problems/flip-string-to-monotone-increasing/)
### description
degree of difficulty: $$\color{#ef6c00}{medium}$$

*A string of '0's and '1's is monotone increasing if it consists of some number of '0's (possibly 0), followed by some number of'1's (also possibly 0.)*

*We are given a string S of '0's and '1's, and we may flip any '0' to a '1' or a '1' to a '0'.*

*Return the minimum number of flips to make S monotone increasing.*
    
Example 1:

    Input: "00110"
    Output: 1
    Explanation: We flip the last digit to get 00111.
Example 2:

    Input: "010110"
    Output: 2
    Explanation: We flip to get 011111, or alternatively 000111.
Example 3:

    Input: "00011000"
    Output: 2
    Explanation: We flip to get 00000000.

### solutions
There has two solutions I think is good for me,their from [@votrubac](https://leetcode.com/problems/flip-string-to-monotone-increasing/discuss/183851/C%2B%2BJava-4-lines-O(n)-or-O(1)-DP) and [@LiamHuang
](https://leetcode.com/problems/flip-string-to-monotone-increasing/discuss/189751/C%2B%2B-one-pass-DP-solution-0ms-O(n)-or-O(1)-one-line-with-explaination.)

- For votrubac's solution, we defined two vectors __f0__ and __f1__, which one is for count the '0' -> '1' flips from left to right; and one is for count '1' -> '0' from right to left; and then find the minimum __f0[i] + f1[i]__.

Why dose it helpful? observing every example, we can find that every total result is a string that spited into left '0' and right '1', so the *f0* count how much '1' we should to flip to get a all '0' string, and *f1* count '0'. so that the minimum of **__f0[i] + f1[i]__** represent the minimum chars we need to flip to make sure that the left are all '0', and right are '1'.

the pic for explanation:

![01][01]{: .align-center}

the code; note that we need set f0 and f1 __S.size() + 1__ capacity, we need to loop f0 from left to right, and we need to loop f1 from right to left; so that f0[i] and f1[i] are not represent an same position, but a succession position - like f0[i] represent S[i] but f1[i] represent S[i + 1].

```cpp
int minFlipsMonoIncr(string S, int res = INT_MAX) {
    vector<int> f0(S.size() + 1), f1(S.size() + 1); 
    for (int i = 1, j = S.size() - 1; j >= 0; ++i, --j) {
        f0[i] += f0[i - 1] + (S[i - 1] == '0' ? 0 : 1);
        f1[j] += f1[j + 1] + (S[j] == '1' ? 0 : 1);
    }
    for (int i = 0; i <= S.size(); ++i) res = min(res, f0[i] + f1[i]);
    return res;
}
```
- For liamHuang's solution, we dont need to define two vector, what we need to do,is to design a minFlips to count how much flips we need to do for a sub string, and to design a ones to count '1's in origin string S, and make minFlips equal to min(ones, minFlips + 1)

It is because, when we meet '1', '1' is already on the right of the substring, and when '0' come in, we need to consider two situations, flips all former '1's to '0' or  make current '0' to '1', after minFlips flips before(because flip '0' to '1' must helpful). So this problem become a dp problem.

the code: 

```cpp
class Solution {
public:
    int minFlipsMonoIncr(string S) {
        int ones = 0, minFlips = 0;
        for (char n : S) {
            if (n == '1') {
                ++ones;
                continue;
            } else {
                minFlips = min(minFlips + 1, ones);
            }
        }
        return minFlips;
    }
};
```

## Palindromic Substrings
[647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)
### description
degree of difficulty: $$\color{#ef6c00}{medium}$$

*Given a string, your task is to count how many palindromic substrings in this string.*

*The substrings with different start indexes or end indexes are counted as different substrings even they consist of same characters.*

Example 1:

    Input: "abc"
    Output: 3
    Explanation: Three palindromic strings: "a", "b", "c".
Example 2:

    Input: "aaa"
    Output: 6
    Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".

### solution
Solution is from [@AES256](https://leetcode.com/problems/palindromic-substrings/discuss/105707/Java-DP-solution-based-on-longest-palindromic-substring)

It is a DP problem first, so the core of this problem is to find the formal.

See the substring, if the left most equal to right most, remove them, the rest substring should still a palindrome string, so, it become a DP problem, we can use a 2d bool vector to store if the substring from i -> j is a palindrome string.

So, first we compare the left most and right most char at substring, if it is true, then compare dp[i + 1][j - 1] which i represent the start index from right to left, and j represent the end index.

The code; there has a trick, when j - i < 3, like 'aba' or 'aa', whatever the middle one is, it must be a palindorem string.

```cpp
class Solution {
public:
    int countSubstrings(string s) {
        int n = s.size();
        int res = 0;
        vector<vector<bool>> dp(n, vector<bool>(n));
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                dp[i][j] = s[i] == s[j] && (j - i < 3 || dp[i + 1][j - 1]);
                if(dp[i][j]) ++res;
            }
        }
        return res;
    }
};
```

[01]: /assets/images/2019-01-07-question-in-week2-of-jan/01.png