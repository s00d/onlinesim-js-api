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
var GetUser = (function (_super) {
    __extends(GetUser, _super);
    function GetUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetUser.prototype.balance = function () {
        return this.getRequest('getBalance', { income: true }).then(function (res) {
            return {
                balance: res.balance,
                zbalance: res.zbalance,
                income: res.income,
            };
        });
    };
    GetUser.prototype.profile = function () {
        return this.getRequest('getProfile', { income: true }).then(function (res) {
            return res.profile;
        });
    };
    GetUser.prototype.getPaymentHistory = function () {
        return this.getRequest('getPaymentHistory').then(function (res) {
            return res;
        });
    };
    GetUser.prototype.createEmpty = function (params) {
        return this.getRequest('pay/createEmpty', params, false).then(function (res) {
            return res;
        });
    };
    return GetUser;
}(_base_1.default));
exports.default = GetUser;
//# sourceMappingURL=GetUser.js.map