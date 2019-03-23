import React from 'react';
import LoadSetting from './LoadSetting';

export default {
  path: '/login/load_setting',

  async action() {
    return {
      component: <LoadSetting />
    };
  }
};
