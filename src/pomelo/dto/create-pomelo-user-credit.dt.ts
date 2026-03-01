export interface PomeloLimitsDto {
    single_payment: number;
    cash_advance_percentage: number;
    cash_advance: number;
    installments: number;
}

export class CreatePomeUserCreditDto {
    user_id: string;
    product_id: string;
    limits: PomeloLimitsDto;
    offer_start_date: string; // ISO date string (e.g., "2022-04-20")
    offer_end_date: string;   // ISO date string (e.g., "2029-05-20")
    due_date: number;
    user_scoring: string;
    person_type: string;
}