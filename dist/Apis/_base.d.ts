export interface Resp {
    response: number | string;
    [key: string]: any;
    [key: number]: any;
}
export default class _base {
    private token;
    private request;
    private dev_id;
    private lang;
    constructor(apiToken: string | null, lang: string, dev_id: number | null);
    createRequest(token: string | null, base?: string): this;
    protected getRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    protected postRequest(url: string, params?: {
        [key: string]: any;
    }): Promise<any>;
}
