export default class _base {
    private token;
    private request;
    private dev_id;
    constructor(apiToken: string, dev_id: number | null);
    protected getRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    protected postRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
}
