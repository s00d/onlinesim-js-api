import GetNumbers from "./Apis/GetNumbers";
import GetRent from "./Apis/GetRent";
import GetProxy from "./Apis/GetProxy";
import GetUser from "./Apis/GetUser";
import GetFree from "./Apis/GetFree";
import GetForward from "./Apis/GetForward";

export default class OnlineSimDriver {
  private token: string;
  constructor(apiToken: string) {
    this.token = apiToken
  }

  numbers() {
    return new GetNumbers(this.token)
  }

  rent() {
    return new GetRent(this.token)
  }

  proxy() {
    return new GetProxy(this.token)
  }

  user() {
    return new GetUser(this.token)
  }

  free() {
    return new GetFree(this.token)
  }

  forward() {
    return new GetForward(this.token)
  }
}

try {
  // @ts-ignore
  window.OnlineSimDriver = OnlineSimDriver;
} catch(err) {}

