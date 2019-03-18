import { combineReducers } from 'redux';
import {createReducer} from '../action-reducer/reducer';

const rootReducer = combineReducers({
  temp: createReducer(['temp']),
});

export default rootReducer;
