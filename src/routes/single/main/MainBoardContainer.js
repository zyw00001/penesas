import {connect} from 'react-redux';
import MainBoard from './MainBoard';

const initActionCreator = () => () => {

};

const mapStateToProps = (state) => {
  return state.main || {};
};

const actionCreators = {
  onInit: initActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(MainBoard);
export default Container;
