import WebSocket from 'ws';
import cookie from 'cookie';
const WebSocketServer = WebSocket.Server;

// 发送数据
const _sendData = (ws, head, error, bodyOrMessage) => {
  const data = head;
  if (error) {
    data.status = 'error';
    data.message = bodyOrMessage;
  } else {
    data.status = 'success';
    data.body = bodyOrMessage;
  }
  ws.send(JSON.stringify(data));
};

// 发送应答消息
const _sendReply = (ws, type, error, bodyOrMessage) => {
  if (ws.readyState === WebSocket.OPEN) {
    _sendData(ws, {type: 'reply', reply: type}, error, bodyOrMessage);
  }
};

// 发送通知消息
const _sendNotify = (ws, type, error, bodyOrMessage) => {
  if (ws.readyState === WebSocket.OPEN) {
    _sendData(ws, {type: 'notify', notify: type}, error, bodyOrMessage);
  }
};

// 发送普通消息
const _sendMessage = (ws, type, error, bodyOrMessage) => {
  if (ws.readyState === WebSocket.OPEN) {
    _sendData(ws, {type}, error, bodyOrMessage);
  }
};

class WsServer {
  constructor(server) {
    this._handlers = [];
    this._connect = null;
    this._wss = new WebSocketServer({server});
    this._wss.on('connection', this._onConnection.bind(this));
  }

  _onConnection(ws, req) {
    try {
      console.log(`test-cookie === ${req.headers.cookie}`);
      req.cookies = cookie.parse(req.headers.cookie);
      console.log(`${req.cookies.username}(token:${req.cookies.token}) connection`, this._wss.clients.size);
      ws.username = req.cookies.username;
      ws.token = req.cookies.token;
      ws.on('message', this._onMessage.bind(this, ws, req));
      if (this._connect) {
        this._connect(ws, req);
      }
    } catch (e) {
      console.log(e);
    }
  }

  _onMessage(ws, req, data) {
    data = JSON.parse(data);
    for (const {type, callback} of this._handlers) {
      if (Array.isArray(type)) {
        if (type.includes(data.type)) {
          callback(ws, req, data);
        }
      } else if (type === data.type) {
        callback(ws, req, data);
      }
    }
  }

  onConnect(callback) {
    this._connect = callback;
  }

  onMessage(type, callback) {
    if (type && typeof callback === 'function') {
      this._handlers.push({type, callback});
    }
    return this;
  }

  sendNotifyToUserName(username, type, body) {
    const clients = this._wss.clients;
    for (const ws of clients) {
      if (ws.username === username) {
        _sendNotify(ws, type, false, body);
      }
    }
  }

  static sendReply(ws, type, body) {
    _sendReply(ws, type, false, body);
  }

  static sendReplyError(ws, type, message) {
    _sendReply(ws, type, true, message);
  }

  static sendNotify(ws, type, body) {
    _sendNotify(ws, type, false, body);
  }

  static sendNotifyError(ws, type, message) {
    _sendNotify(ws, type, true, message);
  }

  static sendMessage(ws, type, body) {
    _sendMessage(ws, type, false, body);
  }

  static sendMessageError(ws, type, message) {
    _sendMessage(ws, type, true, message);
  }

  static createServer(httpServer) {
    global.wsServer = new WsServer(httpServer);
    return global.wsServer;
  }

  static getServer() {
    return global.wsServer;
  }
}

export default WsServer;
