import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './LoginUser.less';
import TabPage from '../login/TabPage';
import {Input, Button} from 'antd';
import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {refresh} from '../main/MainBoardContainer';
import {jump} from '../../../components/Link';

const URL_LOGIN = '/api/single/login/user';

class LoginUser extends React.Component {
  state = {value: '', error: '', login: false};

  onLogin = () => {
    execWithLoading(async () => {
      const option = helper.postOption({user: this.state.value});
      const json = await helper.fetchJson(URL_LOGIN, option);
      if (json.returnCode !== 0) {
        this.setState({error: json.returnMsg});
      } else {
        refresh(json.result);
        jump('/');
      }
    });
  };

  onBlur = () => {
    const length = this.state.value.length;
    if (!length) {
      this.setState({error: '请输入员工编码'});
    } else if (length !== 8) {
      this.setState({error: '请输入8位员工编码'});
    } else {
      if (this.state.error) {
        this.setState({error: ''});
      }
    }
  };

  onFocus = () => {
    if (this.state.error) {
      this.setState({error: ''});
    }
  };

  onChange = (e) => {
    if (e.target.value.length <= 8) {
      this.setState({value: e.target.value});
    }
  };

  inputProps = () => {
    return {
      value: this.state.value,
      placeholder: '限定输入8位',
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    };
  };

  render() {
    return (
      <TabPage className={s.root} active='user'>
        <div>作业上岗</div>
        <div>
          <div>员工编号</div>
          <div data-error={this.state.error}>
            <Input {...this.inputProps()} />
          </div>
          <div>
            <Button type='primary' disabled={this.state.value.length !== 8} onClick={this.onLogin}>
              在岗
            </Button>
          </div>
        </div>
      </TabPage>
    );
  }
}

export default withStyles(s)(LoginUser);
