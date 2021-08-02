import GetNumbers from "./Apis/GetNumbers";
import GetRent from "./Apis/GetRent";
import GetProxy from "./Apis/GetProxy";
import GetUser from "./Apis/GetUser";
import GetFree from "./Apis/GetFree";
import GetForward from "./Apis/GetForward";

export default class OnlineSimDriver {
  private token: string;
  private dev_id: number|null;
  private lang: string;
  private oauth: null|string = null;
  private base: string = 'https://onlinesim.ru/api/';

  constructor(apiToken: string, lang = 'en', dev_id: number|null = null) {
    this.token = apiToken
    this.dev_id = dev_id
    this.lang = lang
  }

  setBase(base = 'https://onlinesim.ru/api/') {
    this.base = base
    return this;
  }


  setOauth(token: string|null) {
    this.oauth = token
    return this;
  }


  numbers() {
    return (new GetNumbers(this.token, this.lang, this.dev_id)).createRequest(this.oauth, this.base)
  }

  rent() {
    return (new GetRent(this.token, this.lang, this.dev_id)).createRequest(this.oauth, this.base)
  }

  proxy() {
    return (new GetProxy(this.token, this.lang, this.dev_id)).createRequest(this.oauth, this.base)
  }

  user() {
    return (new GetUser(this.token, this.lang, this.dev_id)).createRequest(this.oauth, this.base)
  }

  free() {
    return (new GetFree(this.token, this.lang, this.dev_id)).createRequest(this.oauth, this.base)
  }

  forward() {
    return (new GetForward(this.token, this.lang, this.dev_id)).createRequest(this.oauth, this.base)
  }
}

try {
  // @ts-ignore
  window.OnlineSimDriver = OnlineSimDriver;
} catch(err) {}

