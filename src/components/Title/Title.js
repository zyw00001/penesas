import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import classNames from 'classnames';
import s from './Title.less';

function Title({title, children, className, noBorder=false, ...props}) {
  return (
    <div className={classNames(s.root, className)} {...props}>
      <span data-border={!noBorder}>{title}</span>
      {children}
    </div>
  );
}

export default withStyles(s)(Title);
