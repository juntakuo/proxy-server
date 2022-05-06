import http from 'http';
import { Client } from './client';
import { assets } from './assets';

export class ReadmeRequest extends Client {
  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    super(req, res);
    this.send();
  }

  protected send(): void {
    if (!assets.readme) {
      setTimeout(() => this.send(), 100);
      return;
    }
    const readme = this.hostUpdatedSource(assets.readme);
    if (readme) {
      this.respond(200, { 'Content-Length': Buffer.byteLength(readme, 'utf8'), 'Content-Type': 'text/html' }, readme);
    }
  }
}
