"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Exceptions_1 = require("../Exceptions");
var _base = (function () {
    function _base(apiToken, locale) {
        if (locale === void 0) { locale = 'ru'; }
        this.locale = 'ru';
        this.token = apiToken;
        this.request = axios_1.default.create({
            baseURL: 'https://onlinesim.ru/api/'
        });
    }
    _base.prototype.getRequest = function (url, params) {
        if (params === void 0) { params = {}; }
        params.apikey = this.token;
        return this.request.get(url + '.php', { params: params }).then(function (response) {
            var resp = response.data;
            if ('response' in resp && resp.response.toString() !== '1') {
                if (resp.response.toString() === 'NO_NUMBER' || resp.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
                    throw new Exceptions_1.NoNumberException(resp.response.toString());
                }
                throw new Exceptions_1.RequestException(resp.response.toString());
            }
            delete response.data.response;
            return response.data;
        });
    };
    _base.prototype.postRequest = function (url, params) {
        if (params === void 0) { params = {}; }
        params.apikey = this.token;
        return this.request.post(url + '.php', params).then(function (response) {
            var resp = response.data;
            if ('response' in resp && resp.response.toString() !== '1') {
                if (resp.response.toString() === 'NO_NUMBER' || resp.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
                    throw new Exceptions_1.NoNumberException(resp.response.toString());
                }
                throw new Exceptions_1.RequestException(resp.response.toString());
            }
            delete response.data.response;
            return response.data;
        });
    };
    return _base;
}());
exports.default = _base;
//# sourceMappingURL=_base.js.map