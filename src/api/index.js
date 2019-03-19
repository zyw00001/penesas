import express from 'express';
import single from './single';

const api = express.Router();
api.use('/single', single);
api.use('*', (req, res) => {res.send({returnCode: 404, returnMsg: '接口不存在'})});
export default api;
