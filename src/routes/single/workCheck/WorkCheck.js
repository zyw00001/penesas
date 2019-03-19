import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './WorkCheck.less';
import TabPage from '../login/TabPage';
/*import {Input, Button} from 'antd';
import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {setUser} from '../main/MainBoardContainer';
import {jump} from '../../../components/Link';*/

class WorkCheck extends React.Component {
    render() {
    return (
      <TabPage className={s.root} active='work'>
      </TabPage>
    );
  }
}

export default withStyles(s)(WorkCheck);
