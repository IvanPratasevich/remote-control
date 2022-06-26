import * as path from 'path';
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { createReadStream } from 'node:fs';

export const httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  let data = '';
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  const readStream = createReadStream(file_path, { flags: 'r', encoding: 'utf8' });
  return new Promise((resolve) => {
    readStream.on('data', (chunk: string | Buffer) => {
      data += chunk;
    });
    readStream.on('end', () => {
      res.writeHead(200);
      resolve(res.end(data));
    });
    readStream.on('error', (error) => {
      res.writeHead(404);
      resolve(res.end(JSON.stringify(error)));
    });
  });
});
