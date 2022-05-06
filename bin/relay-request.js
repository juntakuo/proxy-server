"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayRequest = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const client_1 = require("./client");
const config_1 = require("./config");
class RelayRequest extends client_1.Client {
    constructor(req, res, rawBody) {
        super(req, res);
        this.rawBody = rawBody;
        let jsonBody = {};
        try {
            jsonBody = JSON.parse(rawBody);
        }
        catch (e) {
            this.respond(400, { 'Content-Type': 'application/json' }, '{"error": "Invalid request body"}');
            return;
        }
        const pathname = (typeof jsonBody.p === 'string' && jsonBody.p ? jsonBody.p : RelayRequest.url.pathname);
        const method = (typeof jsonBody.m === 'string' && jsonBody.m ? jsonBody.m : 'POST');
        this.relay(method, pathname, jsonBody.b);
    }
    relay(method, path, relayBody) {
        const protocol = RelayRequest.url.protocol;
        const hostname = RelayRequest.url.hostname;
        const port = RelayRequest.url.port || (protocol === 'https:' ? 443 : 80);
        console.log(`[relay] ${method} ${protocol}//${hostname}:${port}${path}`);
        this.relayReq = (protocol === 'https:' ? https_1.default : http_1.default).request({ hostname, port, path, method }, (res) => this.relayResponse(res));
        this.relayReq.on('error', (err) => {
            console.error('[relay] error:', err);
            this.respond(500, { 'Content-Type': 'application/json' }, '{"error": "Server error"}');
        });
        if (relayBody) {
            if (typeof relayBody !== 'string') {
                const msg = Object.assign(Object.assign({}, relayBody), { headers: this.req.headers, reqIp: this.req.socket.remoteAddress });
                console.log('[relay msg]', msg);
                relayBody = JSON.stringify(msg);
            }
            this.relayReq.write(relayBody);
        }
        this.relayReq.end();
    }
    ;
    relayResponse(res) {
        console.log(`[relay response] ${res.statusCode}`);
        let data = '';
        res.on('data', d => {
            data += String(d);
        });
        res.on('error', (e) => {
            console.log('[relay response] ERROR:', e);
            this.respond(500, { 'Content-Type': 'application/json' }, '{"error": "Server error"}');
        });
        res.on('end', () => {
            console.log(`[relay response] ${res.statusCode} body: ${data}`);
            this.respond(200, Object.assign({ 'Content-Type': 'application/json' }, this.accessOriginHeader), data);
        });
    }
}
exports.RelayRequest = RelayRequest;
RelayRequest.url = new URL(config_1.config.pixelUrl);
