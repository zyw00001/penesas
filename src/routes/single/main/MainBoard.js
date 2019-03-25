import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './MainBoard.less';
import {Link} from '../../../components';
import {VictoryPie, VictoryChart, VictoryLine, VictoryScatter, VictoryAxis} from 'victory';
import {Button} from 'antd';
import moment from 'moment';

const COLS = [
  {key: 'orderNo', title: '工单号'},
  {key: 'partsNo', title: '品番'},
  {key: 'stdCycleTime', title: '标准周期'},
  {key: 'machineNo', title: '注塑机编号'},
  {key: 'mStart', title: '制造开始时间'},
  {key: 'mEnd', title: '制造结束时间'},
];

const PIES = [
  {key: 'waterHole', title: '水口'},
  {key: 'burr', title: '毛刺'},
  {key: 'oil', title: '油污'},
  {key: 'face', title: '外观'},
  {key: 'bale', title: '捆绑'},
  {key: 'other', title: '其他'},
];

const Table = ({cols, items}) => {
  const toCol = (col, index) => <th key={index}>{col.title}</th>;
  const toRow = (item, index) => <tr key={index}>{cols.map((col, index) => <td key={index}>{item[col.key]}</td>)}</tr>;
  return (
    <table className={s.table}>
      <thead><tr>{cols.map(toCol)}</tr></thead>
      <tbody>{items.map(toRow)}</tbody>
    </table>
  )
};

const Pie = ({count=0, total=1, label}) => {
  const props = {
    data: [{x: count, y: count}, {x: '', y: total - count}],
    style: {data: {stroke: 'black', strokeWidth: 3}},
    labels: d => d.x,
    labelRadius: 60,
    colorScale: ['#99ffff', 'pink']
  };
  const parentStyle = {position: 'relative'};
  const labelStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: '60px',
    lineHeight: '1'
  };
  return (
    <div style={parentStyle}>
      <VictoryPie {...props} />
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

const percent = (count ,total) => {
  return `${Number((count * 100 / total).toFixed(2))}%`;
};

const PieStatistics = ({count=0, total=1}) => {
  const props = {
    data: [{y: count}, {y: total - count}],
    style: {data: {stroke: 'black', strokeWidth: 3}},
    labels: () => '',
    colorScale: ['#9999ff', 'pink']
  };
  const parentStyle = {position: 'relative'};
  const labelStyle = {
    position: 'absolute',
    height: '100%',
    top: 0,
    fontSize: '16px'
  };
  const label1Style = Object.assign({left: '30px', color: '#ff56cf'}, labelStyle);
  const label2Style = Object.assign({right: '40px', color: '#993359'}, labelStyle);
  return (
    <div style={parentStyle}>
      <VictoryPie {...props} />
      <div style={label1Style}>{percent(count, total)}</div>
      <div style={label2Style}>{`${count}/${total}`}</div>
    </div>
  );
};

const Chart = ({month, day, type}) => {
  const CHART_COLOR = '#999999';
  const xStyle = {
    axis: {stroke: CHART_COLOR},
  };
  const yStyle = {
    axis: {stroke: CHART_COLOR},
    grid: {stroke: CHART_COLOR, strokeDasharray: '2,5'},
  };
  const titleStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: '20px',
    color: 'black',
    top: '20px'
  };
  const data = type === 'day' ? day : month;
  const length = type === 'day' ? moment().daysInMonth() : data.length;
  const tickValues = new Array(length).fill(0).map((item, index) => index + 1);
  return (
    <div style={{position: 'relative', background: 'white'}}>
      <div style={titleStyle}>负荷率</div>
      <VictoryChart width={1024}>
        <VictoryLine data={data} style={{data: {stroke: '#4f81bd'}}}/>
        <VictoryScatter data={data} size={5} symbol='diamond' style={{data: {fill: '#4f81bd'}}} />
        <VictoryAxis style={xStyle} tickValues={tickValues} />
        <VictoryAxis style={yStyle} dependentAxis />
      </VictoryChart>
    </div>
  );
};

