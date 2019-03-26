import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './MainBoard.less';
import {Link} from '../../../components';
import {VictoryPie} from 'victory';

const PIES = [
  {key: 'waterHole', title: '水口'},
  {key: 'burr', title: '毛刺'},
  {key: 'oil', title: '油污'},
  {key: 'face', title: '外观'},
  {key: 'bale', title: '捆绑'},
  {key: 'other', title: '其他'},
];

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

class MainBoard extends React.Component {
  renderPies = () => {
    const renderPie = (item, index) => {
      return <Pie key={index} count={this.props[item.key] || 0} total={this.props.realCycle} label={item.title}/>;
    };
    return <div>{PIES.map(renderPie)}</div>;
  };

  render() {
    return (
      <div className={s.root}>
        {this.renderPies()}
      </div>
    );
  }
}

export default withStyles(s)(MainBoard);
