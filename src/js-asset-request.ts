import http from 'http';
import { Client } from './client';
import { assets } from './assets';

const replaceRx = /((http:\/\/((192\.168\.[0-9]{1,3}\.[0-9]{1,3})|localhost):[0-9]{1,4})|LOCAL_SERVER_URL)\/r/g;

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
    const host = this.req.headers['host'];
    if (!host) {
      this.respond(500, { 'Content-Type': 'text/html' }, '500 - Server error (missing hostname)')
      return;
    }
    console.log('hostname:', host);
    const js = assets.js.replace(replaceRx, host);
    this.respond(200, { 'Content-Length': Buffer.byteLength(js, 'utf8'), 'Content-Type': 'text/javascript' }, js);
  }
}
