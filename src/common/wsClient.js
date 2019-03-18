
const REPLY_TYPE = 'reply';
const NOTIFY_TYPE = 'notify';
const RETRY_DURATION = 30;

const trigger = (handlers, dataType, data) => {
  for (const {type, callback} of handlers) {
    if (Array.isArray(type)) {
      if (type.includes(dataType)) {
        callback(data);
      }
    } else if (type === dataType) {
      callback(data);
    }
  }
};

class WsClient {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      // 在线环境中不存在代理
      this._port = location.port;
    } else {
      // 开发环境中，因为browser-sync为http进行了端口代理而没有为WebSocket进行代理，所以WebSocket必须连原始端口
      this._port = require('../config').port;
    }
    this._buffer = [];
    this._reply = [];
    this._notify = [];
    this._message = [];
    this._connected = false;
    this._opening = false;
    this.connect();
  }

  _onOpen() {
    this._connected = true;
    this._opening = false;
    for (const content of this._buffer) {
      this._ws.send(content);
    }
    this._buffer = [];
  }

  _onClose() {
    this._opening = false;
    this._connected = false;
    for (const handler of this._reply) {
      handler.resolve({
        type: REPLY_TYPE,
        apply: handler.type,
        status: 'error',
        message: '发送数据失败'
      });
    }
    this._buffer = [];
    this._reply = [];

    // 断开后每隔RETRY_DURATION秒尝试重连
    console.log(`断开连接，${RETRY_DURATION}秒后尝试重连`);
    setTimeout(() => {
      this.connect();
    }, RETRY_DURATION * 1000);
  }

  _onMessage(event) {
    const data = JSON.parse(event.data);
    if (data.type === REPLY_TYPE) {
      const index = this._reply.findIndex(({type}) => data.reply === type);
      if (index > -1) {
        this._reply[index].resolve(data);
        this._reply.splice(index, 1);
      }
    } else if (data.type === NOTIFY_TYPE) {
      trigger(this._notify, data.notify, data);
    } else {
      trigger(this._message, data.type, data);
    }
  }

  _onError(e) {
  }

  // 连接WebSocket服务器
  connect() {
    if (!this._connected && !this._opening) {
      const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
      this._opening = true;
      this._ws = new WebSocket(`${protocol}://${location.hostname}:${this._port}`);
      this._ws.onopen = this._onOpen.bind(this);
      this._ws.onclose = this._onClose.bind(this);
      this._ws.onmessage = this._onMessage.bind(this);
      this._ws.onerror = this._onError.bind(this);
    }
  }

  // 注册接收消息的回调(除去REPLY_TYPE和NOTIFY_TYPE类型的消息)
  onMessage(type, callback) {
    if (type && typeof callback === 'function') {
      this._message.push({type, callback});
    }
    return this;
  }

  // 注册通知回调
  onNotify(type, callback) {
    if (type && typeof callback === 'function') {
      this._notify.push({type, callback});
    }

    return this;
  }

  // 发送消息
  send(type, body) {
    if (this._connected) {
      this._ws.send(JSON.stringify({type, body}));
    } else {
      this._buffer.push(JSON.stringify({type, body}));
      this.connect();
    }
  }

  // 发送消息并等待服务器应答
  sendAndReply(type, body) {
    return new Promise(resolve => {
      this._reply.push({type, resolve});
      this.send(type, body);
    });
  }
}

const getWsClient = () => {
  if (global.isServer) {
    return null;
  } else if (global.wsClient) {
    return global.wsClient;
  } else {
    global.wsClient = new WsClient();
    return global.wsClient;
  }
};

export default getWsClient;
