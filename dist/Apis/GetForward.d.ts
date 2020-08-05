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
interface ForwardingListOne {
    id: number;
    id_number: string;
    group: string;
    status: string;
    number: string;
    forward_number: Array<string>;
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
interface CallListOne {
    id: number;
    number_forward_client: string;
    number_forward: string;
    payment_minutes: number;
    start_at: string;
    stop_at: string;
    created_at: string;
}
export default class GetForward extends _base {
    get(forward_numbers: Array<string>, service?: 'unlimited_sms' | 'forward_without_sms', region?: null | number, reject?: Array<number>): Promise<string>;
    state(message_to_code?: number, orderby?: 'ASC' | 'DESC', msg_list?: boolean, clean?: boolean): Promise<Array<StateOne>>;
    stateOne(tzid: number, message_to_code?: number, orderby?: 'ASC' | 'DESC', msg_list?: boolean, clean?: boolean): Promise<StateOne>;
    close(tzid: number): Promise<boolean>;
    next(tzid: number): Promise<boolean>;
    setEnable(tzid: number): Promise<boolean>;
    forwardingList(page?: number, orderby?: 'ASC' | 'DESC'): Promise<Array<ForwardingListOne>>;
    forwardingListOne(tzid: number, page?: number, orderby?: 'ASC' | 'DESC'): Promise<ForwardingListOne>;
    save(tzid: number, auto?: boolean, forward_number?: null | Array<null>): Promise<boolean>;
    remove(tzid: number): Promise<boolean>;
    callList(number: number, count?: number, page?: number, orderby?: 'ASC' | 'DESC'): Promise<Array<CallListOne>>;
}
export {};
