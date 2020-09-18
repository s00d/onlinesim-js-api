import _base from "./_base";

export interface Get {
  type: string;
  connect_type: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  operator: string;
  status: number;
  country: number;
  rent: string;
  comment: string|null;
  port_count:number;
  session:boolean;
  city: string|null;
  traffic:null|string;
  general_traffic:null|string;
  stop_at: string;
  check_at: string;
  created_at: string;
  updated_at: string;
  tzid: number;
  time:number;
  days:number;
  hours:number;
  change_ip:boolean;
  change_type:boolean;
  rotate:boolean;
}


export interface Tariff {
  days: {
    config: {[type: string]: {
        type: string,
        enabled: boolean,
        days: {[count: number]: number}
    }},
    operators: Array<string>,
    connect: Array<string>,
  },
  traffic: {
    config: {
      [code: string]: {
        name: string
        cities: {[name: string]: string}
        operators: {[code: string]: string}
      },
    },
    price: {[tariff: string]: number}
  }
}



export default class GetProxy extends _base {
  tariffs(): Promise<Tariff> {
    return this.getRequest('proxy/tariffs', {}).then((resp) => {
      return resp
    })
  }


  get(cl:'days'|'traffic' = 'days', type:'shared'|'sharednowait'|'private'|'privatenowait'|'multiport' = 'private', connect:'https'|'socks' = 'https', count = 1, operator:'mts'|'megafon'|'beeline'|'tele2'|null = null, country:string = 'any', city = 'any', port_count = 1, session = true): Promise<Get> {
    return this.getRequest('proxy/getProxy', {class: cl, type,connect,count,operator,country,city,port_count,session}).then((resp) => {
      return resp.item
    })
  }

  state(orderby:'ASC'|'DESC' = 'ASC'): Promise<Array<Get>> {
    return this.getRequest('proxy/getState', {orderby}).then((resp) => {
      return resp.list
    })
  }

  stateOne(tzid:number): Promise<Get> {
    return this.getRequest('proxy/getState', {tzid}).then((resp) => {
      return resp.list[0]
    })
  }

  changeIp(tzid:number): Promise<boolean> {
    return this.getRequest('proxy/changeIp', {tzid}).then((resp) => {
      return true
    })
  }

  changeType(tzid:number): Promise<string> {
    return this.getRequest('proxy/changeType', {tzid}).then((resp) => {
      return resp.connect_type
    })
  }

  setComment(tzid:number, comment:string = ''): Promise<boolean> {
    return this.getRequest('proxy/setComment', {tzid, comment}).then((resp) => {
      return true
    })
  }

}
