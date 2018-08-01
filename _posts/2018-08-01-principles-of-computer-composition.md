---
layout: post
title:  "Summary of Principles Of Computer Composition"
date:   2018-07-26
categories:
  - summarize
tags: 
  - principles of computer composition 
  - postgraduate
  - major408
author: yyk
taxonomy: articles
entries_layout: grid
# last_modified_at: 2018-08-01T11:19:00
---

**In computer major postgraduate entrance examination 408**, `Principles of computer composition` plays a decisive position and account 30% of total scores. So, I'd like to spend a little bit time to record some frequent used concepts.

## Hierarchy of computer system

### Constitution of computer hardware

Constituted by Unit, Controller, Memory, Import and Output. (运算器、控制器、存储器、输入和输出)

### The working process of computer

- The working process of computer is the executing process of instruction. 
  
- The instruction is constituted by opcode and operand (操作码和操作数): $$\bbox[5px,border:1px solid #000]{\text{OPCODE}}\bbox[5px,border:1px solid #000]{\text{ADDRESS CODE}}$$ and the opcode shows the operation of the instruction, while address shows the operate target of the instruction.

- Instructions are stored in memory sequentially(按顺序) according to the address order of the memory.

- To record the executing process of instruction, a register is required to record the address of the read instruction, called as instruction address register, or program counter(PC). The read of instructions can determine the read instruction according to the instruction address indicated by PC, and because of the instructions are usually stored in the order in which the address is added, after each instruction is read, the PC added one and prepared for reading the next instruction.

- The executing process of instruction.
  1. Instruction fetch(取指令): fetch the instruction indicated by PC, and PC++;
  2. Instruction decode(指令译码): analyze the opcode decide the operation content, and prepare the operand;
  3. Instruction execution(指令执行): execute the context indicated by opcode.

## Performance index of computer

### throughput and response time

- Throughput(吞吐量): the amount of output data in a period of time.
- Response time(响应时间): the time from the beginning to the end of an event, which also call it execution time.

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

- Serial carry adder(串行进位加法器): if add multiple numbers, we can add in parallel, and carry in serial. For example, there has two four-bit binary numbers `A3 A2 A1 A0` adding `B3 B2 B1 B0`, it can be composed of an integrated circuit consisting of two pieces of full adders which contains two full adders or one piece of full adder which contains four full adders(可以采用两片内含两个全加器或1片内含４个全加器的集成电路组成).The schematic diagram is follow:

  ![schematic diagram][schematic diagram]{: .align-left}
  As we can see, the carry signal of each bit is sent to the next bit as input signal, so the add operation of each bit must computed after the operation of the lower-one bit, and we call this way of carry `serial carry`.

- Parallel carry adder(并行进位加法器):

[example]: https://en.wikipedia.org/wiki/Cycles_per_instruction#Definition
[schematic diagram]: /images/2018-08-01-principles-of-computer-composition/200947103528147.jpg