import axios, {AxiosInstance, AxiosResponse} from "axios";
import {NoNumberException, RequestException} from "../Exceptions";

interface Resp {
  response: number|string
  [key: string]: any
  [key: number]: any
}

export default class _base {
  private token: string;
  private request: AxiosInstance;
  private dev_id: number|null;
  private lang: string;
  constructor(apiToken: string, lang: string, dev_id: number|null) {
    this.token = apiToken
    this.dev_id = dev_id
    this.lang = lang
    this.request = axios.create({
      baseURL: 'https://onlinesim.ru/api/'
    })
  }

  protected getRequest(url: string, params: {[key: string]: any } = {}) {
    params.apikey = this.token;
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
