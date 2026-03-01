export interface CommissionCalculationReturn {
  transactionCommissionId: number;
  totalValue: number;
  commissionAmountWithoutIva: number;
  commissionIvaCalculation?: number;
  iva: number;
  initialAmount: number;
}
