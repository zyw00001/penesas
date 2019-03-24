import express from 'express';
import {host} from './globalConfig';
import helper from '../common';
import moment from 'moment';

const api = express.Router();

const DAY_KEYS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'twentyOne', 'twentyTwo', 'twentyThree', 'twentyFour', 'twentyFive', 'twentySix', 'twentySeven',
  'twentyEight', 'twentyNine', 'thirty', 'thirtyOne'];
const MONTH_KEYS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
  'october', 'november', 'december'];

const getCurrentDay = () => {
  return moment().date();
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

// 获取主面板的信息（带工单号）
api.get('/main/:no', async (req, res) => {
  const url = `${host}/single_panel/showBaseInfo`;
  const option = helper.postOption({macAddr: getIP(req), orderNo: req.params.no});
  res.send(await helper.fetchJsonByNode(req, url, option));
});

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
  const url = `${host}/task_post/startTask`;
  const option = helper.postOption({macAddr: getIP(req), employeeNo: req.body.user});
  res.send(await helper.fetchJsonByNode(req, url, option));
});

// 工程内检或QC巡检
api.post('/login/check', async (req, res) => {
  const url = `${host}/qc/insertQc`;
  const option = helper.postOption({macAddr: getIP(req), ...req.body});
  res.send(await helper.fetchJsonByNode(req, url, option));
});

export default api;
