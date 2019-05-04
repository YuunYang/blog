---
title: "使用Tensorflow构建LSTM模型"
categories:
  - MachineLearning
tags: 
  - 论文
  - RNN
  - LSTM
  - Machine Learning
  - Tensorflow
entries_layout: grid
author_profile: true
toc: true
toc_label: "目录"
toc_sticky: true
---
## 创建模型

```python
#coding:utf-8
import tensorflow as tf

class Model(object):
    def __init__(self, is_training, config):
        self.batch_size = batch_size = config.batch_size # 设置批次数量
        self.num_steps = num_steps = config.num_steps # 设置时间步
        size = config.hidden_size # LSTM的cell个数
        vocab_size = config.vocab_size # 单词表的大小
        self.lr = config.learning_rate # 学习率，学习率决定了权值更新的速度

        self._input_data = tf.placeholder(tf.int32, [batch_size, num_steps])
        self._targets = tf.placeholder(tf.int32, [batch_size, num_steps]) # 为下面的输入变量 x, y 准备

        lstm_cell = tf.contrib.rnn.BasicLSTMCell(size, forget_bias=0.0, state_is_tuple=False) 
        if is_training and config.keep_prob < 1:
            lstm_cell = tf.contrib.rnn.DropoutWrapper( # 设置dropout层
                lstm_cell, output_keep_prob=config.keep_prob)
        cell = tf.contrib.rnn.MultiRNNCell([lstm_cell] * config.num_layers, state_is_tuple=False) # 执行单元堆叠/分层，利用tf.contrib.rnn.MultiRNNCell将多个BasicLSTMCell单元汇总为一个

        self._initial_state = cell.zero_state(batch_size, tf.float32)

        with tf.device("/cpu:0"):
            embedding = tf.get_variable("embedding", [vocab_size, size]) # 词嵌入，在训练结束时，embedding 将包含词汇表中所有字词的嵌入。
            inputs = tf.nn.embedding_lookup(embedding, self._input_data) # 回传一个 tensor，shape 是 (batch_size, num_steps, size)

        if is_training and config.keep_prob < 1:
            inputs = tf.nn.dropout(inputs, config.keep_prob)
        outputs = []
        state = self._initial_state
        with tf.variable_scope("RNN"):
            for time_step in range(num_steps):
                if time_step > 0: tf.get_variable_scope().reuse_variables()
                (cell_output, state) = cell(inputs[:, time_step, :], state) #inputs[:, time_step, :] 的 shape 是 (batch_size, size)
                outputs.append(cell_output)

        output = tf.reshape(tf.concat(outputs, 1), [-1, size]) # 展平输出output，以便我们可以将它们输入到softmax分类层中。
        # 设置softmax权重，并执行标准化的xw+b操作
        softmax_w = tf.get_variable("softmax_w", [size, vocab_size])
        softmax_b = tf.get_variable("softmax_b", [vocab_size])
        logits = tf.matmul(output, softmax_w) + softmax_b
        self._final_state = state

        if not is_training:
            self._prob = tf.nn.softmax(logits)
            return

        loss = tf.contrib.legacy_seq2seq.sequence_loss_by_example(
            [logits], # logits对应于每个时间步的所有类的预测
            [tf.reshape(self._targets, [-1])], # 即为taeget也就是我们预测的目标（正确答案）
            [tf.ones([batch_size * num_steps])]) # 权重，因为此模型不需要所以设置成为ones
        self._cost = cost = tf.reduce_sum(loss) / batch_size # 生成成本操作，将损失减少为单个标量

        tvars = tf.trainable_variables() # 返回所有可训练的对象
        grads, _ = tf.clip_by_global_norm(tf.gradients(cost, tvars), # Gradient Clipping，目的是为了处理梯度消失或爆炸，直观作用是让权重更新在一个合适的范围内
                                          config.max_grad_norm) # 设置范数，确定缩放的条件
        optimizer = tf.train.AdamOptimizer(self.lr) # 实现Adam算法的优化器。
        self._train_op = optimizer.apply_gradients(zip(grads, tvars)) # 返回一个应用指定梯度的操作。

    @property
    def input_data(self):
        return self._input_data

    @property
    def targets(self):
        return self._targets

    @property
    def initial_state(self):
        return self._initial_state

    @property
    def cost(self):
        return self._cost

    @property
    def final_state(self):
        return self._final_state

    @property
    def train_op(self):
        return self._train_op
```

## 训练模型

