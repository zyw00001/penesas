import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './MainBoard.less';
import {Link} from '../../../components';

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

class MainBoard extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    workCheck: PropTypes.object,
    QCheck: PropTypes.object,
    items: PropTypes.array
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
    const {user={}, workCheck={}, QCheck={}, items=[]} = this.props;
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
            <div>统计</div>
            <div>
              <div>水口</div>
              <div>毛刺</div>
              <div>油污</div>
              <div>外观</div>
              <div>捆绑</div>
              <div>其他</div>
            </div>
          </div>
          <div>负荷率</div>
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(MainBoard);
