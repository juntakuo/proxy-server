"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSAssetRequest = void 0;
const client_1 = require("./client");
const assets_1 = require("./assets");
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
        const js = this.hostUpdatedSource(assets_1.assets.js);
        if (js) {
            this.respond(200, { 'Content-Length': Buffer.byteLength(js, 'utf8'), 'Content-Type': 'text/javascript' }, js);
        }
    }
}
exports.JSAssetRequest = JSAssetRequest;
