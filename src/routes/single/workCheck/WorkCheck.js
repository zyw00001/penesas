import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './WorkCheck.less';
import TabPage from '../login/TabPage';
import {Input, Select, Button, Radio, Checkbox} from 'antd';
import Link from "../../../components/Link";
/*import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {setUser} from '../main/MainBoardContainer';
import {jump} from '../../../components/Link';*/

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class WorkCheck extends React.Component {
  state = {result: '合格', trouble: []};

  onResultChange = (e) => {
    this.setState({result: e.target.value});
  };

  groupProps = () => {
    return {
      options: [
        {label: '水口', value: '2'},
        {label: '毛刺', value: '3'},
        {label: '油污', value: '4'},
        {label: '外观', value: '5'},
        {label: '捆包', value: '6'},
        {label: '尺寸', value: '7'},
        {label: '其他', value: '8'},
      ],
      disabled: this.state.result === '合格',
      value: this.state.trouble,
      onChange: (value) => this.setState({trouble: value}),
    };
  };

  render() {
    return (
      <TabPage className={s.root} active='work'>
        <div>
          <div data-role='input'>
            <div>工单号:</div>
            <div><Select /></div>
          </div>
          <div data-role='input'>
            <div>内检员:</div>
            <div><Input placeholder='限定输入8位' /></div>
          </div>
          <div data-role='input'>
            <div>内检结果:</div>
            <RadioGroup value={this.state.result} onChange={this.onResultChange}>
              <Radio value='合格'>合格</Radio>
              <Radio value='NG'>待处理</Radio>
            </RadioGroup>
          </div>
          <div>
            <CheckboxGroup {...this.groupProps()} />
          </div>
          <div>
            <Button>提交</Button>
            <Button>
              <Link to='/'>返回</Link>
            </Button>
          </div>
        </div>
      </TabPage>
    );
  }
}

export default withStyles(s)(WorkCheck);
