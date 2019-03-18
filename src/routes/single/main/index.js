import React from 'react';
import MainBoardContainer from './MainBoardContainer';

export default {
  path: '/',

  async action() {
    return {
      component: <MainBoardContainer/>
    };
  }
};
