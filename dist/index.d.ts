import GetNumbers from "./Apis/GetNumbers";
import GetRent from "./Apis/GetRent";
import GetProxy from "./Apis/GetProxy";
import GetUser from "./Apis/GetUser";
import GetFree from "./Apis/GetFree";
import GetForward from "./Apis/GetForward";
export default class OnlineSimDriver {
    private token;
    private dev_id;
    private lang;
    private oauth;
    private base;
    constructor(apiToken: string, lang?: string, dev_id?: number | null);
    setBase(base?: string): this;
    setOauth(token: string | null): this;
    numbers(): GetNumbers;
    rent(): GetRent;
    proxy(): GetProxy;
    user(): GetUser;
    free(): GetFree;
    forward(): GetForward;
}
