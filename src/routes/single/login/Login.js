import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Login.less';
import {Link} from '../../../components';

const ITEMS = [
  {title: '作业上岗', to: '/'},
  {title: '工程内检', to: '/'},
  {title: 'QC巡检', to: '/'},
  {title: '负荷入力', to: '/'},
];

const Login = () => {
  return (
    <div className={s.root}>
      {ITEMS.map((item, index) => <Link to={item.to} key={index}>{item.title}</Link>)}
    </div>
  );
};

export default withStyles(s)(Login);