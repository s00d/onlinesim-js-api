import l from "axios";
class p extends Error {
}
const _ = class h extends Error {
  constructor(e, t = null) {
    if (super(e), !t && e && e in h.errors)
      throw new h(e, h.errors[e]);
    Error.captureStackTrace(this, h);
  }
};
_.errors = {
  ACCOUNT_BLOCKED: "account blocked",
  ERROR_WRONG_KEY: "wrong apikey",
  ERROR_NO_KEY: "no apikey",
  ERROR_NO_SERVICE: "service not specified",
  REQUEST_NOT_FOUND: "API method not specified",
  API_ACCESS_DISABLED: "api disabled",
  API_ACCESS_IP: "access from this ip is disabled in the profile",
  WARNING_NO_NUMS: "no matching numbers",
  TZ_INPOOL: "waiting for a number to be dedicated to the operation",
  TZ_NUM_WAIT: "waiting for response",
  TZ_NUM_ANSWER: "response has arrived",
  TZ_OVER_EMPTY: "response did not arrive within the specified time",
  TZ_OVER_OK: "operation has been completed",
  ERROR_NO_TZID: "tzid is not specified",
  ERROR_NO_OPERATIONS: "no operations",
  ACCOUNT_IDENTIFICATION_REQUIRED: "You have to go through an identification process: to order a messenger - in any way, for forward - on the passport.",
  EXCEEDED_CONCURRENT_OPERATIONS: "maximum quantity of numbers booked concurrently is exceeded for your account",
  NO_NUMBER: "temporarily no numbers available for the selected service",
  TIME_INTERVAL_ERROR: "delayed SMS reception is not possible at this interval of time",
  INTERVAL_CONCURRENT_REQUESTS_ERROR: "maximum quantity of concurrent requests for number issue is exceeded, try again later",
  TRY_AGAIN_LATER: "temporarily unable to perform the request",
  NO_FORWARD_FOR_DEFFER: "forwarding can be activated only for online reception",
  NO_NUMBER_FOR_FORWARD: "there are no numbers for forwarding",
  ERROR_LENGTH_NUMBER_FOR_FORWARD: "wrong length of the number for forwarding",
  DUPLICATE_OPERATION: "adding operations with identical parameters",
  ERROR_NO_NUMBER: "number is not specified",
  ERROR_PARAMS: "one or both parameters are wrong",
  LIFICYCLE_NUM_EXPIRED: "the number has expired",
  NEED_EXTENSION_NUMBER: "you have to extend the number, see the Extension tab",
  ERROR_NUMBERS_PARAMS: "error in the number format",
  ERROR_WRONG_TZID: "error in the number format",
  NO_COMPLETE_TZID: "unable to complete the operation.",
  NO_CONFIRM_FORWARD: "unable to confirm forwarding",
  ERROR_NO_SERVICE_REPEAT: "no services for repeated reception",
  SERVICE_TO_NUMBER_EMPTY: "no numbers for repeated reception for this service"
};
let c = _;
const d = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36";
class u {
  constructor(e, t, r) {
    this.token = e, this.dev_id = r, this.lang = t, this.request = l.create({
      baseURL: "https://onlinesim.host/api/",
      headers: {
        "User-Agent": d
      }
    });
  }
  createRequest(e, t = "https://onlinesim.host/api/") {
    const r = {
      "User-Agent": d
    };
    return e && (r.Authorization = `Bearer ${e}`), this.request = l.create({
      baseURL: t,
      headers: r
    }), this;
  }
  getRequest(e, t = {}, r = !0) {
    this.token && (t.apikey = this.token), t.lang = this.lang, this.dev_id && (t.dev_id = this.dev_id);
    let s = r ? ".php" : "";
    return this.request.get(e + s, { params: t }).then((i) => {
      const n = i.data;
      if ("response" in n && n.response.toString() !== "1")
        throw n.response.toString() === "NO_NUMBER" || n.response.toString() === "NO_NUMBER_FOR_FORWARD" ? new p(n.response.toString()) : new c(n.response.toString());
      return delete i.data.response, i.data;
    });
  }
  postRequest(e, t = {}) {
    return t.apikey = this.token, t.lang = this.lang, this.dev_id && (t.dev_id = this.dev_id), this.request.post(`${e}.php`, t).then((r) => {
      const s = r.data;
      if ("response" in s && s.response.toString() !== "1")
        throw s.response.toString() === "NO_NUMBER" || s.response.toString() === "NO_NUMBER_FOR_FORWARD" ? new p(s.response.toString()) : new c(s.response.toString());
      return delete r.data.response, r.data;
    });
  }
}
function m(o, e) {
  return new Promise((t) => setTimeout(() => t(e), o));
}
class E extends u {
  price(e, t = 7) {
    return this.getRequest("getPrice", { service: e, country: t }).then((r) => r.price);
  }
  get(e, t = 7, r = [], s = !1) {
    return this.getRequest("getNum", { service: e, country: t, reject: r, extension: s }).then((i) => i.tzid);
  }
  getWithNumber(e, t = 7, r = [], s = !1) {
    return this.getRequest("getNum", { service: e, country: t, reject: r, extension: s, number: !0 }).then((i) => ({ tzid: i.tzid, number: i.number, country: t }));
  }
  state(e = 1, t = "ASC", r = !0, s = !0, i = !1) {
    return this.getRequest("getState", { message_to_code: e, orderby: t, msg_list: r ? 1 : 0, clean: s ? 1 : 0, type: i ? "repeat" : "index" }).then((n) => n);
  }
  stateOne(e, t = 1, r = !0, s = !0, i = !1) {
    return this.getRequest("getState", { tzid: e, message_to_code: t, msg_list: r, clean: s, repeat: i }).then((n) => n[0]);
  }
  next(e) {
    return this.getRequest("setOperationRevise", { tzid: e }).then((t) => !0);
  }
  close(e) {
    return this.getRequest("setOperationOk", { tzid: e }).then((t) => !0);
  }
  ban(e) {
    return this.getRequest("setOperationOk", { tzid: e, ban: 1 }).then((t) => !0);
  }
  repeat(e, t) {
    return this.getRequest("getNumRepeat", { service: e, number: t }).then((r) => r.tzid);
  }
  tariffs() {
    return this.getRequest("getNumbersStats", { country: "all" }).then((e) => e);
  }
  tariffsOne(e = 7) {
    return this.getRequest("getNumbersStats", { country: e }).then((t) => t);
  }
  service() {
    return this.getRequest("getService", {}).then((e) => e.service);
  }
  serviceNumber(e) {
    return this.getRequest("getServiceNumber", { service: e }).then((t) => t.number);
  }
  async wait_code(e, t = 10, r = null, s = !1, i = !1) {
    let n = "", R = 1;
    i && (R = 0);
    let g = 0;
    for (; ; ) {
      if (await m(t), g += 1, g >= 10)
        throw new Error("Timeout error");
      const a = await this.stateOne(e, R, !1);
      if ("msg" in a && !s && a.msg != n) {
        n = a.msg, await this.close(e);
        break;
      } else if ("msg" in a && s && a.msg != n) {
        n = a.msg, await this.next(e);
        break;
      }
    }
    return r && r(n), n;
  }
}
class O extends u {
  get(e = 7, t = 1, r = !1) {
    return this.getRequest("rent/getRentNum", { country: e, days: t, extension: r, pagination: !1 }).then((s) => s.item);
  }
  state() {
    return this.getRequest("rent/getRentState", { pagination: !1 }).then((e) => e.list);
  }
  stateOne(e) {
    return this.getRequest("rent/getRentState", { tzid: e, pagination: !1 }).then((t) => t.list[0]);
  }
  extend(e, t = 1) {
    return this.getRequest("rent/extendRentState", { tzid: e, days: t }).then((r) => r.item);
  }
  portReload(e) {
    return this.getRequest("rent/portReload", { tzid: e }).then((t) => !0);
  }
  tariffs() {
    return this.getRequest("rent/tariffsRent").then((e) => e);
  }
  tariffsOne(e = 7) {
    return this.getRequest("rent/tariffsRent", { country: e }).then((t) => t);
  }
  close(e) {
    return this.getRequest("rent/closeRentNum", { tzid: e }).then((t) => !0);
  }
}
class N extends u {
  tariffs() {
    return this.getRequest("proxy/tariffs", {}).then((e) => e);
  }
  get(e = "days", t = "private", r = "https", s = 1, i = null, n = "any", R = "any", g = 1, a = !0) {
    return this.getRequest("proxy/getProxy", { class: e, type: t, connect: r, count: s, operator: i, country: n, city: R, port_count: g, session: a }).then((f) => f.item);
  }
  state(e = "ASC") {
    return this.getRequest("proxy/getState", { orderby: e }).then((t) => t.list);
  }
  stateOne(e) {
    return this.getRequest("proxy/getState", { tzid: e }).then((t) => t.list[0]);
  }
  changeIp(e) {
    return this.getRequest("proxy/changeIp", { tzid: e }).then((t) => !0);
  }
  changeType(e) {
    return this.getRequest("proxy/changeType", { tzid: e }).then((t) => t.connect_type);
  }
  setComment(e, t = "") {
    return this.getRequest("proxy/setComment", { tzid: e, comment: t }).then((r) => !0);
  }
}
class q extends u {
  balance() {
    return this.getRequest("getBalance", { income: !0 }).then((e) => ({
      balance: e.balance,
      zbalance: e.zbalance,
      income: e.income
    }));
  }
  profile() {
    return this.getRequest("getProfile", { income: !0 }).then((e) => e.profile);
  }
  getPaymentHistory() {
    return this.getRequest("getPaymentHistory").then((e) => e);
  }
  createEmpty(e) {
    return this.getRequest("pay/createEmpty", e, !1).then((t) => t);
  }
}
class b extends u {
  countries() {
    return this.getRequest("getFreeCountryList", {}).then((e) => e.countries);
  }
  numbers(e) {
    return this.getRequest("getFreePhoneList", { country: e }).then((t) => t.numbers);
  }
  messages(e, t = 1) {
    return this.getRequest("getFreeMessageList", { phone: e, page: t }).then((r) => r.messages.data);
  }
  freeList() {
    return this.getRequest("getFreeList", {}).then((e) => e);
  }
}
class y extends u {
  /**
   * Returns proxy.
   * @param id - The ID of the proxy.
   * @returns A promise that resolves to the proxy object.
   */
  getProxy(e) {
    return this.getRequest(`proxies/${e}`, {}, !1);
  }
  /**
   * Returns proxy list.
   * @returns A promise that resolves to the list of proxies.
   */
  getProxyList() {
    return this.getRequest("proxies", {}, !1);
  }
  /**
   * Rotate proxy IP-address.
   * @returns A promise that resolves to the result of the IP rotation.
   */
  rotateProxy(e) {
    return this.getRequest("rotate", { token: e }, !1);
  }
  /**
   * Create/update proxy comment.
   * @param id - The ID of the proxy.
   * @param comment - The comment to create or update.
   * @returns A promise that resolves to the result of the comment creation/update.
   */
  createOrUpdateProxyComment(e, t) {
    return this.postRequest(`proxies/${e}/comment`, { comment: t });
  }
  /**
   * Returns proxies available for order, matches the input filtering criteria.
   * @returns A promise that resolves to the list of available proxies.
   */
  getAvailableProxiesForOrder() {
    return this.getRequest("filters", {}, !1);
  }
  /**
   * Order proxy.
   * @param orderData - The data required to place an order.
   * @returns A promise that resolves to the result of the order.
   */
  orderProxy(e) {
    return this.postRequest("order", e);
  }
  /**
   * Returns the available periods and the minimum order price of proxies, matches the input filtering criteria.
   * @returns A promise that resolves to the list of available tariffs.
   */
  getProxyTariffs() {
    return this.getRequest("tariffs", {}, !1);
  }
  /**
   * Returns user balance.
   * @returns A promise that resolves to the user balance.
   */
  getUserBalance() {
    return this.getRequest("balance", {}, !1);
  }
}
class x {
  constructor(e = null, t = "en", r = null) {
    this.oauth = null, this.base = "https://onlinesim.host/api/", this.token = e, this.dev_id = r, this.lang = t;
  }
  setBase(e = "https://onlinesim.host/api/") {
    return this.base = e, this;
  }
  setOauth(e) {
    return this.oauth = e, this;
  }
  setToken(e) {
    return this.token = e, this;
  }
  setLang(e) {
    return this.lang = e, this;
  }
  numbers() {
    return new E(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  rent() {
    return new O(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  proxy() {
    return new N(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  user() {
    return new q(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  free() {
    return new b(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  onlineProxy() {
    return new y(this.token, this.lang, this.dev_id).createRequest(this.token, "https://onlineproxy.io/api/client/v1/");
  }
}
typeof window < "u" && (window.OnlineSimDriver = x);
export {
  x as default
};
