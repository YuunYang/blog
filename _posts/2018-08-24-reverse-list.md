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

Code Here
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