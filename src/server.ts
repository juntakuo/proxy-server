import http from 'http';

import { JSAssetRequest } from './js-asset-request';
import { config } from '../config';
import { CORSRequest } from './cors-request';
import { NotFound } from './not-found';
import { RelayRequest } from './relay-request';

export class Server {
  protected server: http.Server | undefined;

  constructor() {
    // TODO add support for HTTPS
    this.server = http.createServer((req, res) => this.incoming(req, res));
    this.server.listen(config.serverPort, config.serverHost, () => {
      console.log(`[server] listening on ${config.serverHost}:${config.serverPort}`);
    });
    this.server.on('error', (err) => {
      console.error(`[server] ERROR`, err);
    });
  }

  private incoming(req: http.IncomingMessage, res: http.ServerResponse): void {
    let body = '';
    req.on('data', (chunk) => {
      body += String(chunk);
    });
    req.on('end', () => {
      this.route(req, res, body);
    });
  }

  private route(req: http.IncomingMessage, res: http.ServerResponse, body: string = ''): void {
    const urlParts = String(req.url).split('/');
    const rootPath = (urlParts[1] || '').split('?')[0];
    if (req.method === 'GET' && (rootPath === 'scevent.min.js' || rootPath === 's.js') && urlParts.length === 2) {
      new JSAssetRequest(req, res);
      return;
    }
    if (req.method === 'OPTIONS' && rootPath === 'r' && urlParts.length === 2) {
      new CORSRequest(req, res);
      return;
    }
    if (req.method === 'POST' && rootPath === 'r' && urlParts.length === 2) {
      new RelayRequest(req, res, body);
      return;
    }
    new NotFound(req, res);
  }
}

