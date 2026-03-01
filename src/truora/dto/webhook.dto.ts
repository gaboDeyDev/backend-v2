interface TruoraSigningResultResponse {
    event_type: string;
    sandbox: boolean;
    external_id: string;
    open_id: number;
    token: string;
    name: string;
    folder_path: string;
    status: string;
    lang: string;
    original_file: string;
    signed_file: string;
    created_through: string;
    deleted: boolean;
    deleted_at: null;
    signed_file_only_finished: boolean;
    disable_signer_emails: boolean;
    brand_logo: string;
    brand_primary_color: string;
    created_at: string;
    last_update_at: string;
    signers: Signer[];
    signer_who_signed: Signer;
    answers: Answer[];
}

interface Answer {
    variable: string;
    value: string;
}

interface Signer {
    external_id: string;
    token: string;
    status: string;
    name: string;
    lock_name: boolean;
    email: string;
    lock_email: boolean;
    phone_country: string;
    phone_number: string;
    lock_phone: boolean;
    times_viewed: number;
    last_view_at: string;
    signed_at: string;
    auth_mode: string;
    qualification: string;
    require_selfie_photo: boolean;
    require_document_photo: boolean;
    geo_latitude: string;
    geo_longitude: string;
    resend_attempts?: ResendAttempts;
    cpf?: string;
    cnpj?: string;
}
interface ResendAttempts {
    whatsapp: number;
    email: number;
    sms: number;
}