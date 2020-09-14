import _base from "./_base";

export interface StateOne {
  tzid: number;
  response: string;
  number: number;
  service: string;
  time: number;
  msg: any;
  extend: number;
  country: number;
}

export interface ForwardingListOne {
  id: number;
  id_number: string;
  group: string;
  status: string;
  number: string;
  forward_number: Array<string>
  extension: string;
  date_block: string;
  created_at: string;
  repeat: string;
  comment: string;
  data: string;
  region: string;
  company_id: string;
  service: string;
}

export interface CallListOne {
  id: number;
  number_forward_client: string;
  number_forward: string;
  payment_minutes: number;
  start_at: string;
  stop_at: string;
  created_at: string;
}

export default class GetForward extends _base {
  get(forward_numbers: Array<string>, service: 'unlimited_sms'|'forward_without_sms' = 'unlimited_sms', region:null|number = null, reject:Array<number> = []): Promise<string> {
    return this.getRequest('getForward', {forward_numbers, service, region, reject}).then((resp) => {
      return resp.tzid
    })
  }

  state(message_to_code = 1, orderby:'ASC'|'DESC' = 'ASC', msg_list = true, clean = true): Promise<Array<StateOne>> {
    return this.getRequest('getState', {message_to_code, orderby, msg_list:msg_list?1:0, clean:clean?1:0,type: 'forward'}).then((resp) => {
      return resp
    })
  }

  stateOne(tzid: number, message_to_code = 1, orderby:'ASC'|'DESC' = 'ASC', msg_list = true, clean = true): Promise<StateOne> {
    return this.getRequest('getState', {tzid, message_to_code, orderby, msg_list:msg_list?1:0, clean:clean?1:0,type: 'forward'}).then((resp) => {
      return resp
    })
  }

  close(tzid: number): Promise<boolean> {
    return this.getRequest('setOperationOk', {tzid}).then((resp) => {
      return true
    })
  }

  next(tzid: number): Promise<boolean> {
    return this.getRequest('setOperationRevise', {tzid}).then((resp) => {
      return true
    })
  }

  setEnable(tzid: number): Promise<boolean> {
    return this.getRequest('setForwardStatusEnable', {tzid}).then((resp) => {
      return true
    })
  }

  forwardingList(page = 1, orderby:'ASC'|'DESC' = 'ASC'): Promise<Array<ForwardingListOne>> {
    return this.getRequest('forwardingList').then((resp) => {
      return resp.forwardingList.data
    })
  }

  forwardingListOne(tzid:number, page = 1, orderby:'ASC'|'DESC' = 'ASC'): Promise<ForwardingListOne> {
    return this.getRequest('forwardingList', {id: tzid}).then((resp) => {
      return resp.forwarding
    })
  }

  save(tzid: number, auto = true, forward_number: null|Array<null> = null): Promise<boolean> {
    let data: {id: number, auto: boolean, forward_number?: Array<null>} = {
      id: tzid,
      auto: auto,
    };
    if(forward_number) {
      data.forward_number = forward_number;
    }
    return this.getRequest('forwardingSave', {tzid}).then((resp) => {
      return true
    })
  }

  remove(tzid:number): Promise<boolean> {
    return this.getRequest('forwardingRemove', {id: tzid}).then((resp) => {
      return true
    })
  }

  callList(number: number, count = 10, page = 1, orderby:'ASC'|'DESC' = 'ASC'): Promise<Array<CallListOne>> {
    return this.getRequest('getCallNumberList', {number, count, page, order: orderby}).then((resp) => {
      return resp.list.data
    })
  }
}