class MainBoard extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    workCheck: PropTypes.object,
    QCheck: PropTypes.object,
    orders: PropTypes.array,
    day: PropTypes.array,
    month: PropTypes.array,
    chart: PropTypes.string.isRequired,
    onChartChange: PropTypes.func.isRequired
  };

  state = {expand: ''};

  isExpand = (key) => {
    return this.state.expand === key ? true : null;
  };

  setExpand = (key) => {
    if (!key) {
      this.setState({expand: ''});
    } else if (this.state.expand === key) {
      this.setState({expand: ''});
    } else {
      this.setState({expand: key});
    }
  };

  onListClick = () => {
    this.setExpand('list');
  };

  getBackgroundColor = (key) => {
    const grey = '#ececec';
    if (key === 'user') {
      if (!this.isExpand(key)) {
        return 'transparent';
      } else {
        return !this.props.user ?  grey : '#0066ff';
      }
    } else if (key === 'work') {
      if (!this.props.workCheck) {
        return grey;
      } else {
        return this.props.workCheck.result === 1 ? '#33ff00' : 'red';
      }
    } else if (key === 'Q') {
      if (!this.props.QCheck) {
        return grey;
      } else {
        return this.props.QCheck.result === 1 ? '#33ff00' : 'red';
      }
    }
  };

  getCheckTitle = (key) => {
    const obj = this.props[key];
    if (obj) {
      return obj.result === 1 ? '合格' : 'NG';
    } else {
      return '';
    }
  };

  getProps = (key) => {
    return {
      'data-expand': this.isExpand(key),
      style: {
        background: this.getBackgroundColor(key)
      },
      onClick: this.setExpand.bind(null, key)
    }
  };

  calTrouble = () => {
    return PIES.reduce((result, pie) => {
      return result + (this.props[pie.key] || 0);
    }, 0);
  };

  renderPies = () => {
    const renderPie = (item, index) => {
      return <Pie key={index} count={this.props[item.key] || 0} total={this.props.realCycle} label={item.title}/>;
    };
    return <div>{PIES.map(renderPie)}</div>;
  };

  render() {
    const {user={}, workCheck={}, QCheck={}, orders=[], data=[]} = this.props;
    const style = {lineHeight: '20px', paddingTop: '10px', whiteSpace: 'pre-wrap'};
    return (
      <div className={s.root}>
        <div>
          <div>
            <div {...this.getProps('user')}>
              <div>照片</div>
              <div>{user.name || ''}</div>
              <div>{user.grade || ''}</div>
            </div>
          </div>
          <div>
            <div {...this.getProps('work')}>
              <div>工</div>
              <div style={style}>{workCheck.time || ''}</div>
              <div>{this.getCheckTitle('workCheck')}</div>
            </div>
          </div>
          <div>
            <div {...this.getProps('Q')}>
              <div>Q</div>
              <div style={style}>{QCheck.time || ''}</div>
              <div>{this.getCheckTitle('QCheck')}</div>
            </div>
          </div>
          <div>
            <div onClick={this.onListClick} data-expand={this.isExpand('list')}>
              <div>工单列表</div>
              <div><Table cols={COLS} items={orders}/></div>
            </div>
          </div>
        </div>
        <Link to='/login'>
          <div>
            <div>{this.props.machineNo}</div>
            <div>{this.props.orderNo}</div>
            <div>{this.props.partsNo}</div>
          </div>
          <div>
            <PieStatistics count={this.calTrouble()} total={this.props.realCycle} />
            {this.renderPies()}
          </div>
          <div>
            <Chart month={this.props.month} day={this.props.day} type={this.props.chart} />
            <div onClick={e => e.stopPropagation()}>
              <Button onClick={() => this.props.onChartChange('day')}>日</Button>
              <Button onClick={() => this.props.onChartChange('month')}>月</Button>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(MainBoard);
