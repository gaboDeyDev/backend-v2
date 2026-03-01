interface Transaction {
  account_id?: number;
  transaction_id: string;
  transaction_commission_id: number;
  amount: string;
  status: number;
  entity: number;
  provider_id: string;
  reference?: string;
  claveRastreo?: string;
  details: string;
  user_id: number;
}

interface CalculateCommissionQuery {
  userId: number;
  amount: number;
  operationId: number;
  operationType: number;
}

interface CalculateCommissionResponse {
  transactionCommissionId: number;
  totalValue: number;
  commissionAmountWithoutIva: number;
  commissionIvaCalculation?: number;
  iva: number;
  initialAmount: number;
}
