import _base from "./_base";
export interface User {
    id: number;
    name: string;
    username: string;
    email: string | null;
    apikey: string | null;
    api_access: boolean | string;
    locale: 'ru' | 'en' | 'zh' | 'de';
    number_region: number | null;
    number_country: number | null;
    number_reject: null | Array<string>;
    ugroup: number;
    verify: number;
    block: number;
    payment: {
        payment: number;
        income: number;
        spent: number;
        now: number;
    };
}
export interface PayList {
    forms: {
        [key: number]: string;
    };
    currency: {
        [key: string]: number;
    };
    orders: {
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        data: {
            [key: string]: {
                id: number;
                id_user: number;
                stat: 0 | 1 | 2;
                sum: string;
                cashback: number;
                form: number;
                id_sale: string | null;
                promo: null | string;
                original_sum: number;
                currency: string;
                pay_at: null | string;
                created_at: string;
                updated_at: string;
            };
        };
    };
    paylist: {
        [key: string]: {
            list_id: number;
            enable: boolean;
            id: number;
            name: string;
            title: string;
            image: string;
            invert: boolean;
            add: {
                [key: string]: string;
            };
            coofPersent: number;
            curr: {
                RUB: boolean;
                USD: boolean;
                CNY: boolean;
                EUR: boolean;
                cryptocurrency: boolean;
            };
            links_method?: string;
            links?: Array<{
                sum: number;
                id: string;
                classes: string;
            }>;
        };
    };
}
export interface Pay {
    payId: number;
    params: {
        url: string;
        label: string;
        sum: string;
        comment: string;
        newtab: boolean;
        noreferrer: boolean;
        [key: string]: string | number | boolean;
    };
}
export default class GetUser extends _base {
    balance(): Promise<{
        balance: number;
        zbalance: number;
        income: number;
    }>;
    profile(): Promise<User>;
    getPaymentHistory(): Promise<PayList>;
    createEmpty(params: {
        [key: string]: any;
    }): Promise<Pay>;
}
