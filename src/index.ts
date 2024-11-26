import { GetNumbers } from "./Apis/GetNumbers";
import { GetRent } from "./Apis/GetRent";
import { GetProxy } from "./Apis/GetProxy";
import { GetUser } from "./Apis/GetUser";
import { GetFree } from "./Apis/GetFree";
import { GetOnlineProxy } from "./Apis/GetOnlineProxy";

export default class OnlineSimDriver {
  private token: string|null;
  private dev_id: number|null;
  private lang: string;
  private oauth: null|string = null;
  private base: string = 'https://onlinesim.host/api/';

  constructor(apiToken: string|null = null, lang = 'en', dev_id: number|null = null) {
    this.token = apiToken
    this.dev_id = dev_id
    this.lang = lang
  }

  setBase(base = 'https://onlinesim.host/api/') {
    this.base = base
    return this;
  }


  setOauth(token: string|null) {
    this.oauth = token
    return this;
  }

  setToken(token: string|null) {
    this.token = token
    return this;
  }

  setLang(lang: string) {
    this.lang = lang
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

  onlineProxy() {
    return (new GetOnlineProxy(this.token, this.lang, this.dev_id)).createRequest(this.token, 'https://onlineproxy.io/api/client/v1/')
  }
}

try {
  // @ts-ignore
  window.OnlineSimDriver = OnlineSimDriver;
} catch(err) {}

