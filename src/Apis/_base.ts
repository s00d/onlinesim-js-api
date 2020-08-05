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
  private locale: 'ru'|'en' = 'ru';
  constructor(apiToken: string, locale: 'ru'|'en' = 'ru') {
    this.token = apiToken
    this.request = axios.create({
      baseURL: 'https://onlinesim.ru/api/'
    })
  }

  protected getRequest(url: string, params: {[key: string]: any } = {}) {
    params.apikey = this.token;
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
