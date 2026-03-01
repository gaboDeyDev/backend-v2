export interface CreditAssignmentResponse {
  validations: Validations;
  points: number;
  onDemand: boolean;
  microcredit: boolean;
  amount: number;
  dailySalary: number;
  assignmentDate: string;
  endDate: string;
}

export interface ValidationResponse<T> {
  value: 0 | 1;
  approved: boolean;
  data: T;
}

export interface MOPResult {
  mop: string;
  numberDays?: number;
}

export interface Validations {
  validationAge: ValidationResponse<number>;
  validationScore: ValidationResponse<number>;
  validationNumberOfCredits: ValidationResponse<number>;
  validationLatePayments: ValidationResponse<number>;
  validationRangeActiveCredits: ValidationResponse<MOPResult>;
  /* validationIfItIsWorking: ValidationResponse<'W' | 'NW'>;
  validationMonthsWorked: ValidationResponse<number>;
  incomeValidation: ValidationResponse<number>;
  validationAnualDeclaration: ValidationResponse<string>; */
}
