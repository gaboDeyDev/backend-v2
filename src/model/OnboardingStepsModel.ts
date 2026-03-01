interface VerificationStatus {
  mailVerified: boolean;
  phoneVerified: boolean;
}

export interface OnboardingStepsModel extends VerificationStatus {
  blacklist: boolean;
  creditCircle: boolean;
  evaVerification: boolean;
  creditAssignment: boolean;
  processId: string;
  identityVerification: boolean;
  contractSigning: boolean;
  cutoffSelected?: boolean;
  identityVerificationStatus?: string;
  attempt: number;
}

export interface VerificationData extends VerificationStatus {
  uid: string;
}
