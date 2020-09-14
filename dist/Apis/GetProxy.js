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
var GetProxy = (function (_super) {
    __extends(GetProxy, _super);
    function GetProxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetProxy.prototype.tariffs = function () {
        return this.getRequest('proxy/tariffs', {}).then(function (resp) {
            return resp;
        });
    };
    GetProxy.prototype.get = function (cl, type, connect, count, operator, country, city, port_count, session) {
        if (cl === void 0) { cl = 'days'; }
        if (type === void 0) { type = 'private'; }
        if (connect === void 0) { connect = 'https'; }
        if (count === void 0) { count = 1; }
        if (operator === void 0) { operator = null; }
        if (country === void 0) { country = 7; }
        if (city === void 0) { city = 'any'; }
        if (port_count === void 0) { port_count = 1; }
        if (session === void 0) { session = true; }
        return this.getRequest('proxy/getProxy', { class: cl, type: type, connect: connect, count: count, operator: operator, country: country, city: city, port_count: port_count, session: session }).then(function (resp) {
            return resp.item;
        });
    };
    GetProxy.prototype.state = function (orderby) {
        if (orderby === void 0) { orderby = 'ASC'; }
        return this.getRequest('proxy/getState', { orderby: orderby }).then(function (resp) {
            return resp.list;
        });
    };
    GetProxy.prototype.stateOne = function (tzid) {
        return this.getRequest('proxy/getState', { tzid: tzid }).then(function (resp) {
            return resp.list[0];
        });
    };
    GetProxy.prototype.changeIp = function (tzid) {
        return this.getRequest('proxy/changeIp', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetProxy.prototype.changeType = function (tzid) {
        return this.getRequest('proxy/changeType', { tzid: tzid }).then(function (resp) {
            return resp.connect_type;
        });
    };
    GetProxy.prototype.setComment = function (tzid, comment) {
        if (comment === void 0) { comment = ''; }
        return this.getRequest('proxy/setComment', { tzid: tzid, comment: comment }).then(function (resp) {
            return true;
        });
    };
    return GetProxy;
}(_base_1.default));
exports.default = GetProxy;
//# sourceMappingURL=GetProxy.js.map