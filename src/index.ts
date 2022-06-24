import 'dotenv/config';
import Jimp from 'jimp';
import { httpServer } from './http_server/server';
import robot from 'robotjs';
import { WebSocketServer, createWebSocketStream, WebSocket } from 'ws';

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WSS_PORT: number = Number(process.env.WSS_PORT) || 8080;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});

const webSocketServer = new WebSocketServer({
  port: WSS_PORT,
});

webSocketServer.on('connection', (ws: WebSocket) => {
  const duplex = createWebSocketStream(ws, { decodeStrings: false, encoding: 'utf8' });
  duplex.on('data', (data) => {
    const dataArr = data.split(' ').filter((el: string) => el.trim());
    const command = dataArr[0];
    const parameters: Array<number> = dataArr.slice(1).map(parseFloat);
    const mouse = robot.getMousePos();
    console.log(`${command} ${parameters}`);
    switch (command) {
      case 'mouse_up':
        robot.moveMouseSmooth(mouse.x, mouse.y - parameters[0]);
        duplex.write(`${command}`);
        break;
      case 'mouse_down':
        robot.moveMouseSmooth(mouse.x, mouse.y + parameters[0]);
        duplex.write(`${command}`);
        break;
      case 'mouse_left':
        robot.moveMouseSmooth(mouse.x - parameters[0], mouse.y);
        duplex.write(`${command}`);
        break;
      case 'mouse_right':
        robot.moveMouseSmooth(mouse.x + parameters[0], mouse.y);
        duplex.write(`${command}`);
        break;
      default:
        break;
    }
  });
});

webSocketServer.on('close', () => {
  console.log('Closed');
});
