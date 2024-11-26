import { default as _base } from './_base';
export interface Get {
    tzid: number;
    status: number;
    messages: Array<{
        id: number;
        service: string;
        text: string;
        code: string;
        created_at: string;
    }>;
    country: number;
    rent: number;
    extension: number;
    sum: number;
    number: string;
    time: number;
    hours: number;
    extend: Array<{
        [days: number]: number;
    }>;
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
    count: {
        [count: string]: number;
    };
    days: {
        [count: string]: number;
    };
    extend: number;
}
export declare class GetRent extends _base {
    get(country?: number, days?: number, extension?: boolean): Promise<Get>;
    state(): Promise<Array<Get>>;
    stateOne(tzid: number): Promise<Get>;
    extend(tzid: number, days?: number): Promise<Get>;
    portReload(tzid: number): Promise<boolean>;
    tariffs(): Promise<{
        [code: string]: Tariff;
    }>;
    tariffsOne(country?: number): Promise<Tariff>;
    close(tzid: number): Promise<boolean>;
}
