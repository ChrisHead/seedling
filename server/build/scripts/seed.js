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
var dotenv_1 = require("dotenv");
dotenv_1.config();
var db_1 = require("../src/db");
var es_qu_el_1 = require("@cd2/es-qu-el");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var plant, diseases, diseaseValues;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("seeding");
                    return [4 /*yield*/, db_1.db.one(es_qu_el_1.SQL(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    INSERT INTO \"plants\" (\"name\", \"body\")\n    VALUES (", ", ", ")\n    RETURNING id\n  "], ["\n    INSERT INTO \"plants\" (\"name\", \"body\")\n    VALUES (", ", ", ")\n    RETURNING id\n  "])), "Apples", "An apple is a sweet, edible fruit produced by an apple tree (Malus pumila). Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found today. Apples have been grown for thousands of years in Asia and Europe and were brought to North America by European colonists. Apples have religious and mythological significance in many cultures, including Norse, Greek and European Christian traditions."))];
                case 1:
                    plant = _a.sent();
                    diseases = [
                        {
                            name: "Apple scab",
                            body: "Apple scab is a disease of Malus trees, such as apple trees, caused by the ascomycete fungus Venturia inaequalis. The disease manifests as dull black or grey-brown lesions on the surface of tree leaves,[1] buds or fruits. Lesions may also appear less frequently on the woody tissues of the tree. Fruits and the undersides of leaves are especially susceptible. The disease rarely kills its host, but can significantly reduce fruit yields and fruit quality. Affected fruits are less marketable due to the presence of the black fungal lesions.",
                            treatment: "In affected orchards, new infections can be reduced by removing leaf litter and trimmings containing infected tissue from the orchard and incinerating them. This will reduce the amount of new ascospores released in the spring. Additionally, scab lesions on woody tissue can be excised from the tree if possible and similarly destroyed.",
                        },
                        {
                            name: "Cedar-apple rust",
                            body: "Gymnosporangium juniperi-virginianae is a plant pathogen that causes cedar-apple rust.[1] In virtually any location where apples or crabapples (Malus) and Eastern red-cedar (Juniperus virginiana) coexist, cedar apple rust can be a destructive or disfiguring disease on both the apples and cedars. Quince and hawthorn are the most common host and many species of juniper can substitute for the Eastern red cedars.",
                            treatment: "Because apples are an economically important crop, control is usually focused there. Interruption of the disease cycle is the only effective method for control of the cedar apple rust. The recommended method of control is to \u201Cremove cedars located within a 1 mile (1.6 km) radius\u201D of the apples to interrupt the disease cycle,[4] though this method is seldom practical. For those doing bonsai, it is common to have the trees within feet of each other and on the central eastern seaboard of the United States, Eastern Red Cedar is a common first-growth conifer along roadsides.",
                        },
                    ];
                    diseaseValues = diseases
                        .map(function (disease) { return es_qu_el_1.SQL(templateObject_2 || (templateObject_2 = __makeTemplateObject(["(", ", ", ", ", ", ", ")"], ["(", ", ", ", ", ", ", ")"])), disease.name, disease.body, disease.treatment, plant.id); })
                        .join();
                    return [4 /*yield*/, db_1.db.any(es_qu_el_1.SQL(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    INSERT INTO \"diseases\" (\"name\", \"body\", \"treatment\", \"plantId\")\n    VALUES ", "\n  "], ["\n    INSERT INTO \"diseases\" (\"name\", \"body\", \"treatment\", \"plantId\")\n    VALUES ", "\n  "])), function (as) { return as.raw(diseaseValues); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
run().then(function () {
    process.exit(0);
});
var templateObject_1, templateObject_2, templateObject_3;
