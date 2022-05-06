import { readFile } from 'fs';
import http2 from 'http2';
import { config } from './config';

class Assets {
  protected readonly cache: {js?: string; readme?: string} = {};

  constructor() {
    this.load();
  }

  get js(): string {
    return this.cache.js || '';
  }

  get readme(): string {
    return this.cache.readme || '';
  }

  load(): void {
    const protocol = config.js.split('://')[0];
    if (protocol === 'http' || protocol === 'https') {
      this.loadJSRemote();
    } else {
      this.loadJSLocal();
    }
    this.loadReadme();
  }

  private loadJSLocal(): void {
    console.log('[asset] loading JS file:', config.js);
    readFile(config.js, 'utf8', (err, data) => this.store(err ? '' : data, 'js'));
  }

  private loadJSRemote(): void {
    console.log('[asset] retrieving JS file:', config.js);
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
        this.store(data, 'js');
        client.close();
      });
    });
    req.setEncoding('utf8');
    req.end();
  }

  private loadReadme(): void {
    console.log('[asset] loading readme file:', config.readme);
    readFile(config.readme, 'utf8', (err, data) => this.store(err ? '' : data, 'readme'));
  }

  private logFail(msg: string): void {
    console.error('[asset] ERROR:', msg);
    if (!this.cache) {
      process.exit(1);
    }
  }

  private store(data: string, target: keyof Assets['cache']): void {
    if (!data) {
      console.error(`[asset] ERROR: loading ${target}`);
      if (!this.cache) {
        process.exit(1);
      }
    } else {
      this.cache[target] = data;
      console.log(`[asset] ${target} cached ${Buffer.byteLength(data, 'utf8')} bytes`);
    }
  }
}

export const assets = new Assets();
