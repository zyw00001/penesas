import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './WorkCheck.less';
import TabPage from '../login/TabPage';
import {Input, Select, Button, Radio, Checkbox} from 'antd';
/*import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {setUser} from '../main/MainBoardContainer';
import {jump} from '../../../components/Link';*/

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class WorkCheck extends React.Component {
  state = {result: '合格'};

  onResultChange = (e) => {
    this.setState({result: e.target.value});
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
            <div><Input /></div>
          </div>
          <div data-role='input'>
            <div>内检结果:</div>
            <RadioGroup value={this.state.result} onChange={this.onResultChange}>
              <Radio value='合格'>合格</Radio>
              <Radio value='NG'>待处理</Radio>
            </RadioGroup>
          </div>
          <div>
            <CheckboxGroup>
              <Checkbox>水口</Checkbox>
              <Checkbox>毛刺</Checkbox>
              <Checkbox>油污</Checkbox>
              <Checkbox>外观</Checkbox>
              <Checkbox>捆包</Checkbox>
              <Checkbox>尺寸</Checkbox>
              <Checkbox>其他</Checkbox>
            </CheckboxGroup>
          </div>
          <div>
            <Button>提交</Button>
            <Button>返回</Button>
          </div>
        </div>
      </TabPage>
    );
  }
}

export default withStyles(s)(WorkCheck);
