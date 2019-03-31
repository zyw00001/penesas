import express from 'express';
import moment from 'moment';

const api = express.Router();

const random = (min, max) => {
  return Number((Math.random() * (max - min)).toFixed(2));
};

const genChart = (count) => {
  return new Array(count).fill(0).map((v, index) => ({x: index + 1, y: random(0, 1.2)}));
};

const data = {
};

const chart = {
  day: genChart(24),
  month: genChart(moment().date()),
  year: genChart(12)
};

const orders =  [
  {orderNo: 'K0941605', partsNo: '220023943-01', partsName: '品番1', stdCycleTime: '65', machineNo: '101', mStart: '2018-12-24', mEnd: '2018-12-30'},
  {orderNo: 'K0941700', partsNo: '220023943-01', partsName: '品番2', stdCycleTime: '65', machineNo: '101', mStart: '2018-12-24', mEnd: '2018-1-4'}
];

const times = {
  K0941605: [{startPeriod: '2019-03-26 08:00', endPeriod: '2019-03-26 12:00'}],
  K0941700: [
    {startPeriod: '2019-03-26 08:00', endPeriod: '2019-03-26 12:00'},
    {startPeriod: '2019-03-26 14:00', endPeriod: '2019-03-26 18:00'},
  ]
};

const getOrder = (orderNo) => {
  return orders.find(order => order.orderNo === orderNo) || {};
};

const genData = (result='') => {
  return {returnCode: 0, result};
};

// 获取主面板的信息
api.get('/main', async (req, res) => {
  res.send(genData({...data, ...orders[0]}));
});

// 获取主面板的信息（带工单号）
api.get('/main/:no', async (req, res) => {
  res.send(genData({...data, ...getOrder(req.params.no)}));
});

// 获取主面板图表
api.get('/chart/:type', async (req, res) => {
  res.send(genData(chart[req.params.type]));
});

// 获取未完成的订单
api.get('/orders', async (req, res) => {
  res.send(genData(orders));
});

// 获取时间段
api.get('/times/:order', async (req, res) => {
  res.send(genData(times[req.params.order]));
});

// 作业上岗登陆
api.post('/login/user', async (req, res) => {
  data.employeeInfoVo = {name: '张三', grade: '11'};
  res.send(genData(orders[0].orderNo));
});

// 工程内检或QC巡检
api.post('/login/check', async (req, res) => {
  const key = req.body.qcType === 1 ? 'orderPatrolQcResultVo' : 'orderInternalQcResultVo';
  data[key] = {lastestTime: moment().format('YYYY-MM-DD hh:mm'), result: req.body.result};
  res.send(genData(req.body.orderNo));
});

// 负荷入力登录
api.post('/login/load', async (req, res) => {
  res.send(genData());
});

// 负荷入力提交
api.post('/load/commit', async (req, res) => {
  Object.assign(data, req.body);
  res.send(genData(req.body.orderNo));
});

export default api;
