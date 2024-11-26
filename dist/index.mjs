function ze(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var J = { exports: {} }, Ce = function(e, r) {
  return function() {
    for (var s = new Array(arguments.length), i = 0; i < s.length; i++)
      s[i] = arguments[i];
    return e.apply(r, s);
  };
}, Ke = Ce, y = Object.prototype.toString;
function Q(t) {
  return y.call(t) === "[object Array]";
}
function Y(t) {
  return typeof t > "u";
}
function Ve(t) {
  return t !== null && !Y(t) && t.constructor !== null && !Y(t.constructor) && typeof t.constructor.isBuffer == "function" && t.constructor.isBuffer(t);
}
function We(t) {
  return y.call(t) === "[object ArrayBuffer]";
}
function Ge(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function Xe(t) {
  var e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(t) : e = t && t.buffer && t.buffer instanceof ArrayBuffer, e;
}
function Ye(t) {
  return typeof t == "string";
}
function Ze(t) {
  return typeof t == "number";
}
function Ae(t) {
  return t !== null && typeof t == "object";
}
function S(t) {
  if (y.call(t) !== "[object Object]")
    return !1;
  var e = Object.getPrototypeOf(t);
  return e === null || e === Object.prototype;
}
function Je(t) {
  return y.call(t) === "[object Date]";
}
function Qe(t) {
  return y.call(t) === "[object File]";
}
function et(t) {
  return y.call(t) === "[object Blob]";
}
function Te(t) {
  return y.call(t) === "[object Function]";
}
function tt(t) {
  return Ae(t) && Te(t.pipe);
}
function rt(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
function nt(t) {
  return t.replace(/^\s*/, "").replace(/\s*$/, "");
}
function st() {
  return typeof navigator < "u" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS") ? !1 : typeof window < "u" && typeof document < "u";
}
function ee(t, e) {
  if (!(t === null || typeof t > "u"))
    if (typeof t != "object" && (t = [t]), Q(t))
      for (var r = 0, n = t.length; r < n; r++)
        e.call(null, t[r], r, t);
    else
      for (var s in t)
        Object.prototype.hasOwnProperty.call(t, s) && e.call(null, t[s], s, t);
}
function Z() {
  var t = {};
  function e(s, i) {
    S(t[i]) && S(s) ? t[i] = Z(t[i], s) : S(s) ? t[i] = Z({}, s) : Q(s) ? t[i] = s.slice() : t[i] = s;
  }
  for (var r = 0, n = arguments.length; r < n; r++)
    ee(arguments[r], e);
  return t;
}
function it(t, e, r) {
  return ee(e, function(s, i) {
    r && typeof s == "function" ? t[i] = Ke(s, r) : t[i] = s;
  }), t;
}
function at(t) {
  return t.charCodeAt(0) === 65279 && (t = t.slice(1)), t;
}
var m = {
  isArray: Q,
  isArrayBuffer: We,
  isBuffer: Ve,
  isFormData: Ge,
  isArrayBufferView: Xe,
  isString: Ye,
  isNumber: Ze,
  isObject: Ae,
  isPlainObject: S,
  isUndefined: Y,
  isDate: Je,
  isFile: Qe,
  isBlob: et,
  isFunction: Te,
  isStream: tt,
  isURLSearchParams: rt,
  isStandardBrowserEnv: st,
  forEach: ee,
  merge: Z,
  extend: it,
  trim: nt,
  stripBOM: at
}, O = m;
function ne(t) {
  return encodeURIComponent(t).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var Ue = function(e, r, n) {
  if (!r)
    return e;
  var s;
  if (n)
    s = n(r);
  else if (O.isURLSearchParams(r))
    s = r.toString();
  else {
    var i = [];
    O.forEach(r, function(c, a) {
      c === null || typeof c > "u" || (O.isArray(c) ? a = a + "[]" : c = [c], O.forEach(c, function(R) {
        O.isDate(R) ? R = R.toISOString() : O.isObject(R) && (R = JSON.stringify(R)), i.push(ne(a) + "=" + ne(R));
      }));
    }), s = i.join("&");
  }
  if (s) {
    var o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + s;
  }
  return e;
}, ot = m;
function A() {
  this.handlers = [];
}
A.prototype.use = function(e, r) {
  return this.handlers.push({
    fulfilled: e,
    rejected: r
  }), this.handlers.length - 1;
};
A.prototype.eject = function(e) {
  this.handlers[e] && (this.handlers[e] = null);
};
A.prototype.forEach = function(e) {
  ot.forEach(this.handlers, function(n) {
    n !== null && e(n);
  });
};
var ut = A, ft = m, ht = function(e, r, n) {
  return ft.forEach(n, function(i) {
    e = i(e, r);
  }), e;
}, P, se;
function Pe() {
  return se || (se = 1, P = function(e) {
    return !!(e && e.__CANCEL__);
  }), P;
}
var ct = m, lt = function(e, r) {
  ct.forEach(e, function(s, i) {
    i !== r && i.toUpperCase() === r.toUpperCase() && (e[r] = s, delete e[i]);
  });
}, L, ie;
function dt() {
  return ie || (ie = 1, L = function(e, r, n, s, i) {
    return e.config = r, n && (e.code = n), e.request = s, e.response = i, e.isAxiosError = !0, e.toJSON = function() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    }, e;
  }), L;
}
var I, ae;
function Le() {
  if (ae)
    return I;
  ae = 1;
  var t = dt();
  return I = function(r, n, s, i, o) {
    var h = new Error(r);
    return t(h, n, s, i, o);
  }, I;
}
var B, oe;
function pt() {
  if (oe)
    return B;
  oe = 1;
  var t = Le();
  return B = function(r, n, s) {
    var i = s.config.validateStatus;
    !s.status || !i || i(s.status) ? r(s) : n(t(
      "Request failed with status code " + s.status,
      s.config,
      null,
      s.request,
      s
    ));
  }, B;
}
var D, ue;
function mt() {
  if (ue)
    return D;
  ue = 1;
  var t = m;
  return D = t.isStandardBrowserEnv() ? (
    // Standard browser envs support document.cookie
    function() {
      return {
        write: function(n, s, i, o, h, c) {
          var a = [];
          a.push(n + "=" + encodeURIComponent(s)), t.isNumber(i) && a.push("expires=" + new Date(i).toGMTString()), t.isString(o) && a.push("path=" + o), t.isString(h) && a.push("domain=" + h), c === !0 && a.push("secure"), document.cookie = a.join("; ");
        },
        read: function(n) {
          var s = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
          return s ? decodeURIComponent(s[3]) : null;
        },
        remove: function(n) {
          this.write(n, "", Date.now() - 864e5);
        }
      };
    }()
  ) : (
    // Non standard browser env (web workers, react-native) lack needed support.
    function() {
      return {
        write: function() {
        },
        read: function() {
          return null;
        },
        remove: function() {
        }
      };
    }()
  ), D;
}
var F, fe;
function Rt() {
  return fe || (fe = 1, F = function(e) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
  }), F;
}
var M, he;
function gt() {
  return he || (he = 1, M = function(e, r) {
    return r ? e.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : e;
  }), M;
}
var k, ce;
function vt() {
  if (ce)
    return k;
  ce = 1;
  var t = Rt(), e = gt();
  return k = function(n, s) {
    return n && !t(s) ? e(n, s) : s;
  }, k;
}
var $, le;
function Et() {
  if (le)
    return $;
  le = 1;
  var t = m, e = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  return $ = function(n) {
    var s = {}, i, o, h;
    return n && t.forEach(n.split(`
`), function(a) {
      if (h = a.indexOf(":"), i = t.trim(a.substr(0, h)).toLowerCase(), o = t.trim(a.substr(h + 1)), i) {
        if (s[i] && e.indexOf(i) >= 0)
          return;
        i === "set-cookie" ? s[i] = (s[i] ? s[i] : []).concat([o]) : s[i] = s[i] ? s[i] + ", " + o : o;
      }
    }), s;
  }, $;
}
var H, de;
function yt() {
  if (de)
    return H;
  de = 1;
  var t = m;
  return H = t.isStandardBrowserEnv() ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function() {
      var r = /(msie|trident)/i.test(navigator.userAgent), n = document.createElement("a"), s;
      function i(o) {
        var h = o;
        return r && (n.setAttribute("href", h), h = n.href), n.setAttribute("href", h), {
          href: n.href,
          protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
          host: n.host,
          search: n.search ? n.search.replace(/^\?/, "") : "",
          hash: n.hash ? n.hash.replace(/^#/, "") : "",
          hostname: n.hostname,
          port: n.port,
          pathname: n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname
        };
      }
      return s = i(window.location.href), function(h) {
        var c = t.isString(h) ? i(h) : h;
        return c.protocol === s.protocol && c.host === s.host;
      };
    }()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    function() {
      return function() {
        return !0;
      };
    }()
  ), H;
}
var j, pe;
function me() {
  if (pe)
    return j;
  pe = 1;
  var t = m, e = pt(), r = mt(), n = Ue, s = vt(), i = Et(), o = yt(), h = Le();
  return j = function(a) {
    return new Promise(function(R, l) {
      var f = a.data, _ = a.headers;
      t.isFormData(f) && delete _["Content-Type"];
      var u = new XMLHttpRequest();
      if (a.auth) {
        var $e = a.auth.username || "", He = a.auth.password ? unescape(encodeURIComponent(a.auth.password)) : "";
        _.Authorization = "Basic " + btoa($e + ":" + He);
      }
      var te = s(a.baseURL, a.url);
      if (u.open(a.method.toUpperCase(), n(te, a.params, a.paramsSerializer), !0), u.timeout = a.timeout, u.onreadystatechange = function() {
        if (!(!u || u.readyState !== 4) && !(u.status === 0 && !(u.responseURL && u.responseURL.indexOf("file:") === 0))) {
          var v = "getAllResponseHeaders" in u ? i(u.getAllResponseHeaders()) : null, w = !a.responseType || a.responseType === "text" ? u.responseText : u.response, je = {
            data: w,
            status: u.status,
            statusText: u.statusText,
            headers: v,
            config: a,
            request: u
          };
          e(R, l, je), u = null;
        }
      }, u.onabort = function() {
        u && (l(h("Request aborted", a, "ECONNABORTED", u)), u = null);
      }, u.onerror = function() {
        l(h("Network Error", a, null, u)), u = null;
      }, u.ontimeout = function() {
        var v = "timeout of " + a.timeout + "ms exceeded";
        a.timeoutErrorMessage && (v = a.timeoutErrorMessage), l(h(
          v,
          a,
          "ECONNABORTED",
          u
        )), u = null;
      }, t.isStandardBrowserEnv()) {
        var re = (a.withCredentials || o(te)) && a.xsrfCookieName ? r.read(a.xsrfCookieName) : void 0;
        re && (_[a.xsrfHeaderName] = re);
      }
      if ("setRequestHeader" in u && t.forEach(_, function(v, w) {
        typeof f > "u" && w.toLowerCase() === "content-type" ? delete _[w] : u.setRequestHeader(w, v);
      }), t.isUndefined(a.withCredentials) || (u.withCredentials = !!a.withCredentials), a.responseType)
        try {
          u.responseType = a.responseType;
        } catch (E) {
          if (a.responseType !== "json")
            throw E;
        }
      typeof a.onDownloadProgress == "function" && u.addEventListener("progress", a.onDownloadProgress), typeof a.onUploadProgress == "function" && u.upload && u.upload.addEventListener("progress", a.onUploadProgress), a.cancelToken && a.cancelToken.promise.then(function(v) {
        u && (u.abort(), l(v), u = null);
      }), f || (f = null), u.send(f);
    });
  }, j;
}
var p = m, Re = lt, Ot = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function ge(t, e) {
  !p.isUndefined(t) && p.isUndefined(t["Content-Type"]) && (t["Content-Type"] = e);
}
function bt() {
  var t;
  return (typeof XMLHttpRequest < "u" || typeof process < "u" && Object.prototype.toString.call(process) === "[object process]") && (t = me()), t;
}
var T = {
  adapter: bt(),
  transformRequest: [function(e, r) {
    return Re(r, "Accept"), Re(r, "Content-Type"), p.isFormData(e) || p.isArrayBuffer(e) || p.isBuffer(e) || p.isStream(e) || p.isFile(e) || p.isBlob(e) ? e : p.isArrayBufferView(e) ? e.buffer : p.isURLSearchParams(e) ? (ge(r, "application/x-www-form-urlencoded;charset=utf-8"), e.toString()) : p.isObject(e) ? (ge(r, "application/json;charset=utf-8"), JSON.stringify(e)) : e;
  }],
  transformResponse: [function(e) {
    if (typeof e == "string")
      try {
        e = JSON.parse(e);
      } catch {
      }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  }
};
T.headers = {
  common: {
    Accept: "application/json, text/plain, */*"
  }
};
p.forEach(["delete", "get", "head"], function(e) {
  T.headers[e] = {};
});
p.forEach(["post", "put", "patch"], function(e) {
  T.headers[e] = p.merge(Ot);
});
var Ie = T, ve = m, z = ht, qt = Pe(), _t = Ie;
function K(t) {
  t.cancelToken && t.cancelToken.throwIfRequested();
}
var wt = function(e) {
  K(e), e.headers = e.headers || {}, e.data = z(
    e.data,
    e.headers,
    e.transformRequest
  ), e.headers = ve.merge(
    e.headers.common || {},
    e.headers[e.method] || {},
    e.headers
  ), ve.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function(s) {
      delete e.headers[s];
    }
  );
  var r = e.adapter || _t.adapter;
  return r(e).then(function(s) {
    return K(e), s.data = z(
      s.data,
      s.headers,
      e.transformResponse
    ), s;
  }, function(s) {
    return qt(s) || (K(e), s && s.response && (s.response.data = z(
      s.response.data,
      s.response.headers,
      e.transformResponse
    ))), Promise.reject(s);
  });
}, d = m, Be = function(e, r) {
  r = r || {};
  var n = {}, s = ["url", "method", "data"], i = ["headers", "auth", "proxy", "params"], o = [
    "baseURL",
    "transformRequest",
    "transformResponse",
    "paramsSerializer",
    "timeout",
    "timeoutMessage",
    "withCredentials",
    "adapter",
    "responseType",
    "xsrfCookieName",
    "xsrfHeaderName",
    "onUploadProgress",
    "onDownloadProgress",
    "decompress",
    "maxContentLength",
    "maxBodyLength",
    "maxRedirects",
    "transport",
    "httpAgent",
    "httpsAgent",
    "cancelToken",
    "socketPath",
    "responseEncoding"
  ], h = ["validateStatus"];
  function c(l, f) {
    return d.isPlainObject(l) && d.isPlainObject(f) ? d.merge(l, f) : d.isPlainObject(f) ? d.merge({}, f) : d.isArray(f) ? f.slice() : f;
  }
  function a(l) {
    d.isUndefined(r[l]) ? d.isUndefined(e[l]) || (n[l] = c(void 0, e[l])) : n[l] = c(e[l], r[l]);
  }
  d.forEach(s, function(f) {
    d.isUndefined(r[f]) || (n[f] = c(void 0, r[f]));
  }), d.forEach(i, a), d.forEach(o, function(f) {
    d.isUndefined(r[f]) ? d.isUndefined(e[f]) || (n[f] = c(void 0, e[f])) : n[f] = c(void 0, r[f]);
  }), d.forEach(h, function(f) {
    f in r ? n[f] = c(e[f], r[f]) : f in e && (n[f] = c(void 0, e[f]));
  });
  var q = s.concat(i).concat(o).concat(h), R = Object.keys(e).concat(Object.keys(r)).filter(function(f) {
    return q.indexOf(f) === -1;
  });
  return d.forEach(R, a), n;
}, De = m, Nt = Ue, Ee = ut, xt = wt, U = Be;
function x(t) {
  this.defaults = t, this.interceptors = {
    request: new Ee(),
    response: new Ee()
  };
}
x.prototype.request = function(e) {
  typeof e == "string" ? (e = arguments[1] || {}, e.url = arguments[0]) : e = e || {}, e = U(this.defaults, e), e.method ? e.method = e.method.toLowerCase() : this.defaults.method ? e.method = this.defaults.method.toLowerCase() : e.method = "get";
  var r = [xt, void 0], n = Promise.resolve(e);
  for (this.interceptors.request.forEach(function(i) {
    r.unshift(i.fulfilled, i.rejected);
  }), this.interceptors.response.forEach(function(i) {
    r.push(i.fulfilled, i.rejected);
  }); r.length; )
    n = n.then(r.shift(), r.shift());
  return n;
};
x.prototype.getUri = function(e) {
  return e = U(this.defaults, e), Nt(e.url, e.params, e.paramsSerializer).replace(/^\?/, "");
};
De.forEach(["delete", "get", "head", "options"], function(e) {
  x.prototype[e] = function(r, n) {
    return this.request(U(n || {}, {
      method: e,
      url: r,
      data: (n || {}).data
    }));
  };
});
De.forEach(["post", "put", "patch"], function(e) {
  x.prototype[e] = function(r, n, s) {
    return this.request(U(s || {}, {
      method: e,
      url: r,
      data: n
    }));
  };
});
var St = x, V, ye;
function Fe() {
  if (ye)
    return V;
  ye = 1;
  function t(e) {
    this.message = e;
  }
  return t.prototype.toString = function() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  }, t.prototype.__CANCEL__ = !0, V = t, V;
}
var W, Oe;
function Ct() {
  if (Oe)
    return W;
  Oe = 1;
  var t = Fe();
  function e(r) {
    if (typeof r != "function")
      throw new TypeError("executor must be a function.");
    var n;
    this.promise = new Promise(function(o) {
      n = o;
    });
    var s = this;
    r(function(o) {
      s.reason || (s.reason = new t(o), n(s.reason));
    });
  }
  return e.prototype.throwIfRequested = function() {
    if (this.reason)
      throw this.reason;
  }, e.source = function() {
    var n, s = new e(function(o) {
      n = o;
    });
    return {
      token: s,
      cancel: n
    };
  }, W = e, W;
}
var G, be;
function At() {
  return be || (be = 1, G = function(e) {
    return function(n) {
      return e.apply(null, n);
    };
  }), G;
}
var X, qe;
function Tt() {
  return qe || (qe = 1, X = function(e) {
    return typeof e == "object" && e.isAxiosError === !0;
  }), X;
}
var _e = m, Ut = Ce, C = St, Pt = Be, Lt = Ie;
function Me(t) {
  var e = new C(t), r = Ut(C.prototype.request, e);
  return _e.extend(r, C.prototype, e), _e.extend(r, e), r;
}
var g = Me(Lt);
g.Axios = C;
g.create = function(e) {
  return Me(Pt(g.defaults, e));
};
g.Cancel = Fe();
g.CancelToken = Ct();
g.isCancel = Pe();
g.all = function(e) {
  return Promise.all(e);
};
g.spread = At();
g.isAxiosError = Tt();
J.exports = g;
J.exports.default = g;
var It = J.exports, Bt = It;
const we = /* @__PURE__ */ ze(Bt);
class Ne extends Error {
}
const ke = class N extends Error {
  constructor(e, r = null) {
    if (super(e), !r && e && e in N.errors)
      throw new N(e, N.errors[e]);
    Error.captureStackTrace(this, N);
  }
};
ke.errors = {
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
let xe = ke;
const Se = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36";
class b {
  constructor(e, r, n) {
    this.token = e, this.dev_id = n, this.lang = r, this.request = we.create({
      baseURL: "https://onlinesim.host/api/",
      headers: {
        "User-Agent": Se
      }
    });
  }
  createRequest(e, r = "https://onlinesim.host/api/") {
    const n = {
      "User-Agent": Se
    };
    return e && (n.Authorization = "Bearer " + e), this.request = we.create({
      baseURL: r,
      headers: n
    }), this;
  }
  getRequest(e, r = {}, n = !0) {
    this.token && (r.apikey = this.token), r.lang = this.lang, this.dev_id && (r.dev_id = this.dev_id);
    let s = n ? ".php" : "";
    return this.request.get(e + s, { params: r }).then((i) => {
      const o = i.data;
      if ("response" in o && o.response.toString() !== "1")
        throw o.response.toString() === "NO_NUMBER" || o.response.toString() === "NO_NUMBER_FOR_FORWARD" ? new Ne(o.response.toString()) : new xe(o.response.toString());
      return delete i.data.response, i.data;
    });
  }
  postRequest(e, r = {}) {
    return r.apikey = this.token, r.lang = this.lang, this.dev_id && (r.dev_id = this.dev_id), this.request.post(e + ".php", r).then((n) => {
      const s = n.data;
      if ("response" in s && s.response.toString() !== "1")
        throw s.response.toString() === "NO_NUMBER" || s.response.toString() === "NO_NUMBER_FOR_FORWARD" ? new Ne(s.response.toString()) : new xe(s.response.toString());
      return delete n.data.response, n.data;
    });
  }
}
function Dt(t, e) {
  return new Promise((r) => setTimeout(() => r(e), t));
}
class Ft extends b {
  price(e, r = 7) {
    return this.getRequest("getPrice", { service: e, country: r }).then((n) => n.price);
  }
  get(e, r = 7, n = [], s = !1) {
    return this.getRequest("getNum", { service: e, country: r, reject: n, extension: s }).then((i) => i.tzid);
  }
  getWithNumber(e, r = 7, n = [], s = !1) {
    return this.getRequest("getNum", { service: e, country: r, reject: n, extension: s, number: !0 }).then((i) => ({ tzid: i.tzid, number: i.number, country: r }));
  }
  state(e = 1, r = "ASC", n = !0, s = !0, i = !1) {
    return this.getRequest("getState", { message_to_code: e, orderby: r, msg_list: n ? 1 : 0, clean: s ? 1 : 0, type: i ? "repeat" : "index" }).then((o) => o);
  }
  stateOne(e, r = 1, n = !0, s = !0, i = !1) {
    return this.getRequest("getState", { tzid: e, message_to_code: r, msg_list: n, clean: s, repeat: i }).then((o) => o[0]);
  }
  next(e) {
    return this.getRequest("setOperationRevise", { tzid: e }).then((r) => !0);
  }
  close(e) {
    return this.getRequest("setOperationOk", { tzid: e }).then((r) => !0);
  }
  ban(e) {
    return this.getRequest("setOperationOk", { tzid: e, ban: 1 }).then((r) => !0);
  }
  repeat(e, r) {
    return this.getRequest("getNumRepeat", { service: e, number: r }).then((n) => n.tzid);
  }
  tariffs() {
    return this.getRequest("getNumbersStats", { country: "all" }).then((e) => e);
  }
  tariffsOne(e = 7) {
    return this.getRequest("getNumbersStats", { country: e }).then((r) => r);
  }
  service() {
    return this.getRequest("getService", {}).then((e) => e.service);
  }
  serviceNumber(e) {
    return this.getRequest("getServiceNumber", { service: e }).then((r) => r.number);
  }
  async wait_code(e, r = 10, n = null, s = !1, i = !1) {
    let o = "", h = 1;
    i && (h = 0);
    let c = 0;
    for (; ; ) {
      if (await Dt(r), c += 1, c >= 10)
        throw new Error("Timeout error");
      const a = await this.stateOne(e, h, !1);
      if ("msg" in a && !s && a.msg != o) {
        o = a.msg, await this.close(e);
        break;
      } else if ("msg" in a && s && a.msg != o) {
        o = a.msg, await this.next(e);
        break;
      }
    }
    return n && n(o), o;
  }
}
class Mt extends b {
  get(e = 7, r = 1, n = !1) {
    return this.getRequest("rent/getRentNum", { country: e, days: r, extension: n, pagination: !1 }).then((s) => s.item);
  }
  state() {
    return this.getRequest("rent/getRentState", { pagination: !1 }).then((e) => e.list);
  }
  stateOne(e) {
    return this.getRequest("rent/getRentState", { tzid: e, pagination: !1 }).then((r) => r.list[0]);
  }
  extend(e, r = 1) {
    return this.getRequest("rent/extendRentState", { tzid: e, days: r }).then((n) => n.item);
  }
  portReload(e) {
    return this.getRequest("rent/portReload", { tzid: e }).then((r) => !0);
  }
  tariffs() {
    return this.getRequest("rent/tariffsRent").then((e) => e);
  }
  tariffsOne(e = 7) {
    return this.getRequest("rent/tariffsRent", { country: e }).then((r) => r);
  }
  close(e) {
    return this.getRequest("rent/closeRentNum", { tzid: e }).then((r) => !0);
  }
}
class kt extends b {
  tariffs() {
    return this.getRequest("proxy/tariffs", {}).then((e) => e);
  }
  get(e = "days", r = "private", n = "https", s = 1, i = null, o = "any", h = "any", c = 1, a = !0) {
    return this.getRequest("proxy/getProxy", { class: e, type: r, connect: n, count: s, operator: i, country: o, city: h, port_count: c, session: a }).then((q) => q.item);
  }
  state(e = "ASC") {
    return this.getRequest("proxy/getState", { orderby: e }).then((r) => r.list);
  }
  stateOne(e) {
    return this.getRequest("proxy/getState", { tzid: e }).then((r) => r.list[0]);
  }
  changeIp(e) {
    return this.getRequest("proxy/changeIp", { tzid: e }).then((r) => !0);
  }
  changeType(e) {
    return this.getRequest("proxy/changeType", { tzid: e }).then((r) => r.connect_type);
  }
  setComment(e, r = "") {
    return this.getRequest("proxy/setComment", { tzid: e, comment: r }).then((n) => !0);
  }
}
class $t extends b {
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
    return this.getRequest("pay/createEmpty", e, !1).then((r) => r);
  }
}
class Ht extends b {
  countries() {
    return this.getRequest("getFreeCountryList", {}).then((e) => e.countries);
  }
  numbers(e) {
    return this.getRequest("getFreePhoneList", { country: e }).then((r) => r.numbers);
  }
  messages(e, r = 1) {
    return this.getRequest("getFreeMessageList", { phone: e, page: r }).then((n) => n.messages.data);
  }
  freeList() {
    return this.getRequest("getFreeList", {}).then((e) => e);
  }
}
class jt extends b {
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
  rotateProxy() {
    return this.getRequest("rotate", {}, !1);
  }
  /**
   * Create/update proxy comment.
   * @param id - The ID of the proxy.
   * @param comment - The comment to create or update.
   * @returns A promise that resolves to the result of the comment creation/update.
   */
  createOrUpdateProxyComment(e, r) {
    return this.postRequest(`proxies/${e}/comment`, { comment: r });
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
class zt {
  constructor(e = null, r = "en", n = null) {
    this.oauth = null, this.base = "https://onlinesim.host/api/", this.token = e, this.dev_id = n, this.lang = r;
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
    return new Ft(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  rent() {
    return new Mt(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  proxy() {
    return new kt(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  user() {
    return new $t(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  free() {
    return new Ht(this.token, this.lang, this.dev_id).createRequest(this.oauth, this.base);
  }
  onlineProxy() {
    return new jt(this.token, this.lang, this.dev_id).createRequest(this.token, "https://onlineproxy.io/api/client/v1/");
  }
}
try {
  window.OnlineSimDriver = zt;
} catch {
}
export {
  zt as default
};
