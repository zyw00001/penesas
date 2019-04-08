import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './LoadSetting.less';
import TabPage from '../login/TabPage';
import {Input, Select, Button, InputNumber} from 'antd';
import {VictoryPie} from 'victory';
import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {refresh, getOrders, getRow} from '../main/MainBoardContainer';
import Link, {jump} from '../../../components/Link';
import moment from 'moment';
import SettingDialog from './SettingDialog';

const SelectOption = Select.Option;

const URL_TIMES =  '/api/single/times';
const URL_LOGIN = '/api/single/login/load';
const URL_COMMIT = '/api/single/load/commit';
const URL_USER = '/api/single/user';

const FIELDS = [
  {key: 'waterHole', title: '水口', unit: true},
  {key: 'burr', title: '毛刺', unit: true},
  {key: 'oil', title: '油污', unit: true},
  {key: 'face', title: '外观', unit: true},
  {key: 'bale', title: '捆包', unit: true},
  {key: 'other', title: '其他', unit: true},
  {key: 'remark', title: '备注', unit: true, readOnly: true},
  {key: 'total', title: '合计', unit: true, readOnly: true},
  {key: 'realCycle', title: '实际周期', unit: true},
  {key: 'workerNumber', title: '作业人数'},
  {key: 'theoryWorkerNumber', title: '理论人数'},
];

const FIELDS2 = [
  {key: 'realCycle', title: '实际周期'},
  {key: 'workerNumber', title: '作业人数'},
  {key: 'theoryWorkerNumber', title: '理论人数'},
];

const TOTAL_KEYS = [
  'waterHole',
  'burr',
  'oil',
  'face',
  'bale',
  'other'
];

const getTimes = (orderNo) => {
  return execWithLoading(async () => {
    const json = await helper.fetchJson(`${URL_TIMES}/${orderNo}`);
    if (json.returnCode !== 0) {
      helper.showError(json.returnMsg);
    } else {
      return json.result;
    }
  });
};

const format = (time) => {
  return moment(time).format('MM-DD HH:mm');
};

const percent = (count ,total) => {
  return `${Number((count * 100 / total).toFixed(2))}%`;
};

const Pie = ({count=0, total=1}) => {
  const props = {
    data: [{x: '', y: count}, {x: '', y: total - count}],
    style: {data: {stroke: 'black', strokeWidth: 3}},
    labels: d => d.x,
    labelRadius: 60,
    colorScale: ['#99ffff', 'pink']
  };
  const parentStyle = {position: 'relative', height: '100%'};
  const labelStyle = {
    position: 'absolute',
    height: '100%',
    top: 0,
    fontSize: '16px'
  };
  const label1Style = Object.assign({right: 'calc(50% + 10px)', color: 'red'}, labelStyle);
  const label2Style = Object.assign({left: 'calc(50% + 10px)', color: 'red'}, labelStyle);
  return (
    <div style={parentStyle}>
      <VictoryPie {...props} />
      <div style={label1Style}>{percent(count, total)}</div>
      <div style={label2Style}>{`${count}/${total}`}</div>
    </div>
  );
};

class LoadSetting extends React.Component {
  constructor(props) {
    super(props);
    const orders = getOrders();
    const index = getRow();
    this.state = {
      orders,
      login: false,
      total: '',
      time: '',
      timeOptions: [],
      username: '',
      password: '',
      dialog: false,
      ...orders.length ? orders[index > -1 ? index : 0] : {},
    };
  }

  componentWillMount() {
    if (this.state.orderNo) {
      this.onOrderChange(this.state.orderNo);
    }
  }

  onLogin = () => {
    if (!this.state.username) {
      helper.showError('请输入用户名');
    } else if (!this.state.password) {
      helper.showError('请输入密码');
    } else {
      execWithLoading(async () => {
        const option = helper.postOption({username: this.state.username, password: this.state.password});
        const json = await helper.fetchJson(URL_LOGIN, option);
        if (json.returnCode !== 0) {
          helper.showError(json.returnMsg);
        } else {
          this.setState({login: true, password: ''});
        }
      });
    }
  };

  onCommit = () => {
    for (const item of FIELDS2) {
      if (!this.state[item.key]) {
        helper.showError(`${item.title}为必填，且不能为0`);
        return;
      }
    }

    execWithLoading(async () => {
      const keys = FIELDS.map(obj => obj.key).filter(key => key !== 'total');
      const index = this.state.time;
      const time = typeof index === 'number' ? this.state.timeOptions[index].startPeriod : '';
      const body = {orderNo: this.state.orderNo, recordTime: time, employeeNo: this.state.username};
      for (const key of keys) {
        if (typeof this.state[key] === 'number') {
          body[key] = this.state[key]
        } else if (this.state[key]) {
          body[key] = Number(this.state[key]);
        }
      }
      const option = helper.postOption(body);
      const json = await helper.fetchJson(URL_COMMIT, option);
      if (json.returnCode !== 0) {
        helper.showError(json.returnMsg);
      } else {
        refresh(json.result);
        jump('/');
      }
    });
  };

  inputProps = (key) => {
    return {
      value: this.state[key] || '',
      readOnly: true,
      style: {
        background: '#ccc'
      }
    };
  };

  onOrderChange = (value) => {
    getTimes(value).then(times => {
      if (times && times.length) {
        this.setState({timeOptions: times, time: 0});
      } else {
        this.setState({timeOptions: [], time: ''});
      }
    });
  };

