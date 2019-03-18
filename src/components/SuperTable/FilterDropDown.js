import React from 'react';
import PropTypes from 'prop-types';
import {Button, Input} from 'antd';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './FilterDropDown.less';
import Control from "../Control/Control";

class FilterDropDown extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onSearch: PropTypes.func,
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {value: props.value || ''};
    if (props.isDateFilterByStartAndEnd) {
      const {start='', end=''} = props.value || {};
      this.state = {start, end};
    } else {
      this.state = {value: props.value || ''};
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isDateFilterByStartAndEnd) {
      const {start= '', end= ''} = newProps.value || {};
      this.setState({start, end});
    } else {
      this.setState({value: newProps.value || ''});
    }
  }

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
  };

  onDateChange = (key, value) => {
    this.setState({[key]: value});
  };

  onSearch = () => {
    const {onSearch, isDateFilterByStartAndEnd} = this.props;
    if (onSearch) {
      const value = (!this.state.start && !this.state.end) ? "" : this.state;
      const val = isDateFilterByStartAndEnd ? value : this.state.value;
      onSearch(val);
    }
  };

  DateInputCreator = () => {
    const {props} = this.props;
      const propsStart = {
        type: "date",
        size: "small",
        showTime: props ? props.showTime: true,
        value: this.state.start,
        style: {marginRight: '5px'},
        onChange: this.onDateChange.bind(null, 'start')
        };
      const propsEnd = {
        type: "date",
        size: "small",
        showTime: props ? props.showTime: true,
        value: this.state.end,
        style: {marginLeft: '5px'},
        onChange: this.onDateChange.bind(null, 'end')
      };
      return (<div className={s.date}>
        <div><Control {...propsStart} />To<Control {...propsEnd} /></div>
        <div>
          <Button size="small" style={{marginRight: '5px'}} onClick={this.props.onClose}>关闭</Button>
          <Button size='small' type='primary' onClick={this.onSearch.bind(null, this.props.type)}>搜索</Button>
        </div>
      </div>);
  };

  InputCreator = () => {
    const props = {
      size: 'small',
      value: this.state.value,
      onChange: this.onChange,
      onPressEnter: this.onSearch,
      ref: (e) => this.input = e
    };
    return (
      <div className={s.root}>
        <Input {...props} />
        <Button onClick={this.onSearch} size='small' type='primary'>搜索</Button>
      </div>
    );
  }

  render() {
    return this.props.isDateFilterByStartAndEnd ? this.DateInputCreator() : this.InputCreator();
  }
}

export default withStyles(s)(FilterDropDown);
