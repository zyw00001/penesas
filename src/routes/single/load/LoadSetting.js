import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './LoadSetting.less';
import TabPage from '../login/TabPage';
import {Input, Select, Button, Radio, Checkbox} from 'antd';
import {VictoryPie} from 'victory';
import Link from "../../../components/Link";
/*import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {setUser} from '../main/MainBoardContainer';
import {jump} from '../../../components/Link';*/

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const Pie = ({count=0, total=1}) => {
  const props = {
    data: [{x: '', y: count}, {x: '', y: total - count}],
    style: {data: {stroke: 'black', strokeWidth: 3}},
    labels: d => d.x,
    labelRadius: 60,
    colorScale: ['#99ffff']
  };
  return <VictoryPie {...props} />;
};

class LoadSetting extends React.Component {
  state = {login: false};

  onLogin = () => {
    this.setState({login: true});
  };

  inputProps = (value) => {
    return {
      value: value || '',
      readOnly: true,
      style: {
        background: '#ccc'
      }
    };
  };

  renderLoad = () => {
    return (
      <div>
        <div>
          <div>工单号:</div>
          <div><Select /></div>
        </div>
        <div>
          <div>品番:</div>
          <div><Input {...this.inputProps('B0392272')} /></div>
        </div>
        <div>
          <div>机台:</div>
          <div><Input {...this.inputProps('101 H-1')} /></div>
        </div>
        <div>
          <div>标准周期:</div>
          <div><Input {...this.inputProps('65S')} /></div>
        </div>
        <div>
          <Pie count={10} total={63} />
        </div>
      </div>
    );
  };

  renderSetting = () => {
    const items = [
      {key: 'key1', title: '水口', unit: true},
      {key: 'key2', title: '毛刺', unit: true},
      {key: 'key3', title: '油污', unit: true},
      {key: 'key4', title: '外观', unit: true},
      {key: 'key5', title: '捆包', unit: true},
      {key: 'key6', title: '其他', unit: true},
      {key: 'key7', title: '备注', unit: true},
      {key: 'key8', title: '合计', unit: true},
      {key: 'key9', title: '实际周期', unit: true},
      {key: 'key10', title: '作业人数'},
      {key: 'key11', title: '理论人数'},
    ];
    const renderItem = (item) => {
      return (
        <div key={item.key}>
          <span>{`${item.title}${item.unit ? '(s)' : ''}:`}</span>
          <Input />
        </div>
      );
    };
    return (
      <div data-role='setting'>
        <div>加工时间</div>
        <div>
          {items.map(renderItem)}
        </div>
        <div>
          <Button>提交</Button>
          <Button>返回</Button>
        </div>
      </div>
    );
  };

  renderLogin = () => {
    return (
      <div data-role='login'>
        <div>授权用户</div>
        <div>
          <div>用户名:</div>
          <div><Input /></div>
        </div>
        <div>
          <div>密码:</div>
          <div><Input /></div>
        </div>
        <div>
          <Button onClick={this.onLogin}>登录</Button>
        </div>
      </div>
    );
  };

  render() {
    const {isQC} = this.props;
    return (
      <TabPage className={s.root} active='load'>
        {this.renderLoad()}
        {this.state.login ? this.renderSetting() : this.renderLogin()}
      </TabPage>
    );
  }
}

export default withStyles(s)(LoadSetting);
