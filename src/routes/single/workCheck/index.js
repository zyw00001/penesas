import React from 'react';
import WorkCheck from './WorkCheck';

export default {
  path: '/login/work_check',

  async action() {
    return {
      component: <WorkCheck />
    };
  }
};
