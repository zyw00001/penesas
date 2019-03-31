import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './WorkCheck.less';
import TabPage from '../login/TabPage';
import {Input, Select, Button, Radio, Checkbox} from 'antd';
import Link from "../../../components/Link";
import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {refresh, getOrders} from '../main/MainBoardContainer';
import {jump} from '../../../components/Link';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const SelectOption = Select.Option;
const URL_CHECK = '/api/single/login/check';

const TROUBLE_OPTIONS = [
  {label: '水口', value: 'waterHole'},
  {label: '毛刺', value: 'burr'},
  {label: '油污', value: 'oil'},
  {label: '外观', value: 'face'},
  {label: '捆绑', value: 'bale'},
  {label: '尺寸', value: 'size'},
  {label: '其他', value: 'other'},
];

class WorkCheck extends React.Component {
  static propTypes = {
    isQC: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const orders = getOrders();
    this.state = {
      result: '1',
      trouble: [],
      options: orders,
      orderNo: orders.length ? orders[0].orderNo : '',
      user: ''
    }
  }

  onResultChange = (e) => {
    this.setState({result: e.target.value});
  };

  onSubmit = () => {
    if (!this.state.user) {
      helper.showError('请输入员工编号');
    } else if (this.state.user.length !== 8) {
      helper.showError('员工编号固定为8位');
    } else {
      execWithLoading(async () => {
        const body = {
          orderNo: this.state.orderNo,
          employeeId: this.state.user,
          qcType: this.props.isQC ? 1 : 0,
          result: Number(this.state.result)
        };
        if (this.state.result === '0') {
          for (const item of TROUBLE_OPTIONS) {
            body[item.value] = this.state.trouble.includes(item.value) ? 1 : 0;
          }
        }
        const option = helper.postOption(body);
        const json = await helper.fetchJson(URL_CHECK, option);
        if (json.returnCode !== 0) {
          helper.showError(json.returnMsg);
        } else {
          refresh(json.result);
          jump('/');
        }
      });
    }
  };

  groupProps = () => {
    return {
      options: TROUBLE_OPTIONS,
      disabled: this.state.result === '1',
      value: this.state.trouble,
      onChange: (value) => this.setState({trouble: value}),
    };
  };

  selectProps = () => {
    return {
      value: this.state.orderNo,
      optionLabelProp: 'value',
      dropdownMatchSelectWidth: false,
      onSelect: (value) => this.setState({orderNo: value})
    };
  };

  inputProps = () => {
    return {
      value: this.state.user,
      placeholder: '限定输入8位',
      onChange: e => e.target.value.length <= 8 && this.setState({user: e.target.value})
    };
  };

  renderOption = (option, index) => {
    return (
      <SelectOption key={index} value={option.orderNo}>
        {`${option.orderNo} | ${option.partsNo} | ${option.partsName}`}
      </SelectOption>
    );
  };

  render() {
    const {isQC} = this.props;
    return (
      <TabPage className={s.root} active={isQC ? 'Q' : 'work'}>
        <div>
          <div data-role='input'>
            <div>工单号:</div>
            <div>
              <Select {...this.selectProps()}>
                {this.state.options.map(this.renderOption)}
              </Select>
            </div>
          </div>
          <div data-role='input'>
            <div>{isQC ? '品保员:' : '内检员:'}</div>
            <div><Input {...this.inputProps()} /></div>
          </div>
          <div data-role='input'>
            <div>{isQC ? '巡检结果:' : '内检结果:'}</div>
            <RadioGroup value={this.state.result} onChange={this.onResultChange}>
              <Radio value='1'>合格</Radio>
              <Radio value='0'>{isQC ? '不合格' : '待处理'}</Radio>
            </RadioGroup>
          </div>
          <div>
            <CheckboxGroup {...this.groupProps()} />
          </div>
          <div>
            <Button onClick={this.onSubmit}>提交</Button>
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
