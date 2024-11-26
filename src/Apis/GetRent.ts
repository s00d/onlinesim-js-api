import _base from './_base';

export interface Get {
  tzid: number;
  status: number;
  messages: Array<{id:number, service:string, text:string,code:string,created_at:string}>;
  country: number;
  rent: number;
  extension: number;
  sum: number;
  number: string;
  time: number;
  hours: number;
  extend: Array<{ [days: number]: number }>;
  checked: boolean;
  reload: number;
  day_extend: number;
}

export interface Tariff {
  code: number;
  enabled: boolean;
  name: string;
  new: boolean;
  position: number;
  count: { [count: string]: number };
  days: { [count: string]: number };
  extend:number;
}


export class GetRent extends _base {
  get(country = 7, days = 1, extension = false): Promise<Get> {
    return this.getRequest('rent/getRentNum', {country,days,extension,pagination:false}).then((resp) => {
      return resp.item;
    });
  }

  state(): Promise<Array<Get>> {
    return this.getRequest('rent/getRentState', {pagination:false}).then((resp) => {
      return resp.list;
    });
  }

  stateOne(tzid: number): Promise<Get> {
    return this.getRequest('rent/getRentState', {tzid,pagination:false}).then((resp) => {
      return resp.list[0];
    });
  }

  extend(tzid: number, days = 1): Promise<Get> {
    return this.getRequest('rent/extendRentState', {tzid,days}).then((resp) => {
      return resp.item;
    });
  }

  portReload(tzid: number): Promise<boolean> {
    return this.getRequest('rent/portReload', {tzid}).then((resp) => {
      return true;
    });
  }

  tariffs(): Promise<{ [code: string]: Tariff }> {
    return this.getRequest('rent/tariffsRent').then((resp) => {
      return resp;
    });
  }

  tariffsOne(country: number = 7): Promise<Tariff> {
    return this.getRequest('rent/tariffsRent', {country}).then((resp) => {
      return resp;
    });
  }

  close(tzid:number): Promise<boolean> {
    return this.getRequest('rent/closeRentNum', {tzid}).then((resp) => {
      return true;
    });
  }

}
