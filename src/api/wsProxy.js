import WsServer from '../standard-business/wsServer';
import {host} from './gloablConfig';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class WebSocketProxy {
  constructor() {
    this.sockets = {};
    this.stomps = {};
  }

  sendMessageToBrowser(token, message) {
    const sockets = this.sockets[token] || [];
    for (const ws of sockets) {
      WsServer.sendMessage(ws, 'global', message);
    }
  }

  stompDisconnect(token) {
    const sockets = this.sockets[token] || [];
    this.stomps[token] = null;
    this.sockets[token] = null;
    for (const ws of sockets) {
      ws.close();
    }
  }

  createStompClient(token) {
    const path = `${host}/epld-websocket`;
    const sock = new SockJS(path, null, {'transports': ['websocket']});
    const stompClient = Stomp.over(sock);
    this.stomps[token] = stompClient;

    const onConnect = () => {
      console.log('stomp connect 成功');
      stompClient.subscribe('/user/queue/notifications', ({body}) => {
        try {
          const data = JSON.parse(body);
          data.senderInfo = JSON.parse(data.senderInfo);
          this.sendMessageToBrowser(token, data);
        } catch (e) {
          console.log(e);
        }
      });
    };

    const onError = (error) => {
      console.log(error);
      this.stompDisconnect(token);
    };

    stompClient.connect({token}, onConnect, onError);
  }

  webSocketClosed(ws) {
    const token = ws.token;
    const sockets = this.sockets[token];
    if (sockets) {
      this.sockets[token] = sockets.filter(socket => socket !== ws);
      if (!this.sockets[token].length) {
        this.sockets[token] = null;
        if (this.stomps[token]) {
          try {
            this.stomps[token].disconnect();
          } catch (e) {
            console.log('webSocketClosed 捕获异常');
            this.stomps[token] = null;
          }
        }
      }
    }
  }

  addWebSocket(ws) {
    const token = ws.token;
    if (token) {
      if (this.sockets[token]) {
        this.sockets[token].push(ws);
      } else {
        this.sockets[token] = [];
        this.sockets[token].push(ws);
        this.createStompClient(token);
      }

      ws.on('close', () => {
        console.log(`${ws.username}(token:${ws.token}) disconnection`);
        this.webSocketClosed(ws);
      });
    }
  }
}

export default WebSocketProxy;
