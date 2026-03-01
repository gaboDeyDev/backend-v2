export interface CreditCircleAuditInterface {
  id?: number;
  folio: string;
  query_type?: string;
  client_name: string;
  user: string;
  rfc: string;
  address: string;
  city: string;
  state: string;
  date_approved: Date;
  date_searched?: Date;
}

export interface CreditCircleAuditResponseInterface {
  id: number;
  folio: string;
  query_type: string;
  client_name: string;
  user: string;
  rfc: string;
  address: string;
  city: string;
  state: string;
  entry_pin_again: string;
  legend_authorization: string;
  tems_and_conditions: string;
  date_approved: Date;
  date_searched: Date;
}