```python
#coding:utf-8
import tensorflow as tf
import sys,time
import numpy as np
import pickle as cPickle
import os
import Config
import Model

if not os.path.exists('./model'):
    os.makedirs('./model')

config_tf = tf.ConfigProto()
config_tf.gpu_options.allow_growth = True
config_tf.inter_op_parallelism_threads = 1
config_tf.intra_op_parallelism_threads = 1

file = sys.argv[1]
if (sys.version_info > (3, 0)):
    data = open(file, encoding="utf-8").read()
else:
    data = open(file,'r').read()
    data = data.decode('utf-8')

chars = list(set(data)) #char vocabulary

data_size, _vocab_size = len(data), len(chars)
print ("data has {0} characters, {1} unique.".format(data_size, _vocab_size))
char_to_idx = { ch:i for i,ch in enumerate(chars) } # char到id（数字）的映射
idx_to_char = { i:ch for i,ch in enumerate(chars) } # id到char的映射

config = Config.Config()
config.vocab_size = _vocab_size

cPickle.dump((char_to_idx, idx_to_char), open(config.model_path+'.voc','wb'), protocol=cPickle.HIGHEST_PROTOCOL) # 将第一个参数序列化然后存储在model_path中

context_of_idx = [char_to_idx[ch] for ch in data] # 获取data中每个单词的id，存储在context_of_idx

def data_iterator(raw_data, batch_size, num_steps):
    raw_data = np.array(raw_data, dtype=np.int32)

    data_len = len(raw_data)
    batch_len = data_len // batch_size # 得到可用的batch数
    data = np.zeros([batch_size, batch_len], dtype=np.int32)
    for i in range(batch_size):
        data[i] = raw_data[batch_len * i:batch_len * (i + 1)] # data 的 shape 是 (batch_size, batch_len)，每一行是连续的一段，一次可输入多个段落，这段代码的作用是将raw_data重构成(batch_len, batch_len)的tensor

    epoch_size = (batch_len - 1) // num_steps # 设置每个时期的迭代次数

    if epoch_size == 0:
        raise ValueError("epoch_size == 0, decrease batch_size or num_steps")

    # 通过以下这种方式组织数据，可以直接提取批量数据，同时仍然在每个数据样本中保持正确的句子序列。
    for i in range(epoch_size):
        x = data[:, i*num_steps:(i+1)*num_steps]
        y = data[:, i*num_steps+1:(i+1)*num_steps+1] # y 就是 x 的错一位，即下一个词
        yield (x, y)

def run_epoch(session, m, data, eval_op):
    """Runs the model on the given data."""
    epoch_size = ((len(data) // m.batch_size) - 1) // m.num_steps
    start_time = time.time()
    costs = 0.0
    iters = 0
    state = m.initial_state.eval()
    for step, (x, y) in enumerate(data_iterator(data, m.batch_size,
                                                    m.num_steps)):
        # 开启会话
        cost, state, _ = session.run([m.cost, m.final_state, eval_op], # x 和 y 的 shape 都是 (batch_size, num_steps)
                                 {m.input_data: x,
                                  m.targets: y,
                                  m.initial_state: state})
        costs += cost
        iters += m.num_steps

        if step and step % (epoch_size // 10) == 0:
            print("%.2f perplexity: %.3f cost-time: %.2f s" %
                (step * 1.0 / epoch_size, np.exp(costs / iters),
                 (time.time() - start_time)))
            start_time = time.time()

    return np.exp(costs / iters) # 指数函数exp

def main(_):
    train_data = context_of_idx

    with tf.Graph().as_default(), tf.Session(config=config_tf) as session:
        initializer = tf.random_uniform_initializer(-config.init_scale,
                                                config.init_scale)
        # 变量共享
        with tf.variable_scope("model", reuse=None, initializer=initializer):
            m = Model.Model(is_training=True, config=config)

        # 因为tensorflow图是在上面对象初始化的时候创建的，所以全局变量初始化的操作在这些实例创建完之后允许
        tf.global_variables_initializer().run()
        # 保存, 提取变量
        model_saver = tf.train.Saver(tf.global_variables())

        for i in range(config.iteration):
            print("Training Epoch: %d ..." % (i+1))
            train_perplexity = run_epoch(session, m, train_data, m.train_op)
            print("Epoch: %d Train Perplexity: %.3f" % (i + 1, train_perplexity))

            if (i+1) % config.save_freq == 0:
                print ("model saving ...")
                model_saver.save(session, config.model_path+'-%d'%(i+1))
                print ("Done!")

if __name__ == "__main__":
    tf.app.run()
```

