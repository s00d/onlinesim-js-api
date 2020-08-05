import _base from "./_base";

interface StateOne {
  tzid: number;
  response: string;
  number: number;
  service: string;
  time: number;
  msg: any;
  extend: number;
  country: number;
}

interface TariffCountryOne {
  name: string;
  position: number;
  code: number;
  new: boolean;
  enabled: boolean;
  services: {[service: string]: {
      count: number;
      popular: boolean;
      price: number;
      id: string|number;
      service: string|number;
      slug: string|number;
    }}
}

export default class GetNumbers extends _base {
  price(service: string, country = 7): Promise<string> {
    return this.getRequest('getPrice', {service, country}).then((resp) => {
      return resp.price
    })
  }

  get(service: string, country = 7, reject: Array<number> = [], extension = false): Promise<number> {
    return this.getRequest('getNum', {service, country, reject, extension}).then((resp) => {
      return resp.tzid
    })
  }

  state(message_to_code = 1, orderby:'ASC'|'DESC' = 'ASC', msg_list = true, clean = true, repeat = false): Promise<Array<StateOne>> {
    return this.getRequest('getState', {message_to_code, orderby, msg_list:msg_list?1:0, clean:clean?1:0, type: repeat?'repeat':'index'})
      .then((resp) => {
        return resp
      })
  }

  stateOne(tzid: number, message_to_code = 1, msg_list = true, clean = true, repeat = false): Promise<StateOne> {
    return this.getRequest('getState', {tzid, message_to_code, msg_list, clean, repeat})
      .then((resp) => {
        return resp[0]
      })
  }

  next(tzid: number): Promise<boolean> {
    return this.getRequest('setOperationRevise', {tzid}).then((resp) => {
      return true
    })
  }

  close(tzid: number): Promise<boolean> {
    return this.getRequest('setOperationOk', {tzid}).then((resp) => {
      return true
    })
  }

  repeat(service: string, number: number): Promise<number> {
    return this.getRequest('getNumRepeat', {service, number}).then((resp) => {
      return resp.tzid
    })
  }

  tariffs(): Promise<{[country: string]: TariffCountryOne }> {
    return this.getRequest('getNumbersStats', {country: 'all'}).then((resp) => {
      return resp
    })
  }

  tariffsOne(country: number = 7): Promise<TariffCountryOne> {
    return this.getRequest('getNumbersStats', {country}).then((resp) => {
      return resp
    })
  }

  service(): Promise<Array<string>> {
    return this.getRequest('getService', {}).then((resp) => {
      return resp.service
    })
  }

  serviceNumber(service: string): Promise<Array<string>> {
    return this.getRequest('getServiceNumber', {service}).then((resp) => {
      return resp.number
    })
  }
}
