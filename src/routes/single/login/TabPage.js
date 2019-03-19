import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './TabPage.less';

const TABS = [
  {key: 'user', title: '作业上岗'},
  {key: 'work', title: '工程内检'},
  {key: 'Q', title: 'QC巡检'},
  {key: 'load', title: '负荷入力'},
];

const TabPage = ({children, active, ...props}) => {
  return (
    <div className={s.root}>
      <div>{TABS.map(tab => <div key={tab.key} data-active={tab.key === active ? true : null}>{tab.title}</div>)}</div>
      <div {...props}>{children}</div>
    </div>
  );
};

export default withStyles(s)(TabPage);
