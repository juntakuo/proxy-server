import http from 'http';
import { Client } from './client';

export class NotFound extends Client {
  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    super(req, res);
    this.respond(404, { 'Content-Type': 'application/json' }, '{"error": "Not Found"}');
  }
}
