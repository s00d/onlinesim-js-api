import axios, {AxiosInstance} from 'axios';
import {NoNumberException, RequestException} from '../Exceptions';

export interface Resp {
  response: number|string;
  [key: string]: any;
  [key: number]: any;
}

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36';

export default class _base {
  private token: string|null;
  private request: AxiosInstance;
  private dev_id: number|null;
  private lang: string;
  constructor(apiToken: string|null, lang: string, dev_id: number|null) {
    this.token = apiToken;
    this.dev_id = dev_id;
    this.lang = lang;
    this.request = axios.create({
      baseURL: 'https://onlinesim.host/api/',
      headers: {
        'User-Agent': userAgent
      }
    });
  }

  createRequest(token: string|null, base = 'https://onlinesim.host/api/') {
    const headers: {[key: string]: string} = {
      'User-Agent': userAgent
    };
    if(token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.request = axios.create({
      baseURL: base,
      headers: headers
    });
    return this;
  }

  getRequest(url: string, params: {[key: string]: any } = {}, suf = true) {
    if(this.token) {
      params.apikey = this.token;
    }
    params.lang = this.lang;
    if(this.dev_id) {
      params.dev_id = this.dev_id;
    }

    let ssuf = suf ? '.php' : '';
    return this.request.get(url+ssuf, {params: params}).then((response) => {
      const resp: Resp = response.data;
      if('response' in resp && resp.response.toString() !== '1') {
        if(resp.response.toString() === 'NO_NUMBER' ||resp.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
          throw new NoNumberException(resp.response.toString());
        }
        throw new RequestException(resp.response.toString());
      }

      delete response.data.response;
      return response.data;
    });
  }

  postRequest(url: string,  params: {[key: string]: any } = {}) {
    params.apikey = this.token;
    params.lang = this.lang;
    if(this.dev_id) {
      params.dev_id = this.dev_id;
    }
    return this.request.post(`${url}.php`, params).then((response) => {
      const resp: Resp = response.data;
      if('response' in resp && resp.response.toString() !== '1') {
        if(resp.response.toString() === 'NO_NUMBER' ||resp.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
          throw new NoNumberException(resp.response.toString());
        }
        throw new RequestException(resp.response.toString());
      }
      delete response.data.response;
      return response.data;
    });
  }
}
