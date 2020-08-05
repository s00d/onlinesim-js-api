export declare class NoNumberException extends Error {
}
export declare class RequestException extends Error {
    static errors: {
        ACCOUNT_BLOCKED: string;
        ERROR_WRONG_KEY: string;
        ERROR_NO_KEY: string;
        ERROR_NO_SERVICE: string;
        REQUEST_NOT_FOUND: string;
        API_ACCESS_DISABLED: string;
        API_ACCESS_IP: string;
        WARNING_NO_NUMS: string;
        TZ_INPOOL: string;
        TZ_NUM_WAIT: string;
        TZ_NUM_ANSWER: string;
        TZ_OVER_EMPTY: string;
        TZ_OVER_OK: string;
        ERROR_NO_TZID: string;
        ERROR_NO_OPERATIONS: string;
        ACCOUNT_IDENTIFICATION_REQUIRED: string;
        EXCEEDED_CONCURRENT_OPERATIONS: string;
        NO_NUMBER: string;
        TIME_INTERVAL_ERROR: string;
        INTERVAL_CONCURRENT_REQUESTS_ERROR: string;
        TRY_AGAIN_LATER: string;
        NO_FORWARD_FOR_DEFFER: string;
        NO_NUMBER_FOR_FORWARD: string;
        ERROR_LENGTH_NUMBER_FOR_FORWARD: string;
        DUPLICATE_OPERATION: string;
        ERROR_NO_NUMBER: string;
        ERROR_PARAMS: string;
        LIFICYCLE_NUM_EXPIRED: string;
        NEED_EXTENSION_NUMBER: string;
        ERROR_NUMBERS_PARAMS: string;
        ERROR_WRONG_TZID: string;
        NO_COMPLETE_TZID: string;
        NO_CONFIRM_FORWARD: string;
        ERROR_NO_SERVICE_REPEAT: string;
        SERVICE_TO_NUMBER_EMPTY: string;
    };
    constructor(error?: string);
}
