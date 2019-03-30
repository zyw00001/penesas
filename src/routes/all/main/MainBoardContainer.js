import {connect} from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import MainBoard from './MainBoard';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common';
import {jump} from '../../../components/Link';

const action = new Action(['all']);

export const getData = () => {
  return global.store.getState().all || {};
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({
      status: 'page',
      realCycle: 65,
      waterHole: 20
    }));
  } catch (e) {
    dispatch(action.assign({status: 'retry'}));
    helper.showError(e.message);
  }
};

const clickActionCreator = (key) => (dispatch) => {
  dispatch(action.assign({activeKey: key}));
  jump('/all/bar');
};

const mapStateToProps = (state) => {
  return state.all || {};
};

const actionCreators = {
  onInit: initActionCreator,
  onClick: clickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(MainBoard));
export default Container;
