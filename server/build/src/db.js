"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var pg_promise_1 = __importDefault(require("pg-promise"));
var pgp = pg_promise_1.default({
    query: function (query) {
        console.log(chalk_1.default.green(query.query));
    },
});
exports.db = pgp(process.env.DATABASE_URL);
