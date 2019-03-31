import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './TabPage.less';
import {Link} from '../../../components';

const TABS = [
  {key: 'user', title: '作业上岗', to: '/login/user'},
  {key: 'work', title: '工程内检', to: '/login/work_check'},
  {key: 'Q', title: '品保巡检', to: '/login/qc_check'},
  {key: 'load', title: '负荷入力', to: '/login/load_setting'},
];

const TabPage = ({children, active, ...props}) => {
  const renderTab = (tab) => {
    return <Link key={tab.key} data-active={tab.key === active ? true : null} to={tab.to}>{tab.title}</Link>;
  };
  return (
    <div className={s.root}>
      <div>{TABS.map(renderTab)}</div>
      <div {...props}>{children}</div>
    </div>
  );
};

export default withStyles(s)(TabPage);
