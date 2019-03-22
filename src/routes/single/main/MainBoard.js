import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './MainBoard.less';
import {Link} from '../../../components';
import {VictoryPie, VictoryChart, VictoryLine, VictoryScatter, VictoryAxis} from 'victory';
import {Button} from 'antd';

const COLS = [
  {key: 'key1', title: '工单号'},
  {key: 'key2', title: '品番'},
  {key: 'key3', title: '标准周期'},
  {key: 'key4', title: '注塑机编号'},
  {key: 'key5', title: '制造开始时间'},
  {key: 'key6', title: '制造结束时间'},
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
    colorScale: ['#99ffff']
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
    colorScale: ['#9999ff']
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

const Chart = ({data, title}) => {
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
  const tickValues = data.map(item => item.x);
  return (
    <div style={{position: 'relative', background: 'white'}}>
      <div style={titleStyle}>{title || '负荷率'}</div>
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
    items: PropTypes.array,
    data: PropTypes.array
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
        return this.props.workCheck.result === '合格' ? '#33ff00' : 'red';
      }
    } else if (key === 'Q') {
      if (!this.props.QCheck) {
        return grey;
      } else {
        return this.props.QCheck.result === '合格' ? '#33ff00' : 'red';
      }
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

  render() {
    const {user={}, workCheck={}, QCheck={}, items=[], data=[]} = this.props;
    const style = {lineHeight: '20px', paddingTop: '10px', whiteSpace: 'pre-wrap'};
    return (
      <div className={s.root}>
        <div>
          <div>
            <div {...this.getProps('user')}>
              <div>照片</div>
              <div>{user.name || ''}</div>
              <div>{user.level || ''}</div>
            </div>
          </div>
          <div>
            <div {...this.getProps('work')}>
              <div>工</div>
              <div style={style}>{workCheck.time || ''}</div>
              <div>{workCheck.result || ''}</div>
            </div>
          </div>
          <div>
            <div {...this.getProps('Q')}>
              <div>Q</div>
              <div style={style}>{QCheck.time || ''}</div>
              <div>{QCheck.result || ''}</div>
            </div>
          </div>
          <div>
            <div onClick={this.onListClick} data-expand={this.isExpand('list')}>
              <div>工单列表</div>
              <div><Table cols={COLS} items={items}/></div>
            </div>
          </div>
        </div>
        <Link to='/login'>
          <div>
            <div>注塑机编号</div>
            <div>工单号</div>
            <div>单号</div>
          </div>
          <div>
            <PieStatistics count={38} total={65} />
            <div>
              <Pie count={5} total={65} label='水口'/>
              <Pie count={3} total={65} label='毛刺'/>
              <Pie count={25} total={65} label='油污'/>
              <Pie count={0} total={65} label='外观'/>
              <Pie count={0} total={65} label='捆绑'/>
              <Pie count={5} total={65} label='其他'/>
            </div>
          </div>
          <div>
            <Chart data={data} />
            <div onClick={e => e.stopPropagation()}>
              <Button>日</Button>
              <Button>月</Button>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(MainBoard);
