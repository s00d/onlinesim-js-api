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
var GetFree = (function (_super) {
    __extends(GetFree, _super);
    function GetFree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetFree.prototype.countries = function () {
        return this.getRequest('getFreeCountryList', {}).then(function (res) {
            return res.countries;
        });
    };
    GetFree.prototype.numbers = function (country) {
        return this.getRequest('getFreePhoneList', { country: country }).then(function (res) {
            return res.numbers;
        });
    };
    GetFree.prototype.messages = function (phone, page) {
        if (page === void 0) { page = 1; }
        return this.getRequest('getFreeMessageList', { phone: phone, page: page }).then(function (res) {
            return res.messages.data;
        });
    };
    return GetFree;
}(_base_1.default));
exports.default = GetFree;
//# sourceMappingURL=GetFree.js.map