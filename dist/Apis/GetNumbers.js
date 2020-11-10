"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var _base_1 = require("./_base");
function delay(timeout, result) {
    return new Promise(function (resolve) { return ; });
    setTimeout(function () { return ; });
    resolve(result), timeout;
    ;
}
var GetNumbers = (function (_super) {
    __extends(GetNumbers, _super);
    function GetNumbers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetNumbers.prototype.price = function (service, country) {
        if (country === void 0) { country = 7; }
        return this.getRequest('getPrice', { service: service, country: country }).then(function (resp) {
            return resp.price;
        });
    };
    GetNumbers.prototype.get = function (service, country, reject, extension) {
        if (country === void 0) { country = 7; }
        if (reject === void 0) { reject = []; }
        if (extension === void 0) { extension = false; }
        return this.getRequest('getNum', { service: service, country: country, reject: reject, extension: extension }).then(function (resp) {
            return resp.tzid;
        });
    };
    GetNumbers.prototype.state = function (message_to_code, orderby, msg_list, clean, repeat) {
        if (message_to_code === void 0) { message_to_code = 1; }
        if (orderby === void 0) { orderby = 'ASC'; }
        if (msg_list === void 0) { msg_list = true; }
        if (clean === void 0) { clean = true; }
        if (repeat === void 0) { repeat = false; }
        return this.getRequest('getState', { message_to_code: message_to_code, orderby: orderby, msg_list: msg_list ? 1 : 0, clean: clean ? 1 : 0, type: repeat ? 'repeat' : 'index' })
            .then(function (resp) {
            return resp;
        });
    };
    GetNumbers.prototype.stateOne = function (tzid, message_to_code, msg_list, clean, repeat) {
        if (message_to_code === void 0) { message_to_code = 1; }
        if (msg_list === void 0) { msg_list = true; }
        if (clean === void 0) { clean = true; }
        if (repeat === void 0) { repeat = false; }
        return this.getRequest('getState', { tzid: tzid, message_to_code: message_to_code, msg_list: msg_list, clean: clean, repeat: repeat })
            .then(function (resp) {
            return resp[0];
        });
    };
    GetNumbers.prototype.next = function (tzid) {
        return this.getRequest('setOperationRevise', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetNumbers.prototype.close = function (tzid) {
        return this.getRequest('setOperationOk', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetNumbers.prototype.ban = function (tzid) {
        return this.getRequest('setOperationOk', { tzid: tzid, ban: 1 }).then(function (resp) {
            return true;
        });
    };
    GetNumbers.prototype.repeat = function (service, number) {
        return this.getRequest('getNumRepeat', { service: service, number: number }).then(function (resp) {
            return resp.tzid;
        });
    };
    GetNumbers.prototype.tariffs = function () {
        return this.getRequest('getNumbersStats', { country: 'all' }).then(function (resp) {
            return resp;
        });
    };
    GetNumbers.prototype.tariffsOne = function (country) {
        if (country === void 0) { country = 7; }
        return this.getRequest('getNumbersStats', { country: country }).then(function (resp) {
            return resp;
        });
    };
    GetNumbers.prototype.service = function () {
        return this.getRequest('getService', {}).then(function (resp) {
            return resp.service;
        });
    };
    GetNumbers.prototype.serviceNumber = function (service) {
        return this.getRequest('getServiceNumber', { service: service }).then(function (resp) {
            return resp.number;
        });
    };
    GetNumbers.prototype.wait_code = function (tzid, timeout, callback, not_end, full_message) {
        if (timeout === void 0) { timeout = 10; }
        if (callback === void 0) { callback = null; }
        if (not_end === void 0) { not_end = false; }
        if (full_message === void 0) { full_message = false; }
        return __awaiter(this, void 0, void 0, function () {
            var __last_code, _response_type, counter, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        __last_code = '';
                        _response_type = 1;
                        if (full_message) {
                            _response_type = 0;
                        }
                        counter = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3, 8];
                        return [4, delay(timeout)];
                    case 2:
                        _a.sent();
                        counter += 1;
                        if (counter >= 10) {
                            throw new Error('Timeout error');
                        }
                        return [4, this.stateOne(tzid, _response_type, false)];
                    case 3:
                        response = _a.sent();
                        if (!('msg' in response && !not_end && response['msg'] != __last_code)) return [3, 5];
                        __last_code = response['msg'];
                        return [4, this.close(tzid)];
                    case 4:
                        _a.sent();
                        return [3, 8];
                    case 5:
                        if (!('msg' in response && not_end && response['msg'] != __last_code)) return [3, 7];
                        __last_code = response['msg'];
                        return [4, this.next(tzid)];
                    case 6:
                        _a.sent();
                        return [3, 8];
                    case 7: return [3, 1];
                    case 8:
                        if (callback) {
                            callback(__last_code);
                        }
                        return [2, __last_code];
                }
            });
        });
    };
    return GetNumbers;
}(_base_1.default));
exports.default = GetNumbers;
//# sourceMappingURL=GetNumbers.js.map