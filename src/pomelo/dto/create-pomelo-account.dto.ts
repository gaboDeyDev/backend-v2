export class CreatePomeloAccountDto {
    owner_type: 'USER' | 'BUSINESS';
    user_id: string;
    country: string;
    currency: string;
    metadata: {
        [key: string]: any;
    };
}