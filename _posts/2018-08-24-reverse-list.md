---
title: "Reverse List"
categories:
  - summarize
tags: 
  - listNode
  - reverse
  - pointer
author_profile: true
---

Just show the code

![img](/assets/images/2018-08-24-reverse-list/RGIF2.gif)
Those explain is clearly

And Cpp code
```cpp
ListNode* reverseList(ListNode* head) {
    ListNode* pre=NULL;
    ListNode* next=NULL;
    while(head!=NULL){
        next=head->next;
        head->next=pre;
        pre=head;
        head=next;
    }
    return pre;
}
```