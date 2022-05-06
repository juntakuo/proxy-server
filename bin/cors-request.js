"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORSRequest = void 0;
const client_1 = require("./client");
class CORSRequest extends client_1.Client {
    constructor(req, res) {
        super(req, res);
        if (!this.accessOriginHeader) {
            this.respond(400, {}, 'Origin required for pre-flight request');
            return;
        }
        const allowedHeaders = req.headers['access-control-request-headers'];
        const headers = Object.assign({ 'Access-Control-Allow-Methods': 'POST' }, this.accessOriginHeader);
        if (allowedHeaders) {
            headers['Access-Control-Allow-Headers'] = allowedHeaders;
        }
        this.respond(206, headers, '{"error": "Not Found"}');
    }
}
exports.CORSRequest = CORSRequest;
