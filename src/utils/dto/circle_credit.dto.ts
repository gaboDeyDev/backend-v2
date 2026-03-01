export class CircleCreditPersonDataDto{
    familyName: string;
    lastName: string;
    dob: string;
    nationality: string;
    firstName: string;
    rfc: string;
    address: Address;
}

export class Address {
    city: string;
    colony: string;
    state: string;
    zipCode: string;
    municipality: string;
    address: string;
}