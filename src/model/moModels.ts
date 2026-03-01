// Modelos MO

/* -------------------------------------------------------------------------- */
/*                               GENERAL MODELS                               */
/* -------------------------------------------------------------------------- */

export interface Change {
  timestamp: string;
  new_credit_limit: string;
  old_credit_limit: string;
}

/* -------------------------------------------------------------------------- */
/*                                UPDATE SCORE                                */
/* -------------------------------------------------------------------------- */

export interface UpdateScoreResponse {
  status_code: number;
  status: string;
  processing_time: number;
  response_data: UpdateScoreResponseData;
  system_timestamp: string;
}

export interface UpdateScoreResponseData {
  customer_id: string;
  product_id: string;
  pre_approved_amount: string;
  pre_approved_at: string;
  payment_day: string;
  others?: any;
}

/* -------------------------------------------------------------------------- */
/*                                GET MOVEMENTS                               */
/* -------------------------------------------------------------------------- */

export interface GetMovementsResponse {
  status_code: number;
  status: string;
  processing_time: number;
  response_data: GetMovementsResponseData;
  system_timestamp: string;
}

export interface GetMovementsResponseData {
  results: Result[];
  filtered: number;
  links: Links;
  count: number;
}

export interface Links {
  next: null;
  previous: null;
}

export interface Result {
  id: string;
  card_external_id: string;
  external_id: string;
  amount: string;
  movement_type: string;
  description: string;
  created_at: string;
  others?: any;
}

/* -------------------------------------------------------------------------- */
/*                          GET CUSTOMER INFORMATION                          */
/* -------------------------------------------------------------------------- */

export interface GetCustomerInformationResponse {
  status_code: number;
  status: string;
  processing_time: number;
  response_data: GetCustomerInformationResponseData;
  system_timestamp: Date;
}

export interface GetCustomerInformationResponseData {
  external_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  product: Product;
  account_card: AccountCard;
}

export interface AccountCard {
  external_id: string;
  status: string;
  others: AccountCardOthers;
  cards: Card[];
}

export interface Card {
  external_id: string;
  brand: string;
  card_type: string;
  card_number: string;
  is_main: boolean;
  status: string;
  others: CardOthers;
}

export interface CardOthers {
  product_id: string;
}

export interface AccountCardOthers {}

export interface Product {
  product_id: string;
  interest_rate: string;
}

/* -------------------------------------------------------------------------- */
/*                               CREATE CUSTOMER                              */
/* -------------------------------------------------------------------------- */

export interface CreateCustomerResponse {
  status_code: number;
  status: string;
  processing_time: number;
  response_data: CreateCustomerResponseData;
  system_timestamp: Date;
}

export interface CreateCustomerResponseData {
  id: string;
  external_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  email: string;
  phone_number: string;
  identification_number: string;
  identification_type: string;
  line_of_credit: LineOfCredit;
}

export interface LineOfCredit {
  pre_approved_amount: string;
  product_id: string;
  others?: any;
}

/* -------------------------------------------------------------------------- */
/*                            GET SEGMENTS RESPONSE                           */
/* -------------------------------------------------------------------------- */

export interface ProductData {
  product_id: string;
  product_name: string;
  interest_rate: string;
  credit_line: string;
  minimum_loan_amount: string;
  maximum_loan_amount: string;
  credit_type: string;
}

export interface GetSegmentResponse {
  status_code: number;
  status: string;
  processing_time: number;
  response_data: ProductData[];
  system_timestamp: string;
}

/* -------------------------------------------------------------------------- */
/*                            GET CUSTOMER BALANCE RESPONSE                   */
/* -------------------------------------------------------------------------- */

export interface CustomerBalanceData {
  customer_external_id: string;
  pre_approved_amount: string;
  available_amount: string;
  total_debt: string;
  balance_on_hold: string;
  advance: string;
  debt_in_dispute: string;
  payment_promise: string;
  maximum_payment_date: string;
  closing_date: string;
}

export interface GetCustomerBalanceResponse {
  status_code: number;
  status: string;
  processing_time: number;
  response_data: CustomerBalanceData;
  system_timestamp: string;
}

export class Authorization {
  external_id: string;

  amount: number;

  account_card_external_id: string;

  card_external_id: string;

  others?: any;
}

/* -------------------------------------------------------------------------- */
/*                     CREATE MO ABONE TRANSACTION PAYLOAD                    */
/* -------------------------------------------------------------------------- */

export interface CreateMoAboneTransactionModel {
  userId: string;
  amountToPay: number;
  debt: number;
  transaction_external_id: string;
}
