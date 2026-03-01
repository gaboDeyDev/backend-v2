export interface Credit {
  productType: string;
  userId: string;
  amountApproved: number;
  dailyAmount: number;
}

export interface UpdateCredit {
  creditId: string;
  newAmount: number;
}

export interface ContractInfo {
  contractName: string;
  creationDate: string;
  status: string;
  contractUrl: string;
}
