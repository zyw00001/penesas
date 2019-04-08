import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import {Modal, InputNumber} from 'antd';
import s from './SettingDialog.less';

const ITEMS = [
  {key: 'key1', title: '气纹'},
  {key: 'key2', title: '发亮'},
  {key: 'key3', title: '打油'},
  {key: 'key4', title: '拖伤'},
  {key: 'key5', title: '白化'},
  {key: 'key6', title: '孔小'},
  {key: 'key7', title: '组立'},
  {key: 'key8', title: '其他'}
];

class SettingDialog extends React.Component {
  state = {visible: true};

  total = () => {
    return ITEMS.reduce((sum, item) => {
      return sum + (this.state[item.key] || 0);
    }, 0);
  };

  modalProps = () => {
    return {
      className: s.root,
      visible: this.state.visible,
      title: '备注',
      maskClosable: false,
      onCancel: () => this.setState({visible: false}),
      onOk: () => this.setState({visible: false, ok: true}),
      afterClose: () => this.props.afterClose(this.state.ok ? this.total() : null)
    }
  };

  numberProps = (item) => {
    return {
      min: 0,
      value: this.state[item.key] || (this.state[item.key] === 0 ? 0 : ''),
      onChange: value => this.setState({[item.key]: value})
    };
  };

  renderItem = (item) => {
    return (
      <div key={item.key}>
        <div>{`${item.title}:`}</div>
        <div><InputNumber {...this.numberProps(item)} /></div>
      </div>
    );
  };

  render() {
    return (
      <Modal {...this.modalProps()}>
        {ITEMS.map(this.renderItem)}
      </Modal>
    );
  }
}

export default withStyles(s)(SettingDialog);
