"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _base_1 = require("./_base");
var GetRent = (function (_super) {
    __extends(GetRent, _super);
    function GetRent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetRent.prototype.get = function (country, days, extension) {
        if (country === void 0) { country = 7; }
        if (days === void 0) { days = 1; }
        if (extension === void 0) { extension = false; }
        return this.getRequest('rent/getRentNum', { country: country, days: days, extension: extension, pagination: false }).then(function (resp) {
            return resp.item;
        });
    };
    GetRent.prototype.state = function () {
        return this.getRequest('rent/getRentState', { pagination: false }).then(function (resp) {
            return resp.list;
        });
    };
    GetRent.prototype.stateOne = function (tzid) {
        return this.getRequest('rent/getRentState', { tzid: tzid, pagination: false }).then(function (resp) {
            return resp.list[0];
        });
    };
    GetRent.prototype.extend = function (tzid, days) {
        if (days === void 0) { days = 1; }
        return this.getRequest('rent/extendRentState', { tzid: tzid, days: days }).then(function (resp) {
            return resp.item;
        });
    };
    GetRent.prototype.portReload = function (tzid) {
        return this.getRequest('rent/portReload', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetRent.prototype.tariffs = function () {
        return this.getRequest('rent/tariffsRent').then(function (resp) {
            return resp;
        });
    };
    GetRent.prototype.tariffsOne = function (country) {
        if (country === void 0) { country = 7; }
        return this.getRequest('rent/tariffsRent', { country: country }).then(function (resp) {
            return resp;
        });
    };
    GetRent.prototype.close = function (tzid) {
        return this.getRequest('rent/closeRentNum', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    return GetRent;
}(_base_1.default));
exports.default = GetRent;
//# sourceMappingURL=GetRent.js.map