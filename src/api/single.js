import express from 'express';
import {host} from './globalConfig';
import helper from '../common';
import moment from 'moment';

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

// 获取客户端IP
const getIP = (req) => {
  const ip = req.ip.split(':');
  return ip[ip.length - 1];
};

// 获取主面板的信息
api.get('/main', async (req, res) => {
  const url = `${host}/single_panel/showBaseInfo`;
  const option = helper.postOption({macAddr: getIP(req)});
  res.send(await helper.fetchJsonByNode(req, url, option));
});

const DAY_KEYS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'twentyOne', 'twentyTwo', 'twentyThree', 'twentyFour', 'twentyFive', 'twentySix', 'twentySeven',
  'twentyEight', 'twentyNine', 'thirty', 'thirtyOne'];
const MONTH_KEYS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
  'october', 'november', 'december'];

const getCurrentDay = () => {
  return moment().date();
};

// 获取主面板图表
api.get('/chart/:type', async (req, res) => {
  const url = `${host}/single_panel/${req.params.type === 'day' ? 'showDailyChart' : 'showMonthChart'}`;
  const option = helper.postOption({macAddr: getIP(req)});
  const json = await helper.fetchJsonByNode(req, url, option);
  if (json.returnCode === 0) {
    const keys = req.params.type === 'day' ? DAY_KEYS : MONTH_KEYS;
    const length = req.params.type === 'day' ? getCurrentDay() : keys.length;
    const obj = json.result;
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push({x: i + 1, y: obj[keys[i]] || 0});
    }
    json.result = result;
  }
  res.send(json);
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
