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
Object.defineProperty(exports, "__esModule", { value: true });
var _base_1 = require("./_base");
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
    return GetNumbers;
}(_base_1.default));
exports.default = GetNumbers;
//# sourceMappingURL=GetNumbers.js.map