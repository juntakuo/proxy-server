import { readFile } from 'fs';
import http2 from 'http2';
import { config } from '../config';

class JSAsset {
  protected cache?: string;

  constructor() {
    this.load();
  }

  get js(): string {
    return this.cache || '';
  }

  load(): void {
    const protocol = config.js.split('://')[0];
    if (protocol === 'http' || protocol === 'https') {
      this.loadHTTP();
    } else {
      this.loadFile();
    }
  }

  private loadFile(): void {
    console.log('[asset] loading file:', config.js);
    readFile(config.js, 'utf8', (err, data) => this.store(err ? '' : data));
  }

  private loadHTTP(): void {
    console.log('[asset] retrieving:', config.js);
    const url = new URL(config.js);
    console.log(`url: ${url.protocol}//${url.host}`);
    const client = http2.connect(`${url.protocol}//${url.host}`);
    client.on('error', (err) =>  {
      console.error(err);
      this.logFail(`client error: ${config.js}`);
    });
    console.log(`path: ${url.pathname}`);
    const req = client.request({ ':path': url.pathname });
    req.on('response', () => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        this.store(data);
        client.close();
      });
    });
    req.setEncoding('utf8');
    req.end();
  }

  private logFail(msg: string): void {
    console.error('[asset] ERROR:', msg);
    if (!this.cache) {
      process.exit(1);
    }
}

  private store(data: string): void {
    if (!data) {
      console.error(`[asset] ERROR: loading ${config.js}`);
      if (!this.cache) {
        process.exit(1);
      }
    } else {
      this.cache = data;
      console.log(`[asset] cached ${Buffer.byteLength(data, 'utf8')} bytes`);
    }
  }
}

export const jsAsset = new JSAsset();
