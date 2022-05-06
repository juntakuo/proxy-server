"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSAssetRequest = void 0;
const client_1 = require("./client");
const assets_1 = require("./assets");
const replaceRx = /((http:\/\/((192\.168\.[0-9]{1,3}\.[0-9]{1,3})|localhost):[0-9]{1,4})|LOCAL_SERVER_URL)\/r/g;
class JSAssetRequest extends client_1.Client {
    constructor(req, res) {
        super(req, res);
        this.send();
    }
    send() {
        if (!assets_1.assets.js) {
            setTimeout(() => this.send(), 100);
            return;
        }
        const host = this.req.headers['host'];
        if (!host) {
            this.respond(500, { 'Content-Type': 'text/html' }, '500 - Server error (missing hostname)');
            return;
        }
        console.log('hostname:', host);
        const js = assets_1.assets.js.replace(replaceRx, host);
        this.respond(200, { 'Content-Length': Buffer.byteLength(js, 'utf8'), 'Content-Type': 'text/javascript' }, js);
    }
}
exports.JSAssetRequest = JSAssetRequest;
