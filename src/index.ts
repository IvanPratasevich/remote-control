import 'dotenv/config';
import { httpServer } from './http_server/server';
import robot from 'robotjs';
import { WebSocketServer, createWebSocketStream, WebSocket } from 'ws';
import { drawCircle } from './helpers/drawCircle';
import { drawRectangle } from './helpers/drawRectangle';
import { drawSquare } from './helpers/drawSquare';
import { screenCapture } from './helpers/screenCapture';
import process from 'node:process';

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WSS_PORT: number = Number(process.env.WSS_PORT) || 8080;
const arr: any[] = [];
let isClose = false;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});

const webSocketServer = new WebSocketServer({
  port: WSS_PORT,
});

console.log(`Start WebSocket Server on the ${WSS_PORT} port!`);

webSocketServer.on('connection', (ws: WebSocket) => {
  console.log('User connected');
  const duplex = createWebSocketStream(ws, { decodeStrings: false, encoding: 'utf8' });
  duplex.on('data', async (data: string) => {
    try {
      const dataArr: string[] = data.split(' ').filter((el: string) => el.trim());
      const command: string = dataArr[0];
      const parameters: Array<number> = dataArr.slice(1).map(parseFloat);
      const mouse = robot.getMousePos();
      if (command === 'mouse_position') {
        console.log(`Recieved: mouse_position ${mouse.x},${mouse.y}`);
      } else {
        console.log(`Recieved: ${command} ${parameters.join(' ')}`);
      }
      switch (command) {
        case 'mouse_position':
          duplex.write(`mouse_position ${mouse.x},${mouse.y} \0`);
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
        case 'prnt_scrn':
          await screenCapture(mouse)
            .then((image: string) => {
              duplex.write(`prnt_scrn ${image} \0`);
            })
            .catch((error: string) => {
              throw Error(error);
            });
          break;
        default:
          break;
      }
      if (command === 'mouse_position') {
        console.log(`Result: ${command} completed successfully!`);
      } else {
        console.log(`Result: ${command} completed successfully!`);
      }
    } catch (error) {
      console.log(`Error: ${(error as Error).message}`);
    }
  });

  duplex.on('error', () => {
    console.log('Stream error');
  });

  ws.on('close', () => {
    if (!isClose) {
      console.log('User disconnected');
    }
  });
});

webSocketServer.on('error', () => {
  console.log('WebSocket error');
});

process.on('SIGINT', async () => {
  isClose = true;
  webSocketServer.clients.forEach((client: any) => {
    arr.push(
      new Promise((resolve) => {
        client.close();
        process.nextTick(() => {
          if (client.readyState == WebSocket.OPEN) {
            client.terminate();
          }
        });
        resolve('User disconnected');
      })
    );
  });

  await Promise.all(arr)
    .then((result) => {
      console.log(`${result.length} user(s) have been disconnected`);
    })
    .then(() => {
      webSocketServer.close();
      console.log('WebSocket server closed');
    })
    .then(() => {
      httpServer.close();
      console.log('Http server closed');
    });
});
