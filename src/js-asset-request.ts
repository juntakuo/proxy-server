import http from 'http';
import { Client } from './client';
import { assets } from './assets';

export class JSAssetRequest extends Client {
  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    super(req, res);
    this.send();
  }

  protected send(): void {
    if (!assets.js) {
      setTimeout(() => this.send(), 100);
      return;
    }
    const js = this.hostUpdatedSource(assets.js);
    if (js) {
      this.respond(200, { 'Content-Length': Buffer.byteLength(js, 'utf8'), 'Content-Type': 'text/javascript' }, js);
    }
  }
}
