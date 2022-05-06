import http from 'http';
import https from 'https';
import { Client } from './client';
import { config } from './config';

interface RelayRequestSchema {
  p?: string,
  m?: string,
  b?: string
}

export class RelayRequest extends Client {
  protected static url = new URL(config.pixelUrl);

  protected relayReq?: http.ClientRequest;

  constructor(req: http.IncomingMessage, res: http.ServerResponse, protected readonly rawBody: string) {
    super(req, res);
    let jsonBody: RelayRequestSchema = {};
    try {
      jsonBody = JSON.parse(rawBody);
    } catch (e) {
      this.respond(400, { 'Content-Type': 'application/json' }, '{"error": "Invalid request body"}');
      return;
    }
    const pathname = (typeof jsonBody.p === 'string' && jsonBody.p ? jsonBody.p : RelayRequest.url.pathname);
    const method = (typeof jsonBody.m === 'string' && jsonBody.m ? jsonBody.m : 'POST');
    this.relay(method, pathname, jsonBody.b);
  }

  protected relay(method: string, path: string, relayBody?: {}): void {
    const protocol = RelayRequest.url.protocol;
    const hostname = RelayRequest.url.hostname;
    const port = RelayRequest.url.port || (protocol === 'https:' ? 443 : 80);
    console.log(`[relay] ${method} ${protocol}//${hostname}:${port}${path}`);
    this.relayReq = (protocol === 'https:' ? https : http).request({ hostname, port, path, method }, (res) => this.relayResponse(res));
    this.relayReq.on('error', (err) => {
      console.error('[relay] error:', err);
      this.respond(500, { 'Content-Type': 'application/json' }, '{"error": "Server error"}');
    });
    if (relayBody) {
      if (typeof relayBody !== 'string') {
        const msg = {...relayBody, headers: this.req.headers, reqIp: this.req.socket.remoteAddress};
        console.log('[relay msg]', msg);
        relayBody = JSON.stringify(msg);
      }
      this.relayReq.write(relayBody);
    }
    this.relayReq.end();
  };

  protected relayResponse(res: http.IncomingMessage): void {
    console.log(`[relay response] ${res.statusCode}`);
    let data = '';
    res.on('data', d => {
      data += String(d);
    });
    res.on('error', (e) => {
      console.log('[relay response] ERROR:', e);
      this.respond(500, { 'Content-Type': 'application/json' }, '{"error": "Server error"}');
    });
    res.on('end', () => {
      console.log(`[relay response] ${res.statusCode} body: ${data}`);
      this.respond(200, {
        'Content-Type': 'application/json',
        ...this.accessOriginHeader
    }, data);
    });
  }
}
