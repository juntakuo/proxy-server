"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assets = void 0;
const fs_1 = require("fs");
const http2_1 = __importDefault(require("http2"));
const config_1 = require("./config");
class Assets {
    constructor() {
        this.cache = {};
        this.load();
    }
    get js() {
        return this.cache.js || '';
    }
    get readme() {
        return this.cache.readme || '';
    }
    load() {
        const protocol = config_1.config.js.split('://')[0];
        if (protocol === 'http' || protocol === 'https') {
            this.loadJSRemote();
        }
        else {
            this.loadJSLocal();
        }
        this.loadReadme();
    }
    loadJSLocal() {
        console.log('[asset] loading JS file:', config_1.config.js);
        (0, fs_1.readFile)(config_1.config.js, 'utf8', (err, data) => this.store(err ? '' : data, 'js'));
    }
    loadJSRemote() {
        console.log('[asset] retrieving JS file:', config_1.config.js);
        const url = new URL(config_1.config.js);
        console.log(`url: ${url.protocol}//${url.host}`);
        const client = http2_1.default.connect(`${url.protocol}//${url.host}`);
        client.on('error', (err) => {
            console.error(err);
            this.logFail(`client error: ${config_1.config.js}`);
        });
        console.log(`path: ${url.pathname}`);
        const req = client.request({ ':path': url.pathname });
        req.on('response', () => {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                this.store(data, 'js');
                client.close();
            });
        });
        req.setEncoding('utf8');
        req.end();
    }
    loadReadme() {
        console.log('[asset] loading readme file:', config_1.config.readme);
        (0, fs_1.readFile)(config_1.config.readme, 'utf8', (err, data) => this.store(err ? '' : data, 'readme'));
    }
    logFail(msg) {
        console.error('[asset] ERROR:', msg);
        if (!this.cache) {
            process.exit(1);
        }
    }
    store(data, target) {
        if (!data) {
            console.error(`[asset] ERROR: loading ${target}`);
            if (!this.cache) {
                process.exit(1);
            }
        }
        else {
            this.cache[target] = data;
            console.log(`[asset] ${target} cached ${Buffer.byteLength(data, 'utf8')} bytes`);
        }
    }
}
exports.assets = new Assets();
