import React from 'react';
import MainBoardContainer from './MainBoardContainer';

export default {
  path: '/all',

  async action() {
    return {
      component: <MainBoardContainer />,
      all: true
    };
  }
};
