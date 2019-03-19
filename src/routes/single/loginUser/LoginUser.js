import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './LoginUser.less';
import TabPage from '../login/TabPage';
import {Input, Button} from 'antd';
import execWithLoading from '../../../common/execWithLoading';
import helper from '../../../common';
import {setUser} from '../main/MainBoardContainer';
import {jump} from '../../../components/Link';

const URL_LOGIN = '/api/single/login/user';

class LoginUser extends React.Component {
  state = {value: '', error: '', time: 0, login: false};

  onBlur = () => {
    if (!this.state.value) {
      if (this.state.error) {
        this.setState({error: ''});
      }
    } else if (this.state.value.length !== 8) {
      this.setState({error: '请输入8位员工编码'});
    } else {
      execWithLoading(async () => {
        const option = helper.postOption({user: this.state.value});
        const json = await helper.fetchJson(URL_LOGIN, option);
        if (json.returnCode !== 0) {
          this.setState({error: json.returnMsg});
        } else {
          setUser(json.result);
          this.setState({time: 3, login: true});
          const id = setInterval(() => {
            const time = this.state.time - 1;
            if (time < 0) {
              clearInterval(id);
              jump('/');
            } else {
              this.setState({time});
            }
          }, 1000);
        }
      });
    }
  };

  onFocus = () => {
    if (this.state.error) {
      this.setState({error: ''});
    }
  };

  inputProps = () => {
    return {
      value: this.state.value,
      placeholder: '限定输入8位',
      onChange: e => this.setState({value: e.target.value}),
      onBlur: this.onBlur,
      onFocus: this.onFocus
    };
  };

  render() {
    const time = this.state.login ? `(${this.state.time}秒后自动返回主面板)` : '';
    return (
      <TabPage className={s.root} active='user'>
        <div>作业上岗</div>
        <div>
          <div>员工编号</div>
          <div data-error={this.state.error}>
            <Input {...this.inputProps()} />
          </div>
          <div>
            <Button type='primary'>{`在岗${time}`}</Button>
          </div>
        </div>
      </TabPage>
    );
  }
}

export default withStyles(s)(LoginUser);
