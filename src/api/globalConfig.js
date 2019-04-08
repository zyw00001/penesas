import fs from 'fs';
import path from 'path';

const readConfig = () => {
  try {
    const filePath = path.join(__dirname, './config.json');
    console.log(filePath);
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};

// node转发请求所用的地址
const config = readConfig();
const hostname = config.ip || '10.0.0.71';
const port = config.port || '8087';
const host = `http://${hostname}:${port}`;

export {
  host,
  hostname,
  port
};
