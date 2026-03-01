// import { UndostresPaymentType } from "../types/undostres";

// export interface PayloadFetchModel {
//   Phone: string;
//   idSKU: string;
//   email: string;
// }

// export interface PayloadPayModel {
//   Phone: string;
//   idSKU: string;
//   amount: string;
//   email: string;
// }

// export interface BodyPayUndostres {
//   userId: number;
//   data: PayloadPayModel;
//   operationId : number;
//   transactionTypeId : number;
//   parentCatalogId : number;
//   type?: UndostresPaymentType;
// }

// export interface ApiResponseUndostres {
//   statusCode: number;
//   message: string;
//   data?: {
//       siftId?: string;
//       autorizacion?: string;
//   };
//   transaction_id?: string;
//   body: string
// }

// export interface AccountBalanceResponse {
//   amount: string;
// }

// export interface UndostresAccountInformationResponse {
//   status:               string;
//   http_status_code:     string;
//   account_balance:      string;
//   account_email:        string;
//   account_clabe_number: string;
//   request_id:           string;
// }

// export interface UndostresFetchResponse {
//   status:           string;
//   http_status_code: string;
//   balance_amount:   string;
//   request_id:       string;
// }

// export interface UndostresPayResponse {
//   status: string;
//   http_status_code: string;
//   siftId: string;
//   api_response: string;
//   purchase_vouchers: string;
//   autorizacion: string;
//   request_id: string;
// }