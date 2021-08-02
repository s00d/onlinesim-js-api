import axios, {AxiosInstance} from "axios";
import {NoNumberException, RequestException} from "../Exceptions";

export interface Resp {
  response: number|string
  [key: string]: any
  [key: number]: any
}

export default class _base {
  private token: string|null;
  private request: AxiosInstance;
  private dev_id: number|null;
  private lang: string;
  constructor(apiToken: string|null, lang: string, dev_id: number|null) {
    this.token = apiToken
    this.dev_id = dev_id
    this.lang = lang
    this.request = axios.create({
      baseURL: 'https://onlinesim.ru/api/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
      }
    })
  }

  createRequest(token: string|null, base = 'https://onlinesim.ru/api/') {
    const headers: {[key: string]: string} = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
    }
    if(token) {
      headers['Authorization'] = 'Bearer ' +  token
    }

    this.request = axios.create({
      baseURL: base,
      headers: headers
    })
    return this;
  }

  protected getRequest(url: string, params: {[key: string]: any } = {}) {
    if(this.token) {
      params.apikey = this.token
    }
    params.lang = this.lang;
    if(this.dev_id) {
      params.dev_id = this.dev_id
    }
    return this.request.get(url+'.php', {params: params}).then((response) => {
      const resp: Resp = response.data;
      if('response' in resp && resp.response.toString() !== '1') {
        if(resp.response.toString() === 'NO_NUMBER' ||resp.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
          throw new NoNumberException(resp.response.toString());
        }
        throw new RequestException(resp.response.toString());
      }

      delete response.data.response
      return response.data
    })
  }

  protected postRequest(url: string,  params: {[key: string]: any } = {}) {
    params.apikey = this.token;
    params.lang = this.lang;
    if(this.dev_id) {
      params.dev_id = this.dev_id
    }
    return this.request.post(url+'.php', params).then((response) => {
      const resp: Resp = response.data;
      if('response' in resp && resp.response.toString() !== '1') {
        if(resp.response.toString() === 'NO_NUMBER' ||resp.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
          throw new NoNumberException(resp.response.toString());
        }
        throw new RequestException(resp.response.toString());
      }
      delete response.data.response
      return response.data
    })
  }
}
