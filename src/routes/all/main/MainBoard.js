import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './MainBoard.less';
import {VictoryPie} from 'victory';

const PIES = [
  {key: 'waterHole', title: '水口'},
  {key: 'burr', title: '毛刺'},
  {key: 'oil', title: '油污'},
  {key: 'face', title: '外观'},
  {key: 'bale', title: '捆包'},
  {key: 'other', title: '其他'},
];

const Pie = ({count=0, total=1, label, onClick}) => {
  const props = {
    data: [{x: count, y: count}, {x: '', y: total - count}],
    style: {data: {stroke: 'black', strokeWidth: 3}},
    labels: d => d.x,
    labelRadius: 60,
    colorScale: ['#ff9966', 'pink'],
    events: [{
      target: 'data',
      eventHandlers: {
        onClick
      }
    }]
  };
  const parentStyle = {position: 'relative'};
  const labelStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    bottom: '25%',
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

class MainBoard extends React.Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  total = () => {
    return PIES.reduce((result, item) => {
      return result + (this.props[item.key] || 0);
    }, 0);
  };

  renderPies = () => {
    const total = this.total();
    const pieProps = (item, index) => {
     return {
       total,
       key: index,
       count: this.props[item.key] || 0,
       label: item.title,
       onClick: this.props.onClick.bind(null, item.key)
     };
    };
    return <div>{PIES.map((item, index) => <Pie {...pieProps(item, index)} />)}</div>;
  };

  render() {
    return (
      <div className={s.root}>
        <div>负荷率主看板</div>
        {this.renderPies()}
      </div>
    );
  }
}

export default withStyles(s)(MainBoard);
