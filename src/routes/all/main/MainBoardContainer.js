import {connect} from 'react-redux';
import {EnhanceLoading} from '../../../components/Enhance';
import MainBoard from './MainBoard';
import {Action} from '../../../action-reducer/action';
import helper from '../../../common';

const action = new Action(['all']);

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({
      status: 'page'
    }));
  } catch (e) {
    dispatch(action.assign({status: 'retry'}));
    helper.showError(e.message);
  }
};

const mapStateToProps = (state) => {
  return state.all || {};
};

const actionCreators = {
  onInit: initActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(MainBoard));
export default Container;
