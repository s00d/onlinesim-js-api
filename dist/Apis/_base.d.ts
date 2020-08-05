export default class _base {
    private token;
    private request;
    private locale;
    constructor(apiToken: string, locale?: 'ru' | 'en');
    protected getRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    protected postRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
}
