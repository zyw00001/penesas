import express from 'express';
import {host} from './globalConfig';
import helper from '../common';
import moment from 'moment';

const api = express.Router();

const MONTH_KEYS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'twentyOne', 'twentyTwo', 'twentyThree', 'twentyFour', 'twentyFive', 'twentySix', 'twentySeven',
  'twentyEight', 'twentyNine', 'thirty', 'thirtyOne'];
const YEAR_KEYS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
  'october', 'november', 'december'];

const getCurrentDay = () => {
  return moment().date();
};

// 获取客户端IP
const getIP = (req) => {
  //const ip = req.ip.split(':');
  //return ip[ip.length - 1];
  return '10.0.0.18';
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

const getChartInfo = (type) => {
  const info ={};
  if (type === 'year') {
    info.path = 'showMonthChart';
    info.keys = YEAR_KEYS;
    info.count = YEAR_KEYS.length;
  } else if (type === 'month') {
    info.path = 'showDailyChart';
    info.keys = MONTH_KEYS;
    info.count = getCurrentDay();
  } else {
    info.path = 'showHourChart';
    info.keys = MONTH_KEYS;
    info.count = 24;
  }
  return info;
};

// 获取主面板图表
api.get('/chart/:type', async (req, res) => {
  const {path, keys, count} = getChartInfo(req.params.type);
  const url = `${host}/single_panel/${path}`;
  const option = helper.postOption({macAddr: getIP(req)});
  const json = await helper.fetchJsonByNode(req, url, option);
  if (json.returnCode === 0) {
    const obj = json.result;
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push({x: i + 1, y: obj[keys[i]] || 0});
    }
    json.result = result;
  }
  res.send(json);
});

// 获取未完成的订单
api.get('/orders', async (req, res) => {
  const url = `${host}/load_input_force/getMachineUncompleteOrders`;
  const option = helper.postOption({macAddr: getIP(req)});
  res.send(await helper.fetchJsonByNode(req, url, option));
});

// 获取时间段
api.get('/times/:order', async (req, res) => {
  const url = `${host}/load_input_force/getUncompleteOrderLoadInputForce/${req.params.order}`;
  res.send(await helper.fetchJsonByNode(req, url));
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

// 负荷入力登录
api.post('/login/load', async (req, res) => {
  const url = `${host}/employee_info/login`;
  const option = helper.postOption({employeeNo: req.body.username, password: req.body.password});
  res.send(await helper.fetchJsonByNode(req, url, option));
});

// 负荷入力提交
api.post('/load/commit', async (req, res) => {
  const url = `${host}/load_input_force/insertLoadInputForce`;
  const option = helper.postOption(req.body);
  res.send(await helper.fetchJsonByNode(req, url, option));
});

export default api;
