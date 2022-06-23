import 'dotenv/config';
import Jimp from 'jimp';
import { httpServer } from './http_server/server';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = process.env.HTTP_PORT || 3000;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});
