import {connect} from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import MainBoard from './MainBoard';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common';
import execWithLoading from '../../../common/execWithLoading';

const action = new Action(['main']);
const URL_MAIN = '/api/single/main';
const URL_CHART_DAY = '/api/single/chart/day';
const URL_CHART_MONTH = '/api/single/chart/month';

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

export const setUser = (user) => {
  global.store.dispatch(action.assign({user}));
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

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const payload = convertData(helper.getJsonResult(await helper.fetchJson(URL_MAIN)));
    payload.day = helper.getJsonResult(await helper.fetchJson(URL_CHART_DAY));
    payload.month = helper.getJsonResult(await helper.fetchJson(URL_CHART_MONTH));
    payload.chart = 'day';
    payload.status = 'page';
    dispatch(action.assign(payload));
  } catch (e) {
    dispatch(action.assign({status: 'retry'}));
    helper.showError(e.message);
  }
};

const chartChangeActionCreator = (chart) => {
  return action.assign({chart});
};

const mapStateToProps = (state) => {
  return state.main || {};
};

const actionCreators = {
  onInit: initActionCreator,
  onChartChange: chartChangeActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(MainBoard));
export default Container;
