export default class _base {
    private token;
    private request;
    private dev_id;
    private lang;
    constructor(apiToken: string, dev_id: number | null, lang: string);
    protected getRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    protected postRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
}
