"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var request_1 = __importDefault(require("request"));
var fileRoot = path_1.default.join(__dirname, "../files");
exports.fileProviders = {
    local: {
        store: function (image) {
            var _a = getImageMetaData(image), data = _a.data, filename = _a.filename;
            var filePath = path_1.default.join(fileRoot, filename);
            return new Promise(function (resolve, reject) {
                fs_1.default.writeFile(filePath, data, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(filename);
                    }
                });
            });
        },
        retrieve: function (reference) {
            var fullpath = path_1.default.join(fileRoot, reference);
            return fs_1.default.createReadStream(fullpath);
        },
    },
    aws: {
        store: function (image) {
            return __awaiter(this, void 0, void 0, function () {
                var accessKey, secretKey, bucketName, _a, data, filename;
                return __generator(this, function (_b) {
                    accessKey = process.env.AMAZON_ACCESS_KEY;
                    secretKey = process.env.AMAZON_SECRET_KEY;
                    bucketName = process.env.AMAZON_BUCKET_NAME;
                    console.log(accessKey, secretKey, bucketName);
                    if (!accessKey || !secretKey || !bucketName) {
                        throw new Error("AWS not configured");
                    }
                    _a = getImageMetaData(image), data = _a.data, filename = _a.filename;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var s3 = new aws_sdk_1.default.S3({
                                accessKeyId: accessKey,
                                secretAccessKey: secretKey,
                                region: "eu-west-2",
                            });
                            var params = {
                                Bucket: bucketName,
                                Key: filename,
                                Body: data,
                                ACL: "public-read",
                            };
                            console.log("UPLOADING");
                            s3.upload(params, function (err, data) {
                                console.log("FINISHED", err, data);
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(data.Location);
                                }
                            });
                        })];
                });
            });
        },
        retrieve: function (reference) {
            return request_1.default(reference);
        },
    },
};
function getImageMetaData(image) {
    var match = image.match(/^data:image\/(\w+)/);
    var ext = match ? match[1] : "image";
    var filename = "file-" + Math.random() + "-" + Date.now() + "." + ext;
    var base64Data = image.replace(/^data:image\/\w{0,4};base64,/, "");
    var data = new Buffer(base64Data, "base64");
    return { filename: filename, data: data };
}
