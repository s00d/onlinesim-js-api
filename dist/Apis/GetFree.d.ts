import { default as _base } from './_base';
export interface GetCountriesOne {
    country: number;
    country_text: string;
    country_original?: string;
}
export interface GetNumbersOne {
    maxdate: string;
    number: string;
    country: number;
    updated_at: string;
    data_humans: string;
    full_number: string;
    country_text: string;
}
export interface GetMessagesOne {
    text: string;
    in_number: string;
    my_number: number;
    created_at: string;
    data_humans: string;
}
export interface GetNumbersListOne {
    country: number;
    country_original: string;
    data_humans: string;
    full_number: string;
    is_archive: boolean;
}
export interface GetFreeListResponse {
    countries: Array<GetCountriesOne>;
    numbers: {
        [key: string]: GetNumbersListOne;
    };
    messages: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
        number: string;
        country: number;
        data: Array<GetMessagesOne>;
    };
}
export declare class GetFree extends _base {
    countries(): Promise<Array<GetCountriesOne>>;
    numbers(country: number): Promise<Array<GetNumbersOne>>;
    messages(phone: number, page?: number): Promise<Array<GetMessagesOne>>;
    freeList(): Promise<GetFreeListResponse>;
}
