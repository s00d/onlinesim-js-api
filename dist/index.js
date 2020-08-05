"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetNumbers_1 = require("./Apis/GetNumbers");
var GetRent_1 = require("./Apis/GetRent");
var GetProxy_1 = require("./Apis/GetProxy");
var GetUser_1 = require("./Apis/GetUser");
var GetFree_1 = require("./Apis/GetFree");
var GetForward_1 = require("./Apis/GetForward");
var OnlineSimDriver = (function () {
    function OnlineSimDriver(apiToken) {
        this.token = apiToken;
    }
    OnlineSimDriver.prototype.numbers = function () {
        return new GetNumbers_1.default(this.token);
    };
    OnlineSimDriver.prototype.rent = function () {
        return new GetRent_1.default(this.token);
    };
    OnlineSimDriver.prototype.proxy = function () {
        return new GetProxy_1.default(this.token);
    };
    OnlineSimDriver.prototype.user = function () {
        return new GetUser_1.default(this.token);
    };
    OnlineSimDriver.prototype.free = function () {
        return new GetFree_1.default(this.token);
    };
    OnlineSimDriver.prototype.forward = function () {
        return new GetForward_1.default(this.token);
    };
    return OnlineSimDriver;
}());
exports.default = OnlineSimDriver;
try {
    window.OnlineSimDriver = OnlineSimDriver;
}
catch (err) { }
//# sourceMappingURL=index.js.map