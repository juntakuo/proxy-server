"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeRequest = void 0;
const client_1 = require("./client");
const assets_1 = require("./assets");
class ReadmeRequest extends client_1.Client {
    constructor(req, res) {
        super(req, res);
        this.send();
    }
    send() {
        if (!assets_1.assets.readme) {
            setTimeout(() => this.send(), 100);
            return;
        }
        this.respond(200, { 'Content-Length': Buffer.byteLength(assets_1.assets.readme, 'utf8'), 'Content-Type': 'text/html' }, assets_1.assets.readme);
    }
}
exports.ReadmeRequest = ReadmeRequest;
