import _base from "./_base";
interface Get {
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
    comment: string | null;
    port_count: number;
    session: boolean;
    city: string | null;
    traffic: null | string;
    general_traffic: null | string;
    stop_at: string;
    check_at: string;
    created_at: string;
    updated_at: string;
    tzid: number;
    time: number;
    days: number;
    hours: number;
    change_ip: boolean;
    change_type: boolean;
    rotate: boolean;
}
export default class GetProxy extends _base {
    get(cl?: 'days' | 'traffic', type?: 'shared' | 'sharednowait' | 'private' | 'privatenowait' | 'multiport', connect?: 'https' | 'socks', count?: number, operator?: 'mts' | 'megafon' | 'beeline' | 'tele2' | null, country?: number, city?: string, port_count?: number, session?: boolean): Promise<Get>;
    state(orderby?: 'ASC' | 'DESC'): Promise<Array<Get>>;
    stateOne(tzid: number): Promise<Get>;
    changeIp(tzid: number): Promise<boolean>;
    changeType(tzid: number): Promise<string>;
    setComment(tzid: number, comment?: string): Promise<boolean>;
}
export {};