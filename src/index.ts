import 'dotenv/config';
import Jimp from 'jimp';
import { httpServer } from './http_server/server';
import robot from 'robotjs';
import { WebSocketServer, createWebSocketStream, WebSocket } from 'ws';
import { drawCircle } from './http_server/helpers/drawCircle';
import { drawRectangle } from './http_server/helpers/drawRectangle';
import { drawSquare } from './http_server/helpers/drawSquare';

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
    if (command === 'mouse_position') {
      console.log(`Recieved: mouse_position ${mouse.x},${mouse.y}`);
    } else {
      console.log(`Recieved: ${command} ${parameters.join(' ')}`);
    }
    switch (command) {
      case 'mouse_position':
        duplex.write(`mouse_position ${mouse.x},${mouse.y}\0`);
        break;
      case 'mouse_up':
        duplex.write(`${command}`);
        robot.moveMouseSmooth(mouse.x, mouse.y - parameters[0]);
        break;
      case 'mouse_down':
        duplex.write(`${command}`);
        robot.moveMouseSmooth(mouse.x, mouse.y + parameters[0]);
        break;
      case 'mouse_left':
        duplex.write(`${command}`);
        robot.moveMouseSmooth(mouse.x - parameters[0], mouse.y);
        break;
      case 'mouse_right':
        duplex.write(`${command}`);
        robot.moveMouseSmooth(mouse.x + parameters[0], mouse.y);
        break;
      case 'draw_circle':
        duplex.write(`${command}`);
        drawCircle(parameters[0], mouse);
        break;
      case 'draw_rectangle':
        duplex.write(`${command}`);
        drawRectangle(mouse, parameters[0], parameters[1]);
        break;
      case 'draw_square':
        duplex.write(`${command}`);
        drawSquare(mouse, parameters[0]);
        break;
      default:
        break;
    }
  });
});

webSocketServer.on('close', () => {
  console.log('Closed');
});
