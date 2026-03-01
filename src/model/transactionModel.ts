export interface TransactionFetch {
  id: string;
  user_id: number;
  transaction_commission_id?: number;
  cycle_id?: string;
  amount: number;
  balance: number;
  debt: number;
  commission_value: number;
  commission_use?: string;
  iva_value: number;
  status: number;
  entity?: number;
  provider_id?: string;
  reference?: string;
  details: string;
  mo_export: boolean;
  date_updated?: Date;
  date_created?: Date;
}
