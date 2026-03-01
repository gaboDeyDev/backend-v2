export class AddressDto {
    street_name: string;
    street_number: string;
    floor: string;
    apartment: string;
    city: string;
    region: string;
    country: string;
    zip_code: string;
    neighborhood: string;
    additional_info: string;
}

export class CreatePomeloCardDto {
    user_id: string;
    affinity_group_id: string;
    card_type: string;
    address: AddressDto;
    // company?: string;
    // previous_card_id?: string;
    // parent_id?: string;
    pin: string;
    // name_on_card?: string;
}

export class UpdatePomeloCardDto {
    card_id: string
    affinity_group_id?: string
    status?: string
    status_reason?: string
    pin?: string
    parent_id?: string
}
