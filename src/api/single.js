import express from 'express';

const api = express.Router();

const random = (min, max) => {
  return Number((Math.random() * (max - min)).toFixed(2));
};

const data = {
  workCheck: {time: '2019-3-4\n10:35', result: '合格'},
  QCheck: {time: '2019-3-4\n10:35', result: 'NG'},
  items: [
    {key1: 'K0941605', key2: '220023943-01', key3: '65', key4: '101', key5: '2018-12-24', key6: '2018-12-30'},
    {key1: 'K0941700', key2: '220023943-01', key3: '65', key4: '101', key5: '2018-12-24', key6: '2018-1-4'}
  ],
  data: new Array(31).fill(0).map((v, index) => ({x: index + 1, y: random(0, 1.2)}))
};

// 获取主面板的信息
api.get('/main', async (req, res) => {
  res.send({
    returnCode: 0,
    result: data
  });
});

// 作业上岗登陆
api.post('/login/user', async (req, res) => {
  if (req.body.user !== '12345678') {
    res.send({returnCode: -1, returnMsg: '员工编码不存在，请重新输入'});
  } else {
    data.user = {name: '张小姐', level: '11级'};
    res.send({returnCode: 0, result: data.user});
  }
});

export default api;
