import { combineReducers } from 'redux';
import {createReducer} from '../action-reducer/reducer';

const rootReducer = combineReducers({
  main: createReducer(['main'], null, {
    user: {name: '张小姐', level: '11级'},
    workCheck: {time: '2019-3-4\n10:35', result: '合格'},
    QCheck: {time: '2019-3-4\n10:35', result: 'NG'},
    items: [
      {key1: 'K0941605', key2: '220023943-01', key3: '65', key4: '101', key5: '2018-12-24', key6: '2018-12-30'},
      {key1: 'K0941700', key2: '220023943-01', key3: '65', key4: '101', key5: '2018-12-24', key6: '2018-1-4'}
    ]
  })
});

export default rootReducer;
