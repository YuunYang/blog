---
layout: post
title:  "Summary of Principles Of Computer Composition"
date:   2018-08-01
categories:
  - summarize
tags: 
  - principles of computer composition 
  - postgraduate
  - major408
author: yyk
taxonomy: articles
entries_layout: grid
last_modified_at: 2018-08-03T15:49:00
---

**In computer major postgraduate entrance examination 408**, `Principles of computer composition` plays a decisive position and account 30% of total scores. So, I'd like to spend a little bit time to record some frequent used concepts.

## Hierarchy of computer system

### Constitution of computer hardware

Constituted by Unit, Controller, Memory, Import and Output. (`运算器`、`控制器`、`存储器`、`输入和输出`)

### The working process of computer

- The working process of computer is the executing process of instruction. 
  
- The instruction is constituted by opcode and operand (`操作码和操作数`): $$\bbox[5px,border:1px solid #000]{\text{OPCODE}}\bbox[5px,border:1px solid #000]{\text{ADDRESS CODE}}$$ and the opcode shows the operation of the instruction, while address shows the operate target of the instruction.

- Instructions are stored in memory sequentially(`按顺序`) according to the address order of the memory.

- To record the executing process of instruction, a register is required to record the address of the read instruction, called as instruction address register, or program counter(PC). The read of instructions can determine the read instruction according to the instruction address indicated by PC, and because of the instructions are usually stored in the order in which the address is added, after each instruction is read, the PC added one and prepared for reading the next instruction.

- The executing process of instruction.
  1. Instruction fetch(`取指令`): fetch the instruction indicated by PC, and PC++;
  2. Instruction decode(`指令译码`): analyze the opcode decide the operation content, and prepare the operand;
  3. Instruction execution(`指令执行`): execute the context indicated by opcode.

## Performance index of computer

### throughput and response time

- Throughput(`吞吐量`): the amount of output data in a period of time.
- Response time(`响应时间`): the time from the beginning to the end of an event, which also call it execution time.

### Base frequency, CPU clock period, CPI, execution time of CPU

- **Base frequency**: it shows the work time of CPU, and the common unit is `MHZ`;
- **CPU clock period**, **machine cycle** and **instruction cycle**: the reciprocal of base frequency $$\frac{1}{f}$$, and machine cycle equal to $$n\times{(clock-period)}$$, instruction cycle equal to $$n\times{(machine-cycle)}$$;
- **Cycles per instruction(CPI)**: the average number of clock cycles per instruction for a program or program fragment. Usually defined as $$\text{CPI}=\frac{\sum_{i} (IC_{i})\times{(CC_{i})}}{\text{IC}}$$;
- **Execution Time**: $$\text{T}=\text{CPI}\times\text{Instruction count}\times\text{Clock period}$$

### MIPS

MIPS is Million Instruction Per Second, usually defined as $$\text{MIPS}=\frac{\text{clock frequency}}{\text{CPI}}\times\frac{\text{1}}{\text{1 Million}}$$

### [An example in wikipedia][example]

A 400-MHz processor was used to execute a benchmark program with the following instruction mix and clock cycle count:

| Instruction TYPE | Instruction count | Clock cycle count |
| ---------------- | ----------------- | ----------------- |
| Integer Arithmetic | 45000 | 1 |
| Data transfer | 32000 | 2 |
| Floating point | 15000 | 2 |
| Control transfer | 8000 | 2 |

Determine the effective CPI, MIPS (Millions of instructions per second)rate, and execution time for this program.

According to the formula of CPI:

$$\text{CPI}=\frac{4500\times{1}+32000\times{2}+15000\times{2}+8000\times{2}}{100000}=\frac{155000}{100000}=1.55$$

Since: $$\text{MIPS} \propto \frac{1}{CPI}\text{ and MIPS}\propto clockFrequency$$

$$\text{MIPS}=\frac{\text{clock frequency}}{\text{CPI}}\times\frac{\text{1}}{\text{1 Million}}=
\frac{\text{400,000,000}}{1.55\times{1000000}}=\frac{400}{1.55}=258MIPS$$

Therefore:

$$\text{Execution time(T)}=\text{CPI}\times\text{Instruction count}\times\text{Clock period}=
\frac{CPI\times{Instruction Count}}{frequency}=\frac{1.55\times{100000}}{400\times{1000000}}=
\frac{1.55}{4000}=0.3875ms$$

## Numeral system and encoding

Read Tianqin or Wangdao in detail.

## Fixed-point number and floating-point number

Read Tianqin or Wangdao in detail.

## Arithmetic Logical Unit

### Serial adder and parallel adder

- Serial carry adder(`串行进位加法器`): if add multiple numbers, we can add in parallel, and carry in serial. For example, there has two four-bit binary numbers `A3 A2 A1 A0` adding `B3 B2 B1 B0`, it can be composed of an integrated circuit consisting of two pieces of full adders which contains two full adders or one piece of full adder which contains four full adders(`可以采用两片内含两个全加器或1片内含４个全加器的集成电路组成`).The schematic diagram is follow:

  ![schematic diagram][schematic diagram]{: .align-left}
  As we can see, the carry signal of each bit is sent to the next bit as input signal, so the add operation of each bit must computed after the operation of the lower-one bit, and we call this way of carry `serial carry`.

- Parallel carry adder(`并行进位加法器`):

  Skip...

### Function and mechanism

- ALU is mainly used to compute various arithmetic and logical operations.
- General register(`通用寄存器`): general register is a set of memory with fastest access speeds, used to save the operand and intermediate result that participate the operation. Access register do not require Cache or bus cycles to run, so instructions executing quickly. Almost every instructions need to specify a register as an operand, and some require that the operand be stored in special register.
- **Special register** usually used to represent a system state in which CPU is in, ALU has to important state register: PC and FLAGS.

## Memory classification

- Sort by memory medium: semiconductor memory(`半导体存储器`), magnetic surface memory(`磁表面存储器`), magnetic core memory(`磁芯存储器`) and optical disc memory(`光盘存储器`);
- Sort by access mode: random access memory(RAM`随机存储器`), read-only memory(ROM`只读存储器`) and serial access memory(`串行访问存储器`);
- Sort by the role in computer:

$$\text{Memory}\begin{cases}
  \text{Main Memory}\begin{cases}
    \text{RAM}\begin{cases}
      \text{stantic RAM} \\[2ex]
      \text{dynamic RAM}
      \end{cases} \\[2ex]
    \text{ROM}\begin{cases}
      \text{MROM} \\[2ex]
      \text{PROM} \\[2ex]
      \text{EPROM} \\[2ex]
      \text{EEPROM} \\[2ex]
      \end{cases}
    \end{cases} \\[2ex]
  \text{Flash Memory} \\[2ex]
  \text{Secondary Memory}\begin{cases}
      \text{disk} \\[2ex]
      \text{tape} \\[2ex]
      \text{light disk}
      \end{cases} \\[2ex]
  \text{Cache}
\end{cases}$$

- RAM is RAM, and ROM is ROM its easy to understand.

### Memory extension

The capacity of a memory is limited, it's quilt different from the actual memory requirement in terms of word count or word length, so we need bit extension and word extension.

- **Bit extension**: bit extension refers to the expansion of word length with multiple memories. We connected each chips' **address lines** by parallel(A0-A0, A1-A1, ... A15-A15, ...), and then connected to the address bus; Each chip provides a data line that forms part of the data bus(`两芯片的地址线分别并接在一起(即A0与A0并接，A1与A1并接，A15与A15并接等等)，接至系统地址总线；两芯片的数据线各自提供数据总线的一部分(此例为高4位和低4位)，共同组成8位的数据总线`);
- **Word extension**: word extension refers to the expansion of word count. We connected each chips' lower address line by parallel, and then connected to the lower address bus; Connected each **data line** by parallel, and then connected to the data bus; System higher address line, used for transcode, and the output connected to two chips' chip selection(CS) side.

## Cache

- **Cache operation principle**: Cache constituted by Translation Lookaside Buffer(TLB`快表`) and rapid memory(`快速存储器`). Processor accesses the memory at the main memory address, the high segment of memory determines wether the Cache is in by look up the table though the address mapping mechanism of Memory-Cache, if in, Cache hit and access Cache by Cache address. Or Cache not hit need to access main memory, and transfer the corresponding data block to the Cache, if Cache is full, we should replace a blog out of Cache by using an algorithm, and modify the relevant mapping relation.

  According to the operation principle, it refer to two question: determine and then replace.

  The existence of Cache is **transparent** for the programmer. `The algorithm about address mapping and replace are all realized by hardware`. Cache usually integrate to CPU for speed increasing.

- **Mapping mode between Cache and Main memory**: because processor always accesses main memory by it's address, but the space of Cache much less than main memory, so need address mapping to recognize whether this access is in the Cache or in the main memory, and the `address mapping` is map the address which in main memory to the Cache. Make a memory block or space in Cache correspond to a number of blocks in main memory, hence when access a main memory address, can get the corresponding address in Cache. For the mapping mode ,there has three modes: Direct Mapping, Full Associative Mapping and Set Associative Mapping.

### Direct mapping



[example]: https://en.wikipedia.org/wiki/Cycles_per_instruction#Definition
[schematic diagram]: /images/2018-08-01-principles-of-computer-composition/200947103528147.jpg