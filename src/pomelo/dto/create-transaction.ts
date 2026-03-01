export interface CreateTransactionDto {
    account_id: string;
    type: string;
    process_type: string;
    parent_tx_id?: string;
    data: {
        // tx_properties: {
        //     merchant_id: string;
        //     address: string;
        //     merchant_name: string;
        //     merchant_logo_url: string;
        //     card_type: string;
        //     point_type: string;
        //     entry_mode: string;
        //     last_digits: string;
        //     card_brand: string;
        //     card_bin: string;
        //     mcc: string;
        // };
        tx_properties: any;
        description: {
            [locale: string]: string;
        };
        details: Array<{
            amount: string;
            entry_type: string;
            type: string;
            subtype: string;
            description: {
                [locale: string]: string;
            };
            metadata?: string;
        }>;
        metadata?: string;
    };
    entry_type: string;
    total_amount: string;
    process_before?: string;
    accounts_id?: string[];
    client_id?: string;
    local?: {
        total: string;
        currency: string;
    };
    settlement?: {
        total: string;
        currency: string;
    };
    transaction?: {
        total: string;
        currency: string;
    };
}