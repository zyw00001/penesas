import express from 'express';
import single from './single';
import all from './all';

const api = express.Router();
api.use('/single', single);
api.use('/all', all);
api.use('*', (req, res) => {res.send({returnCode: 404, returnMsg: '接口不存在'})});
export default api;
