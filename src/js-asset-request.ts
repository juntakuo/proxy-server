import http from 'http';
import { Client } from './client';
import { jsAsset } from './js-asset';

export class JSAssetRequest extends Client {
  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    super(req, res);
    this.send();
  }

  protected send(): void {
    if (!jsAsset.js) {
      setTimeout(() => this.send(), 100);
      return;
    }
    this.respond(200, { 'Content-Length': Buffer.byteLength(jsAsset.js, 'utf8'), 'Content-Type': 'text/javascript' }, jsAsset.js);
  }
}
