import {connect} from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import MainBoard from './MainBoard';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common';

const action = new Action(['main']);
const URL_MAIN = '/api/single/main';
const URL_CHART_DAY = '/api/single/chart/day';
const URL_CHART_MONTH = '/api/single/chart/month';

export const setUser = (user) => {
  global.store.dispatch(action.assign({user}));
};

const convert = (obj) => {
  if (!obj) {
    return null;
  } else {
    return {
      time: obj.lastestTime,
      result: obj.result
    }
  }
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const payload = helper.getJsonResult(await helper.fetchJson(URL_MAIN));
    payload.day = helper.getJsonResult(await helper.fetchJson(URL_CHART_DAY));
    payload.month = helper.getJsonResult(await helper.fetchJson(URL_CHART_MONTH));
    payload.chart = 'day';
    payload.status = 'page';
    payload.workCheck = convert(payload.orderInternalQcResultVo);
    payload.QCheck = convert(payload.orderPatrolQcResultVo);
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
