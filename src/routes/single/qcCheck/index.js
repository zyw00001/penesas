import React from 'react';
import WorkCheck from '../workCheck/WorkCheck';

export default {
  path: '/login/qc_check',

  async action() {
    return {
      component: <WorkCheck isQC />
    };
  }
};
