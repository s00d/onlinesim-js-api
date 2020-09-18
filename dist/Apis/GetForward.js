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
var GetForward = (function (_super) {
    __extends(GetForward, _super);
    function GetForward() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetForward.prototype.get = function (forward_numbers, service, region, reject) {
        if (service === void 0) { service = 'unlimited_sms'; }
        if (region === void 0) { region = null; }
        if (reject === void 0) { reject = []; }
        return this.getRequest('getForward', { forward_numbers: forward_numbers, service: service, region: region, reject: reject }).then(function (resp) {
            return resp.tzid;
        });
    };
    GetForward.prototype.state = function (message_to_code, orderby, msg_list, clean) {
        if (message_to_code === void 0) { message_to_code = 1; }
        if (orderby === void 0) { orderby = 'ASC'; }
        if (msg_list === void 0) { msg_list = true; }
        if (clean === void 0) { clean = true; }
        return this.getRequest('getState', { message_to_code: message_to_code, orderby: orderby, msg_list: msg_list ? 1 : 0, clean: clean ? 1 : 0, type: 'forward' }).then(function (resp) {
            return resp;
        });
    };
    GetForward.prototype.stateOne = function (tzid, message_to_code, orderby, msg_list, clean) {
        if (message_to_code === void 0) { message_to_code = 1; }
        if (orderby === void 0) { orderby = 'ASC'; }
        if (msg_list === void 0) { msg_list = true; }
        if (clean === void 0) { clean = true; }
        return this.getRequest('getState', { tzid: tzid, message_to_code: message_to_code, orderby: orderby, msg_list: msg_list ? 1 : 0, clean: clean ? 1 : 0, type: 'forward' }).then(function (resp) {
            return resp;
        });
    };
    GetForward.prototype.close = function (tzid) {
        return this.getRequest('setOperationOk', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetForward.prototype.next = function (tzid) {
        return this.getRequest('setOperationRevise', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetForward.prototype.setEnable = function (tzid) {
        return this.getRequest('setForwardStatusEnable', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetForward.prototype.forwardingList = function (page, orderby) {
        if (page === void 0) { page = 1; }
        if (orderby === void 0) { orderby = 'ASC'; }
        return this.getRequest('forwardingList').then(function (resp) {
            return resp.forwardingList.data;
        });
    };
    GetForward.prototype.forwardingListOne = function (tzid, page, orderby) {
        if (page === void 0) { page = 1; }
        if (orderby === void 0) { orderby = 'ASC'; }
        return this.getRequest('forwardingList', { id: tzid }).then(function (resp) {
            return resp.forwarding;
        });
    };
    GetForward.prototype.save = function (tzid, auto, forward_number) {
        if (auto === void 0) { auto = true; }
        if (forward_number === void 0) { forward_number = null; }
        var data = {
            id: tzid,
            auto: auto,
        };
        if (forward_number) {
            data.forward_number = forward_number;
        }
        return this.getRequest('forwardingSave', { tzid: tzid }).then(function (resp) {
            return true;
        });
    };
    GetForward.prototype.remove = function (tzid) {
        return this.getRequest('forwardingRemove', { id: tzid }).then(function (resp) {
            return true;
        });
    };
    GetForward.prototype.callList = function (number, count, page, orderby) {
        if (count === void 0) { count = 10; }
        if (page === void 0) { page = 1; }
        if (orderby === void 0) { orderby = 'ASC'; }
        return this.getRequest('getCallNumberList', { number: number, count: count, page: page, order: orderby }).then(function (resp) {
            return resp.list.data;
        });
    };
    return GetForward;
}(_base_1.default));
exports.default = GetForward;
//# sourceMappingURL=GetForward.js.map