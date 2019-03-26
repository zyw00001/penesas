import { combineReducers } from 'redux';
import {createReducer} from '../action-reducer/reducer';

const rootReducer = combineReducers({
  main: createReducer(['main']),
  all: createReducer(['all']),
});

export default rootReducer;
