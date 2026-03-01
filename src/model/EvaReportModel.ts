export interface EvaReportModel {
  acknowledgeId: string;
  dateTime: string;
  operation: string;
  message: string;
  employmentVerification: EmploymentVerification;
}

export interface EmploymentVerification {
  request: Request;
  names: string;
  birthday: string;
  workStatus: 'W' | 'NW';
  industry: string;
  industryRiskSegment: string;
  affiliationStatus?: string;
  workingHistory: WorkingHistory;
}

export interface Request {
  employmentVerificationRequestId: string;
  subscriptionId: string;
  inquiryId: string;
  curp: string;
  dataProvider: string;
  email: string;
  inquiryStatus: string;
  successCheck: boolean;
}

export interface WorkingHistory {
  date: string;
  weeksContributed: WeeksContributed;
  workingHistoryDetail: WorkingHistoryDetail[];
}

export interface WeeksContributed {
  totalContributedWeeks: number;
  discountedWeeks: number;
  reinstatedWeeks: number;
}

export interface WorkingHistoryDetail {
  employerName: string;
  employerRegister: string;
  federalEntity: string;
  startDate: string;
  lastContributionBaseSalary: number;
  workStatusEvents: WorkStatusEvent[];
  endDate?: string;
}

export interface WorkStatusEvent {
  changeType: number;
  eventDate: string;
  baseSalary: string;
}
