import http from 'http';

export class Client {
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
}
