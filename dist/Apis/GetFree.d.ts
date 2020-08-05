import _base from "./_base";
interface GetCountriesOne {
    country: number;
    country_text: string;
}
interface GetNumbersOne {
    maxdate: string;
    number: string;
    country: number;
    updated_at: string;
    data_humans: string;
    full_number: string;
    country_text: string;
}
interface GetMessagesOne {
    text: string;
    in_number: string;
    my_number: number;
    created_at: string;
    data_humans: string;
}
export default class GetFree extends _base {
    countries(): Promise<Array<GetCountriesOne>>;
    numbers(country: number): Promise<Array<GetNumbersOne>>;
    messages(phone: number, page?: number): Promise<Array<GetMessagesOne>>;
}
export {};
