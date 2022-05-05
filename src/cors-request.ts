import http from 'http';
import { Client } from './client';

export class CORSRequest extends Client {
  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    super(req, res);
    if (!this.accessOriginHeader) {
      this.respond(400, {}, 'Origin required for pre-flight request');
      return;
    }
    const allowedHeaders = req.headers['access-control-request-headers'];
    const headers: http.OutgoingHttpHeaders = {
      'Access-Control-Allow-Methods': 'POST',
      ...this.accessOriginHeader
    };
    if (allowedHeaders) {
      headers['Access-Control-Allow-Headers'] = allowedHeaders;
    }
    this.respond(206, headers, '{"error": "Not Found"}');
  }
}
