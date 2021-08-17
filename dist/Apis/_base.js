"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Exceptions_1 = require("../Exceptions");
var _base = (function () {
    function _base(apiToken, lang, dev_id) {
        this.token = apiToken;
        this.dev_id = dev_id;
        this.lang = lang;
        this.request = axios_1.default.create({
            baseURL: 'https://onlinesim.ru/api/',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
            }
        });
    }
    _base.prototype.createRequest = function (token, base) {
        if (base === void 0) { base = 'https://onlinesim.ru/api/'; }
        var headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
        };
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        this.request = axios_1.default.create({
            baseURL: base,
            headers: headers
        });
        return this;
    };
    _base.prototype.getRequest = function (url, params, suf) {
        if (params === void 0) { params = {}; }
        if (suf === void 0) { suf = true; }
        if (this.token) {
            params.apikey = this.token;
        }
        params.lang = this.lang;
        if (this.dev_id) {
            params.dev_id = this.dev_id;
        }
        var ssuf = suf ? '.php' : '';
        return this.request.get(url + ssuf, { params: params }).then(function (response) {
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
        params.lang = this.lang;
        if (this.dev_id) {
            params.dev_id = this.dev_id;
        }
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