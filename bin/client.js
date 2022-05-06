"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
class Client {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        console.log('req', req.method, req.url);
    }
    get accessOriginHeader() {
        const origin = this.req.headers['origin'];
        if (!origin) {
            return {};
        }
        return { 'Access-Control-Allow-Origin': origin };
    }
    respond(statusCode, headers, body) {
        this.res.writeHead(statusCode, headers);
        console.log('res', statusCode, headers);
        if (!body) {
            this.res.end();
        }
        else {
            this.res.end(body);
        }
    }
    respondJSON(msg) {
        this.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(msg));
    }
}
exports.Client = Client;
