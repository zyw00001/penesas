import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Bar.less';
import {VictoryPie, VictoryChart, VictoryBar, VictoryAxis} from 'victory';
import {getData} from '../main/MainBoardContainer';

const PIES = [
  {key: 'waterHole', title: '水口'},
  {key: 'burr', title: '毛刺'},
  {key: 'oil', title: '油污'},
  {key: 'face', title: '外观'},
  {key: 'bale', title: '捆绑'},
  {key: 'other', title: '其他'},
];

const Pie = ({count=0, total=1, label, active}) => {
  const props = {
    data: [{x: count, y: count}, {x: '', y: total - count}],
    style: {data: {stroke: 'black', strokeWidth: 3}},
    labels: d => d.x,
    labelRadius: 60,
    colorScale: active ? ['#ff33cc', 'pink'] : ['#808080', '#c9c9c9'],
  };
  const parentStyle = {position: 'relative'};
  const labelStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    bottom: '30%',
    lineHeight: '1',
    pointerEvents: 'none'
  };
  return (
    <div style={parentStyle}>
      <VictoryPie {...props} />
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

const makeTenData = (arr) => {
  const result = [];
  for (let i = 0; i < 10; i++) {
    if (i < arr.length) {
      result.push({x: 10 - i, y: arr[i], label: `B${i + 1}`});
    } else {
      result.push({x: 10 - i, y: 0,});
    }
  }
  return result;
};

const CommonBar = () => {
  const data = makeTenData([2, 1.8, 1.6, 1.5, 1.4, 1.2, 1.0]);
  const barProps = {
    data,
    horizontal: true,
    style: {
      data: {
        fill: '#4f81bd'
      }
    }
  };
  const xProps = {
    tickValues: data.map(d => d.x),
    tickFormat: (d) => 11 - d
  };
  const yProps = {
    dependentAxis: true,
    style: {
      grid: {
        stroke: 'grey',
        strokeDasharray: '2,5'
      }
    },
    tickValues: [0, 0.5, 1, 1.5, 2]
  };
  return (
    <VictoryChart domain={{x: [0.5, 10.5]}}>
      <VictoryBar {...barProps} />
      <VictoryAxis {...xProps} />
      <VictoryAxis {...yProps} />
    </VictoryChart>
  );
};

class Bar extends React.Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  state = {activeKey: 'waterHole'};

  componentWillMount() {
    this.setState(getData());
  }

  renderPies = () => {
    const pieProps = (item, index) => {
      return {
        key: index,
        count: this.state[item.key] || 0,
        total: this.state.realCycle,
        label: item.title,
        active: this.state.activeKey === item.key
      };
    };
    return <div>{PIES.map((item, index) => <Pie {...pieProps(item, index)} />)}</div>;
  };

  render() {
    return (
      <div className={s.root}>
        {this.renderPies()}
        <div>
          <CommonBar />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Bar);
