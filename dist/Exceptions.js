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
exports.RequestException = exports.NoNumberException = void 0;
var NoNumberException = (function (_super) {
    __extends(NoNumberException, _super);
    function NoNumberException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoNumberException;
}(Error));
exports.NoNumberException = NoNumberException;
var RequestException = (function (_super) {
    __extends(RequestException, _super);
    function RequestException(error, text) {
        if (text === void 0) { text = null; }
        var _this = _super.call(this, error) || this;
        if (!text && error && error in RequestException.errors) {
            throw new RequestException(error, RequestException.errors[error]);
        }
        Error.captureStackTrace(_this, RequestException);
        return _this;
    }
    RequestException.errors = {
        ACCOUNT_BLOCKED: 'account blocked',
        ERROR_WRONG_KEY: 'wrong apikey',
        ERROR_NO_KEY: 'no apikey',
        ERROR_NO_SERVICE: 'service not specified',
        REQUEST_NOT_FOUND: 'API method not specified',
        API_ACCESS_DISABLED: 'api disabled',
        API_ACCESS_IP: 'access from this ip is disabled in the profile',
        WARNING_NO_NUMS: 'no matching numbers',
        TZ_INPOOL: 'waiting for a number to be dedicated to the operation',
        TZ_NUM_WAIT: 'waiting for response',
        TZ_NUM_ANSWER: 'response has arrived',
        TZ_OVER_EMPTY: 'response did not arrive within the specified time',
        TZ_OVER_OK: 'operation has been completed',
        ERROR_NO_TZID: 'tzid is not specified',
        ERROR_NO_OPERATIONS: 'no operations',
        ACCOUNT_IDENTIFICATION_REQUIRED: 'You have to go through an identification process: to order a messenger - in any way, for forward - on the passport.',
        EXCEEDED_CONCURRENT_OPERATIONS: 'maximum quantity of numbers booked concurrently is exceeded for your account',
        NO_NUMBER: 'temporarily no numbers available for the selected service',
        TIME_INTERVAL_ERROR: 'delayed SMS reception is not possible at this interval of time',
        INTERVAL_CONCURRENT_REQUESTS_ERROR: 'maximum quantity of concurrent requests for number issue is exceeded, try again later',
        TRY_AGAIN_LATER: 'temporarily unable to perform the request',
        NO_FORWARD_FOR_DEFFER: 'forwarding can be activated only for online reception',
        NO_NUMBER_FOR_FORWARD: 'there are no numbers for forwarding',
        ERROR_LENGTH_NUMBER_FOR_FORWARD: 'wrong length of the number for forwarding',
        DUPLICATE_OPERATION: 'adding operations with identical parameters',
        ERROR_NO_NUMBER: 'number is not specified',
        ERROR_PARAMS: 'one or both parameters are wrong',
        LIFICYCLE_NUM_EXPIRED: 'the number has expired',
        NEED_EXTENSION_NUMBER: 'you have to extend the number, see the Extension tab',
        ERROR_NUMBERS_PARAMS: 'error in the number format',
        ERROR_WRONG_TZID: 'error in the number format',
        NO_COMPLETE_TZID: 'unable to complete the operation.',
        NO_CONFIRM_FORWARD: 'unable to confirm forwarding',
        ERROR_NO_SERVICE_REPEAT: 'no services for repeated reception',
        SERVICE_TO_NUMBER_EMPTY: 'no numbers for repeated reception for this service',
    };
    return RequestException;
}(Error));
exports.RequestException = RequestException;
//# sourceMappingURL=Exceptions.js.map