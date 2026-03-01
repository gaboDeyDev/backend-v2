export class CustomerCreationDBDto {
    user: UserData;
    sensitive: SensitiveData;
    address: AddressData;
    kycVerification: KYCResultData;
    circleCreditValidation: CircleCreditData;
    company: CompanyData;
    employment: EmploymentData;
    terms: boolean;
    policy: boolean; 
}

export class UserData {
    name: string;
    familyName: string;
    lastName: string;
    nationality: string;
    birthdate:string;
    birthState:string;
    gender: string;
    residenceCountry: string;
    email: string;
}

export class SensitiveData {
    rfc: string;    
    curp: string;
    phoneNumber: string;
    ine?: string;
    passport?: string;
}

export class AddressData {
    legalStreetName: string;
    legalStreetNumber: string;
    legalZipCode: string;
    legalNeighborhood: string;
    legalCity: string;
    residenceState: string;
    legalMunicipality: string;
    legalAdditionalInfo?: string;
}

export class KYCResultData {
    valid: boolean;
    result: string;
}

export class CircleCreditData {
    valid: boolean;
    result: string;
}

export class CompanyData {
    name: string;
    address: string;
    colony: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
}

export class EmploymentData {
    phone?:string;
    extension?:string;
    fax?:string;
    position?:string;
    department?:string;
    hiringDay:string;
    currency:string;
    mounthSalary:number;
    lastDay?:string;
    verificationDay?:string;
    originCompanyAddress?:string;
    salaryFrecuency: string;
    insurance: string;
}