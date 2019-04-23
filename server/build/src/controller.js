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
Object.defineProperty(exports, "__esModule", { value: true });
var es_qu_el_1 = require("@cd2/es-qu-el");
var db_1 = require("./db");
var fileProviders_1 = require("./fileProviders");
exports.controller = {
    wikiSearch: function (_a) {
        var query = _a.query;
        return __awaiter(this, void 0, void 0, function () {
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = {};
                        return [4 /*yield*/, db_1.db.any(es_qu_el_1.SQL(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM \"plants\" WHERE \"name\" ILIKE '%", "%'"], ["SELECT * FROM \"plants\" WHERE \"name\" ILIKE '%", "%'"])), function (as) { return as.nonQuotedValue(query); }))];
                    case 1:
                        _b.plants = _c.sent();
                        return [4 /*yield*/, db_1.db.any(es_qu_el_1.SQL(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT * FROM \"diseases\" WHERE \"name\" ILIKE '%", "%'"], ["SELECT * FROM \"diseases\" WHERE \"name\" ILIKE '%", "%'"])), function (as) { return as.nonQuotedValue(query); }))];
                    case 2: return [2 /*return*/, (_b.diseases = _c.sent(),
                            _b)];
                }
            });
        });
    },
    wikiShowPlant: function (_a) {
        var id = _a.id;
        return db_1.db.one(es_qu_el_1.SQL(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT\n        *,\n        (\n          SELECT json_agg(\"diseases\")\n          FROM \"diseases\"\n          WHERE \"diseases\".\"plantId\"=\"plants\".\"id\"\n        ) as \"diseases\"\n      FROM \"plants\"\n      WHERE id=", "\n    "], ["\n      SELECT\n        *,\n        (\n          SELECT json_agg(\"diseases\")\n          FROM \"diseases\"\n          WHERE \"diseases\".\"plantId\"=\"plants\".\"id\"\n        ) as \"diseases\"\n      FROM \"plants\"\n      WHERE id=", "\n    "])), id));
    },
    wikiShowDisease: function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, db_1.db.one(es_qu_el_1.SQL(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      SELECT\n        *,\n        (\n          SELECT row_to_json(\"plants\")\n          FROM \"plants\"\n          WHERE \"plants\".\"id\"=\"diseases\".\"plantId\"\n        ) as \"plant\"\n      FROM \"diseases\"\n      WHERE id=", "\n    "], ["\n      SELECT\n        *,\n        (\n          SELECT row_to_json(\"plants\")\n          FROM \"plants\"\n          WHERE \"plants\".\"id\"=\"diseases\".\"plantId\"\n        ) as \"plant\"\n      FROM \"diseases\"\n      WHERE id=", "\n    "])), id))];
            });
        });
    },
    mapMarkers: function () {
        return [
            {
                key: 1,
                latitude: 52.75537570558129,
                longitude: -1.2149717845022678,
                type: "farm",
                id: 123,
            },
            {
                key: 2,
                latitude: 54.75537570558129,
                longitude: -1.2149717845022678,
                type: "farm",
                id: 412,
            },
            {
                key: 3,
                latitude: 53.75537570558129,
                longitude: -1.2149717845022678,
                type: "smallHolding",
                id: 3453,
            },
            {
                key: 4,
                latitude: 49.75537570558129,
                longitude: -1.2149717845022678,
                type: "shop",
                id: 23421,
            },
            {
                key: 5,
                latitude: 45.75537570558129,
                longitude: -1.2149717845022678,
                type: "shop",
                id: 12452,
            },
        ];
    },
    photoCreate: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var photo, isPublic, plantId, latitude, longitude, providerName, fileHandler, reference;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        photo = data.photo, isPublic = data.isPublic, plantId = data.plantId, latitude = data.latitude, longitude = data.longitude;
                        providerName = process.env.FILE_PROVIDER;
                        console.log("provider name", providerName);
                        fileHandler = fileProviders_1.fileProviders[providerName || "local"];
                        return [4 /*yield*/, fileHandler.store(photo)];
                    case 1:
                        reference = _a.sent();
                        console.log(reference);
                        return [2 /*return*/, db_1.db.one(es_qu_el_1.SQL(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      INSERT INTO \"photos\" (\"provider\", \"data\", \"plantId\", \"isPublic\", \"latitude\", \"longitude\")\n      VALUES (", ", ", ", ", ", ", ", ", ", ", ")\n      RETURNING id\n      "], ["\n      INSERT INTO \"photos\" (\"provider\", \"data\", \"plantId\", \"isPublic\", \"latitude\", \"longitude\")\n      VALUES (", ", ", ", ", ", ", ", ",
                                ", ", ")\n      RETURNING id\n      "])), providerName, reference, plantId, isPublic, latitude ||
                                null, longitude || null))];
                }
            });
        });
    },
    photoDestroy: function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db_1.db.any(es_qu_el_1.SQL(templateObject_6 || (templateObject_6 = __makeTemplateObject(["DELETE FROM \"photos\" WHERE \"id\"=", ""], ["DELETE FROM \"photos\" WHERE \"id\"=", ""])), id))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, { ok: true }];
                }
            });
        });
    },
    photoShow: function (_a) {
        var id = _a.id;
        return db_1.db.one(es_qu_el_1.SQL(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      SELECT\n        *,\n        (\n          SELECT row_to_json(\"plants\")\n          FROM \"plants\"\n          WHERE \"plants\".\"id\"=\"photos\".\"plantId\"\n        ) as \"plant\"\n      FROM \"photos\"\n      WHERE id=", "\n    "], ["\n      SELECT\n        *,\n        (\n          SELECT row_to_json(\"plants\")\n          FROM \"plants\"\n          WHERE \"plants\".\"id\"=\"photos\".\"plantId\"\n        ) as \"plant\"\n      FROM \"photos\"\n      WHERE id=", "\n    "])), id));
    },
    plantList: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.any(es_qu_el_1.SQL(templateObject_8 || (templateObject_8 = __makeTemplateObject(["SELECT id, name FROM \"plants\""], ["SELECT id, name FROM \"plants\""]))))];
            });
        });
    },
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
