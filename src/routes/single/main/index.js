import React from 'react';
import MainBoard from './MainBoard';

export default {
  path: '/',

  async action() {
    return {
      component: <MainBoard/>
    };
  }
};
