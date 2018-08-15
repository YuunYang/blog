---
title: "Summary of Principles Of Computer Composition(02)"
categories:
  - summarize
  - principles of computer composition 
tags: 
  - principles of computer composition 
  - postgraduate
  - major408
author_profile: true
toc: true
toc_label: "Principles Of Computer Composition"
toc_sticky: true
---

Part 2 of principles of computer composition

## Cache

- **Cache operation principle**: Cache constituted by Translation Lookaside Buffer(TLB`快表`) and rapid memory(`快速存储器`). Processor accesses the memory at the main memory address, the high segment of memory determines wether the Cache is in by look up the table though the address mapping mechanism of Memory-Cache, if in, Cache hit and access Cache by Cache address. Or Cache not hit need to access main memory, and transfer the corresponding data block to the Cache, if Cache is full, we should replace a blog out of Cache by using an algorithm, and modify the relevant mapping relation.

  According to the operation principle, it refer to two question: determine and then replace.

  The existence of Cache is **transparent** for the programmer. `The algorithm about address mapping and replace are all realized by hardware`. Cache usually integrate to CPU for speed increasing.

- **Mapping mode between Cache and Main memory**: because processor always accesses main memory by it's address, but the space of Cache much less than main memory, so need address mapping to recognize whether this access is in the Cache or in the main memory, and the `address mapping` is map the address which in main memory to the Cache. Make a memory block or space in Cache correspond to a number of blocks in main memory, hence when access a main memory address, can get the corresponding address in Cache. For the mapping mode ,there has three modes: Direct Mapping, Full Associative Mapping and Set Associative Mapping.

### Direct mapping

That direct mapping assigned each memory block to a specific line in cache. If a line is all already taken up by a memory block when a new memory needs to be loaded, the old trashed. `This line is the only line that each of these blocks can be sent to. In the case of this figure, there are 8 bits in the block identification portion of the memory address`.
![direct map][direct map]{: .align-center}

### Full associative mapping

In full associative, any block can go into any line of the cache. This means that the word id bits are used to identify which word in the block is needed, but the tag becomes all of the remaining bits.

### Set associative mapping

Set associative mapping is divides the memory into some groups, and for each group, and direct mapping betweens groups, but full associative mapping in each group. It does this by saying that instead of having exactly one line that a block can map to in the cache, we will group a few lines together creating a `set`. Then a block in memory can map to any one of the lines of a specific set. There is still only one set that the block can map to.
![set assoc map][set assoc map]{: .align-center}

### The algorithms of mapping

|  | Thinking | Advantage | Disadvantage |
| ---------------- | ----------------- | ----------------- | --------------- |
| RAND | random generate the page number which need to be replaced | easy | low hit rate |
| FIFO | the first in page first out(replace)  | easy and utilized the historical information | can not reflect the principle of program locality |
| LRU | select the least recently used page to replace | hight hit rate, utilized the historical information and reflect the principle of program locality | complex to realize |
| OPT | select the page that will not use in future | the standard | ideal condition |

### Cache write strategy

Because when writing to the cache, there is no write to the cache, therefor, the cache and memory data is inconsistent.

The solutions are called cache update strategies.

| Update strategies | Thinking | Advantage | Disadvantage |
| ---------------- | ----------------- | ----------------- | --------------- |
| Write back | when CPU execute write operation, the message only write to the cache; the written cache block sent back to the memory only the replacement is needed, and set a `dirty bit` to indicate whether the cache line has been modified  | saves many unnecessary spending on writing intermediate result to memory | should make dirty bit which perplex the cache |
| write through | when writing, write the data both to the cache and main memory | easy and coast less | lost lot of time on writing intermediate result |

When there doesn't hit, we need to get this block back to cache, and there has two solutions:

- Write allocate policy: updates the block in main memory and brings the block to the cache.
- No write allocate policy: updates the block in main memory not bringing that block to the cache.

## Virtual memory

Virtual memory is the extend of main memory, the size of virtual memory depends on the memory access ability of computer but not the size of actual extend memory, and the actual extend memory size can less than the virtual memory size. From the programmer's point of view, extend memory counted as logical memory space, and the address to be accessed is a logic address(virtual address). Virtual memory both have the memory size amount to the extend memory and the access speed amount to the main memory.

The unit of address mapping is block in Cache and page in virtual memory. Design a virtual memory need to concern about the use ratio of memory space and hit ratio of memory.

### Paged virtual memory

Divide virtual storage space and real space into pages of fixed size, each virtual page can be installed with different actual page locations in main storage. in paged memory, the processor logical address consists of a virtual page number and an internal page address, the actual address is also divide into page number and page address, the virtual page number is converted to the actual page number of main memory by the address mapping mechanism.

Paged virtual memory use one page table, include page number, staring position of each page in main memory, loading bits and so on. Page table is a mapping table of the virtual page number and the physical page number. Paged virtual memory performed by the operate system, and is transparent to application programmers.

### Segment virtual memory

### Segment page virtual memory

[direct map]: /assets/images/2018-08-01-principles-of-computer-composition/direct.gif
[set assoc map]: /assets/images/2018-08-01-principles-of-computer-composition/setassoc.gif