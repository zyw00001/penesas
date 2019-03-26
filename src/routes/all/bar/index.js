import React from 'react';
import Bar from './Bar';

export default {
  path: '/all/bar',

  async action() {
    return {
      component: <Bar />,
      all: true
    };
  }
};
