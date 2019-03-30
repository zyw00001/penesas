import React from 'react';
import {Modal} from 'antd';

class SettingDialog extends React.Component {
  modalProps = () => {
    return {
      visible: true,
      title: '备注'
    }
  };

  render() {
    return (
      <Modal {...this.modalProps()}>
      </Modal>
    );
  }
}

export default SettingDialog;