  onOrderSelect = (value) => {
    const order = this.state.orders.find(order => order.orderNo === value);
    this.setState({...order});
    this.onOrderChange(value);
  };

  onNumberBlur = () => {
    const keys = TOTAL_KEYS.filter(key => typeof this.state[key] === 'number');
    if (keys.length) {
      this.setState({
        total: keys.reduce((result, key) => result + this.state[key], 0)
      });
    } else {
      if (this.state.total !== '') {
        this.setState({total: ''});
      }
    }
  };

  selectProps = () => {
    return {
      value: this.state.orderNo,
      optionLabelProp: 'value',
      dropdownMatchSelectWidth: false,
      onSelect: this.onOrderSelect
    };
  };

  selectTimeProps = () => {
    return {
      style: {fontSize: '16px'},
      value: this.state.time,
      dropdownMatchSelectWidth: false,
      onSelect: (value) => this.setState({time: value})
    };
  };

  renderOption = (option, index) => {
    return (
      <SelectOption key={index} value={option.orderNo}>
        {`${option.orderNo} | ${option.partsNo} | ${option.partsName}`}
      </SelectOption>
    );
  };

  renderTimeOption = (option, index) => {
    return (
      <SelectOption key={index} value={index}>
        {`${format(option.startPeriod)} - ${format(option.endPeriod)}`}
      </SelectOption>
    );
  };

  onLoginUserChange = (e) => {
    const len = e.target.value.length;
    if (len <= 8) {
      this.setState({username: e.target.value});
      if (len === 8) {
        execWithLoading(async () => {
          const url = `${URL_USER}/${e.target.value}`;
          const json = await helper.fetchJson(url);
          if (json.returnCode !== 0) {
            helper.showError(json.returnMsg);
          } else if (json.result.jobFeature !== 'workerMonitor') {
            helper.showError('该编号不是作业班长人员');
          }
        });
      }
    }
  };

  usernameProps = () => {
    return {
      value: this.state.username,
      placeholder: '限定8位',
      onChange: this.onLoginUserChange,
      onPressEnter: this.onLogin
    }
  };

  passwordProps = () => {
    return {
      value: this.state.password,
      type: 'password',
      autoComplete: 'new-password',
      onChange: e => this.setState({password: e.target.value}),
      onPressEnter: this.onLogin
    }
  };

  numberProps = (key, readOnly=false) => {
    return {
      readOnly,
      min: 0,
      value: this.state[key] || (this.state[key] === 0 ? 0 : ''),
      onChange: value => this.setState({[key]: value}),
      ...readOnly ? {style: {background: '#ccc'}} : {onBlur: this.onNumberBlur}
    };
  };

  renderLoad = () => {
    return (
      <div>
        <div>
          <div>工单号:</div>
          <div>
            <Select {...this.selectProps()}>{this.state.orders.map(this.renderOption)}</Select>
          </div>
        </div>
        <div>
          <div>时间段:</div>
          <div>
            <Select {...this.selectTimeProps()}>{this.state.timeOptions.map(this.renderTimeOption)}</Select>
          </div>
        </div>
        <div>
          <div>品番:</div>
          <div><Input {...this.inputProps('partsNo')} /></div>
        </div>
        <div>
          <div>机台:</div>
          <div><Input {...this.inputProps('machineNo')} /></div>
        </div>
        <div>
          <div>标准周期:</div>
          <div><Input {...this.inputProps('stdCycleTime')} /></div>
        </div>
        <div>
          {this.state.realCycle && (typeof this.state.realCycle === 'number') ? <Pie count={this.state.total || 0} total={this.state.realCycle} /> : null}
        </div>
      </div>
    );
  };

  dialogProps = () => {
    return {
      afterClose: (sum) => {
        if (sum === null) {
          this.setState({dialog: false});
        } else {
          this.setState({dialog: false, remark: sum});
        }
      }
    }
  };

  renderRemark = (props) => {
    props.style.width = '100%';
    props.placeholder = '点击设置备注';
    return (
      <span style={{display: 'inline-block'}} onClick={() => this.setState({dialog: true})}>
        <InputNumber {...props} />
        {this.state.dialog ? <SettingDialog {...this.dialogProps()} /> : null}
      </span>
    );
  };

  renderSetting = () => {
    const renderItem = (item) => {
      const props = this.numberProps(item.key, item.readOnly);
      return (
        <div key={item.key}>
          <span>{`${item.title}${item.unit ? '(s)' : ''}:`}</span>
          {item.key === 'remark' ? this.renderRemark(props) : <InputNumber {...props} />}
        </div>
      );
    };
    return (
      <div data-role='setting'>
        <div>
          <div>加工时间</div>
          <div>
            {FIELDS.map(renderItem)}
          </div>
          <div>
            <Button onClick={this.onCommit}>提交</Button>
            <Button><Link to='/'>返回</Link></Button>
          </div>
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
          <div><Input {...this.usernameProps()} /></div>
        </div>
        <div>
          <div>密码:</div>
          <div><Input {...this.passwordProps()} /></div>
        </div>
        <div>
          <Button onClick={this.onLogin}>登录</Button>
          <Button><Link to='/'>返回</Link></Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <TabPage className={s.root} active='load'>
        {this.renderLoad()}
        {this.state.login ? this.renderSetting() : this.renderLogin()}
      </TabPage>
    );
  }
}

export default withStyles(s)(LoadSetting);
