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
  constructor(apiToken: string, dev_id: number|null = null, lang = 'en') {
    this.token = apiToken
    this.dev_id = dev_id
    this.lang = lang
  }

  numbers() {
    return new GetNumbers(this.token, this.dev_id, this.lang)
  }

  rent() {
    return new GetRent(this.token, this.dev_id, this.lang)
  }

  proxy() {
    return new GetProxy(this.token, this.dev_id, this.lang)
  }

  user() {
    return new GetUser(this.token, this.dev_id, this.lang)
  }

  free() {
    return new GetFree(this.token, this.dev_id, this.lang)
  }

  forward() {
    return new GetForward(this.token, this.dev_id, this.lang)
  }
}

try {
  // @ts-ignore
  window.OnlineSimDriver = OnlineSimDriver;
} catch(err) {}

