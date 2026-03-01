export interface PostEvaReport {
  privacyNotice: PrivacyNotice;
  employmentVerification: EmploymentVerification;
}

export interface EmploymentVerification {
  employmentVerificationRequestId: string;
  subscriptionId: string;
  curp: string;
  email: string;
  dataProvider: string;
}

export interface PrivacyNotice {
  fullName: FullName;
  address: Address;
  acceptanceDate: string;
  acceptance: string;
}

export interface Address {
  streetAndNumber: string;
  settlement: string;
  county: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface FullName {
  firstName: string;
  middleName: string;
  firstSurname: string;
  secondSurname: string;
  aditionalSurname: string;
}
