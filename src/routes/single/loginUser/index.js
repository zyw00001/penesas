import React from 'react';
import LoginUser from './LoginUser';

export default {
  path: '/login/user',

  async action() {
    return {
      component: <LoginUser />
    };
  }
};
