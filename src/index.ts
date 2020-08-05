import GetNumbers from "./Apis/GetNumbers";
import GetRent from "./Apis/GetRent";
import GetProxy from "./Apis/GetProxy";
import GetUser from "./Apis/GetUser";
import GetFree from "./Apis/GetFree";
import GetForward from "./Apis/GetForward";

export default class OnlineSimDriver {
  private token: string;
  private dev_id: number|null;
  constructor(apiToken: string, dev_id: number|null = null) {
    this.token = apiToken
    this.dev_id = dev_id
  }

  numbers() {
    return new GetNumbers(this.token, this.dev_id)
  }

  rent() {
    return new GetRent(this.token, this.dev_id)
  }

  proxy() {
    return new GetProxy(this.token, this.dev_id)
  }

  user() {
    return new GetUser(this.token, this.dev_id)
  }

  free() {
    return new GetFree(this.token, this.dev_id)
  }

  forward() {
    return new GetForward(this.token, this.dev_id)
  }
}

try {
  // @ts-ignore
  window.OnlineSimDriver = OnlineSimDriver;
} catch(err) {}

