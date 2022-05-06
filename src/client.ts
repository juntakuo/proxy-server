import http from 'http';

export class Client {
  protected static readonly hostReplaceRx = /(((http:\/\/((192\.168\.[0-9]{1,3}\.[0-9]{1,3})|localhost):[0-9]{1,4})|LOCAL_SERVER_URL))|\{*\**HOST_URL_GOES_HERE\**\}*/g;

  constructor(protected readonly req: http.IncomingMessage, protected readonly res: http.ServerResponse) {
    console.log('req', req.method, req.url);
  }

  get accessOriginHeader(): http.OutgoingHttpHeaders {
    const origin = this.req.headers['origin'];
    if (!origin) {
      return {};
    }
    return { 'Access-Control-Allow-Origin': origin };
  }

  respond(statusCode: number, headers: http.OutgoingHttpHeaders | http.OutgoingHttpHeader[] | undefined, body?: string): void {
    this.res.writeHead(statusCode, headers);
    console.log('res', statusCode, headers);
    if (!body) {
      this.res.end();
    } else {
      this.res.end(body);
    }
  }

  respondJSON(msg: any): void {
    this.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(msg));
  }

  protected hostUpdatedSource(src: string, addedPath = ''): string | undefined {
    const host = this.req.headers['host'];
    if (!host) {
      this.respond(500, { 'Content-Type': 'text/html' }, '500 - Server error (missing hostname)')
      return;
    }
    return src.replace(Client.hostReplaceRx, `https://${host}${addedPath}`);
  }
}
