"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetNumbers_1 = require("./Apis/GetNumbers");
var GetRent_1 = require("./Apis/GetRent");
var GetProxy_1 = require("./Apis/GetProxy");
var GetUser_1 = require("./Apis/GetUser");
var GetFree_1 = require("./Apis/GetFree");
var GetForward_1 = require("./Apis/GetForward");
var OnlineSimDriver = (function () {
    function OnlineSimDriver(apiToken, dev_id) {
        if (dev_id === void 0) { dev_id = null; }
        this.token = apiToken;
        this.dev_id = dev_id;
    }
    OnlineSimDriver.prototype.numbers = function () {
        return new GetNumbers_1.default(this.token, this.dev_id);
    };
    OnlineSimDriver.prototype.rent = function () {
        return new GetRent_1.default(this.token, this.dev_id);
    };
    OnlineSimDriver.prototype.proxy = function () {
        return new GetProxy_1.default(this.token, this.dev_id);
    };
    OnlineSimDriver.prototype.user = function () {
        return new GetUser_1.default(this.token, this.dev_id);
    };
    OnlineSimDriver.prototype.free = function () {
        return new GetFree_1.default(this.token, this.dev_id);
    };
    OnlineSimDriver.prototype.forward = function () {
        return new GetForward_1.default(this.token, this.dev_id);
    };
    return OnlineSimDriver;
}());
exports.default = OnlineSimDriver;
try {
    window.OnlineSimDriver = OnlineSimDriver;
}
catch (err) { }
//# sourceMappingURL=index.js.map