##生成歌词
```python
#coding:utf-8
import tensorflow as tf
import sys,time
import numpy as np
import pickle as cPickle
import os
import random
import Config
import Model
import codecs

config_tf = tf.ConfigProto()
config_tf.gpu_options.allow_growth = True
config_tf.inter_op_parallelism_threads = 1
config_tf.intra_op_parallelism_threads = 1

config = Config.Config()

char_to_idx, idx_to_char = cPickle.load(open(config.model_path+'.voc', 'rb'))

config.vocab_size = len(char_to_idx)
is_sample = config.is_sample
is_beams = config.is_beams
beam_size = config.beam_size
len_of_generation = config.len_of_generation
start_sentence = config.start_sentence
if (len(sys.argv) == 2):
    if (sys.version_info > (3, 0)):
        start_sentence = sys.argv[1]
    else:
        start_sentence = sys.argv[1].decode("utf-8")

def run_epoch(session, m, data, eval_op, state=None):
    """Runs the model on the given data."""
    x = data.reshape((1,1))
    prob, _state, _ = session.run([m._prob, m.final_state, eval_op],
                         {m.input_data: x,
                          m.initial_state: state})
    return prob, _state

def main(_):
    with tf.Graph().as_default(), tf.Session(config=config_tf) as session:
        config.batch_size = 1
        config.num_steps = 1

        initializer = tf.random_uniform_initializer(-config.init_scale,
                                                config.init_scale)
        with tf.variable_scope("model", reuse=None, initializer=initializer):
            mtest = Model.Model(is_training=False, config=config)

        #tf.global_variables_initializer().run()

        model_saver = tf.train.Saver()
        print("model loading ...")
        model_saver.restore(session, config.model_path+'-%d'%config.save_time)
        print ("Done!")

        if not is_beams:
            # sentence state
            char_list = list(start_sentence);
            start_idx = char_to_idx[char_list[0]]
            _state = mtest.initial_state.eval()
            test_data = np.int32([start_idx])
            prob, _state = run_epoch(session, mtest, test_data, tf.no_op(), _state)
            gen_res = [char_list[0]]
            for i in range(1, len(char_list)):
                char = char_list[i]
                try:
                    char_index = char_to_idx[char]
                except KeyError:
                    char_index = np.argmax(prob.reshape(-1))
                prob, _state = run_epoch(session, mtest, np.int32([char_index]), tf.no_op(), _state)
                gen_res.append(char)
            # gen text
            if is_sample:
                gen = np.random.choice(config.vocab_size, 1, p=prob.reshape(-1))
                gen = gen[0]
            else:
                gen = np.argmax(prob.reshape(-1))
            test_data = np.int32(gen)
            gen_res.append(idx_to_char[gen])
            for i in range(len_of_generation-1):
                prob, _state = run_epoch(session, mtest, test_data, tf.no_op(), _state)
                if is_sample:
                    gen = np.random.choice(config.vocab_size, 1, p=prob.reshape(-1))
                    gen = gen[0]
                else:
                    gen = np.argmax(prob.reshape(-1))
                test_data = np.int32(gen)
                gen_res.append(idx_to_char[gen])
            print("Generated Result: {0}".format(gen_res))
        else:
            # sentence state
            char_list = list(start_sentence);
            start_idx = char_to_idx[char_list[0]]
            _state = mtest.initial_state.eval()
            beams = [(0.0, [idx_to_char[start_idx]], idx_to_char[start_idx])]
            test_data = np.int32([start_idx])
            prob, _state = run_epoch(session, mtest, test_data, tf.no_op(), _state)
            y1 = np.log(1e-20 + prob.reshape(-1))
            beams = [(beams[0][0], beams[0][1], beams[0][2], _state)]
            for i in range(1, len(char_list)):
                char = char_list[i]
                try:
                    char_index = char_to_idx[char]
                except KeyError:
                    top_indices = np.argsort(-y1)
                    char_index = top_indices[0]
                prob, _state = run_epoch(session, mtest, np.int32([char_index]), tf.no_op(), beams[0][3])
                y1 = np.log(1e-20 + prob.reshape(-1))
                beams = [(beams[0][0], beams[0][1] + [char], char_index, _state)]
            # gen text
            if is_sample:
                top_indices = np.random.choice(config.vocab_size, beam_size, replace=False, p=prob.reshape(-1))
            else:
                top_indices = np.argsort(-y1)
            b = beams[0]
            beam_candidates = []
            for i in range(beam_size):
                wordix = top_indices[i]
                beam_candidates.append((b[0] + y1[wordix], b[1] + [idx_to_char[wordix]], wordix, _state))
            beam_candidates.sort(key = lambda x:x[0], reverse = True) # decreasing order
            beams = beam_candidates[:beam_size] # truncate to get new beams
            for xy in range(len_of_generation-1):
                beam_candidates = []
                for b in beams:
                    test_data = np.int32(b[2])
                    prob, _state = run_epoch(session, mtest, test_data, tf.no_op(), b[3])
                    y1 = np.log(1e-20 + prob.reshape(-1))
                    if is_sample:
                        top_indices = np.random.choice(config.vocab_size, beam_size, replace=False, p=prob.reshape(-1))
                    else:
                        top_indices = np.argsort(-y1)
                    for i in range(beam_size):
                        wordix = top_indices[i]
                        beam_candidates.append((b[0] + y1[wordix], b[1] + [idx_to_char[wordix]], wordix, _state))
                beam_candidates.sort(key = lambda x:x[0], reverse = True) # decreasing order
                beams = beam_candidates[:beam_size] # truncate to get new beams

            if (sys.version_info > (3, 0)):
                print("Generated Result: {0}".format(beams[0][1]))
            else:
                print('Generated Result:')
                print(''.join(beams[0][1]))


if __name__ == "__main__":
    tf.app.run()
```