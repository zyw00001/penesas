import {connect} from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import MainBoard from './MainBoard';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common';
import execWithLoading from '../../../common/execWithLoading';
import {jump} from '../../../components/Link';

const action = new Action(['main']);
const URL_MAIN = '/api/single/main';
const URL_ORDERS = '/api/single/orders';
const URL_CHART_DAY = '/api/single/chart/day';
const URL_CHART_MONTH = '/api/single/chart/month';
const URL_CHART_YEAR = '/api/single/chart/year';

const convert = (obj) => {
  const format = (time) => time.replace(' ', '\r\n');
  if (obj) {
    return {
      time: format(obj.lastestTime || ''),
      result: obj.result
    }
  }
};

const convertData = (payload) => {
  payload.workCheck = convert(payload.orderInternalQcResultVo);
  payload.QCheck = convert(payload.orderPatrolQcResultVo);
  payload.user = payload.employeeInfoVo || undefined;
  return payload;
};

export const getOrders = () => {
  return global.store.getState().main.orders || [];
};

export const getRow = () => {
  const row = global.store.getState().main.row || -1;
  if (row > -1) {
    global.store.dispatch(action.assign({row: -1}));
  }
  return row;
};

export const refresh = (orderNo='') => {
  execWithLoading(async () => {
    const url = orderNo ? `${URL_MAIN}/${orderNo}` : URL_MAIN;
    const json = await helper.fetchJson(url);
    if (json.returnCode !== 0) {
      helper.showError(json.returnMsg);
    } else {
      global.store.dispatch(action.assign(convertData(json.result)));
    }
  });
};

// 每隔一定时间获取主看板数据
const installTimer = (getState) => {
  const timer = () => {
    setTimeout(() => {
      if (location.pathname === '/') {
        refresh(getState().main.orderNo);
      }
      timer();
    }, 1000 * 600);
  };
  timer();
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const payload = convertData(helper.getJsonResult(await helper.fetchJson(URL_MAIN)));
    payload.orders = helper.getJsonResult(await helper.fetchJson(URL_ORDERS)) || [];
    payload.day = helper.getJsonResult(await helper.fetchJson(URL_CHART_DAY));
    payload.month = helper.getJsonResult(await helper.fetchJson(URL_CHART_MONTH));
    payload.year = helper.getJsonResult(await helper.fetchJson(URL_CHART_YEAR));
    payload.chart = 'year';
    payload.status = 'page';
    installTimer(getState);
    dispatch(action.assign(payload));
  } catch (e) {
    dispatch(action.assign({status: 'retry'}));
    helper.showError(e.message);
  }
};

const chartChangeActionCreator = (chart) => {
  return action.assign({chart});
};

const rowClickActionCreator = (index) => (dispath) => {
  dispath(action.assign({row: index}));
  jump('/login/load_setting');
};

const mapStateToProps = (state) => {
  return state.main || {};
};

const actionCreators = {
  onInit: initActionCreator,
  onChartChange: chartChangeActionCreator,
  onRowClick: rowClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(MainBoard));
export default Container;
