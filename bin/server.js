"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const cors_request_1 = require("./cors-request");
const js_asset_request_1 = require("./js-asset-request");
const not_found_1 = require("./not-found");
const readme_request_1 = require("./readme-request");
const relay_request_1 = require("./relay-request");
class Server {
    constructor() {
        this.server = http_1.default.createServer((req, res) => this.incoming(req, res));
        this.server.listen(config_1.config.serverPort, config_1.config.serverHost, () => {
            console.log(`[server] listening on ${config_1.config.serverHost}:${config_1.config.serverPort}`);
        });
        this.server.on('error', (err) => {
            console.error(`[server] ERROR`, err);
        });
    }
    incoming(req, res) {
        let body = '';
        req.on('data', (chunk) => {
            body += String(chunk);
        });
        req.on('end', () => {
            this.route(req, res, body);
        });
    }
    route(req, res, body = '') {
        const urlParts = String(req.url).split('/');
        if (req.method === 'GET' && req.url === '/') {
            new readme_request_1.ReadmeRequest(req, res);
            return;
        }
        const part1 = (urlParts[1] || '').split('?')[0];
        if (req.method === 'GET' && (part1 === 'scevent.min.js' || part1 === 's.js') && urlParts.length === 2) {
            new js_asset_request_1.JSAssetRequest(req, res);
            return;
        }
        if (req.method === 'OPTIONS' && part1 === 'r' && urlParts.length === 2) {
            new cors_request_1.CORSRequest(req, res);
            return;
        }
        if (req.method === 'POST' && part1 === 'r' && urlParts.length === 2) {
            new relay_request_1.RelayRequest(req, res, body);
            return;
        }
        new not_found_1.NotFound(req, res);
    }
}
exports.Server = Server;
new Server();
