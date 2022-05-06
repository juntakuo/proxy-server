"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const client_1 = require("./client");
class NotFound extends client_1.Client {
    constructor(req, res) {
        super(req, res);
        this.respond(404, { 'Content-Type': 'application/json' }, '{"error": "Not Found"}');
    }
}
exports.NotFound = NotFound;
