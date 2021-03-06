"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var es_qu_el_1 = require("@cd2/es-qu-el");
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = require("dotenv");
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var helmet_1 = __importDefault(require("helmet"));
dotenv_1.config();
var db_1 = require("./db");
var fileProviders_1 = require("./fileProviders");
var controller_1 = require("./controller");
var middleware_1 = require("./middleware");
var app = express_1.default();
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(middleware_1.processRequestBody);
app.use(morgan_1.default("dev"));
var use = function (method, path, cb) { return app[method](path, handleErrors(cb)); };
use("get", "/photo/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var id, row, handler, stream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, db_1.db.one(es_qu_el_1.SQL(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM \"photos\" WHERE id=", ""], ["SELECT * FROM \"photos\" WHERE id=", ""])), id))];
            case 1:
                row = _a.sent();
                handler = fileProviders_1.fileProviders[row.provider];
                stream = handler.retrieve(row.data);
                stream.pipe(res);
                return [2 /*return*/];
        }
    });
}); });
use("post", "*", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var name, action, err, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.path.replace(/^\//, "");
                action = controller_1.controller[name];
                if (!action) {
                    err = new Error("Unknown action: " + name);
                    err.code = 404;
                    throw err;
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, action(req.body)];
            case 2:
                data = _a.sent();
                res.send({ data: data });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).send({ error: error_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.use(function (err, req, res, next) {
    if (err.code) {
        res.status(err.code);
    }
    res.send({ error: err.message });
});
function handleErrors(cb) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.resolve(cb(req, res, next))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
var port = process.env.PORT;
app.listen(port, function () { return console.log("Listening on http://localhost:" + port); });
var templateObject_1;
