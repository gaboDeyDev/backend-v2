export class LegalAddressDto {
    street_name: string;
    street_number: number;
    floor: number;
    apartment: string;
    zip_code: number;
    neighborhood: string;
    city: string;
    region: string;
    additional_info: string;
    country: string;
}

export class CreatePomeloUserDto {
    name: string;
    surname: string;
    identification_type: string;
    identification_value: string;
    birthdate: string; // ISO date string (e.g., "1999-08-19")
    gender: string;
    email: string;
    phone: string;
    tax_identification_type: string;
    tax_identification_value: string;
    nationality: string;
    tax_condition: string;
    legal_address: LegalAddressDto;
    operation_country: string;
}