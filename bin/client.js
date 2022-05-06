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
    hostUpdatedSource(src) {
        const host = this.req.headers['host'];
        if (!host) {
            this.respond(500, { 'Content-Type': 'text/html' }, '500 - Server error (missing hostname)');
            return;
        }
        return src.replace(Client.hostReplaceRx, 'https://' + host);
    }
}
exports.Client = Client;
Client.hostReplaceRx = /(((http:\/\/((192\.168\.[0-9]{1,3}\.[0-9]{1,3})|localhost):[0-9]{1,4})|LOCAL_SERVER_URL)\/r)|\{*\**HOST_URL_GOES_HERE\**\}*/g;
