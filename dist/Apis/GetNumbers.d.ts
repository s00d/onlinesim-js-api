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
export interface TariffCountryOne {
    name: string;
    position: number;
    code: number;
    new: boolean;
    enabled: boolean;
    services: {
        [service: string]: {
            count: number;
            popular: boolean;
            price: number;
            id: string | number;
            service: string | number;
            slug: string | number;
        };
    };
}
interface callbackType {
    (code: string | null): void;
}
export default class GetNumbers extends _base {
    price(service: string, country?: number): Promise<string>;
    get(service: string, country?: number, reject?: Array<number>, extension?: boolean): Promise<number>;
    state(message_to_code?: number, orderby?: 'ASC' | 'DESC', msg_list?: boolean, clean?: boolean, repeat?: boolean): Promise<Array<StateOne>>;
    stateOne(tzid: number, message_to_code?: number, msg_list?: boolean, clean?: boolean, repeat?: boolean): Promise<StateOne>;
    next(tzid: number): Promise<boolean>;
    close(tzid: number): Promise<boolean>;
    repeat(service: string, number: number): Promise<number>;
    tariffs(): Promise<{
        [country: string]: TariffCountryOne;
    }>;
    tariffsOne(country?: number): Promise<TariffCountryOne>;
    service(): Promise<Array<string>>;
    serviceNumber(service: string): Promise<Array<string>>;
    wait_code(tzid: number, timeout?: number, callback?: null | callbackType, not_end?: boolean): Promise<string>;
}
export {};
