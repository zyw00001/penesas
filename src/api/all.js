import express from 'express';
import {host} from './globalConfig';
import helper from '../common';

const api = express.Router();

api.get('/', async (req, res) => {
  const url = `${host}/main_panel_chart/showMainPanelChart`;
  res.send(await helper.fetchJsonByNode(req, url));
});

export default api;
