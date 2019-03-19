import {connect} from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import MainBoard from './MainBoard';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common';

const action = new Action(['main']);
const URL_MAIN = '/api/single/main';

export const setUser = (user) => {
  global.store.dispatch(action.assign({user}));
};

const initActionCreator = () => async (dispatch) => {
  dispatch(action.assign({status: 'loading'}));
  const json = await helper.fetchJson(URL_MAIN);
  if (json.returnCode === 0) {
    const payload = json.result;
    payload.status = 'page';
    dispatch(action.assign(payload));
  } else {
    helper.showError(json.returnMsg);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return state.main || {};
};

const actionCreators = {
  onInit: initActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(MainBoard));
export default Container;
