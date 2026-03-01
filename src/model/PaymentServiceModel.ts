export interface PaymentServiceModel {
  id: number;
  service_type: string;
  company: string;
  code: string;
  reference: string;
  custom_name: string;
  user_id: number;
  list_item_id: number;
  list_item_company: number;
  date_created: Date;
  date_deleted: Date;
}

export interface PaymentServiceBody {
  code: string;
  company: string;
  user_id: number;
  reference: string;
  custom_name: string;
  service_type: string;
  list_item_id: number;
  list_item_company: number;
}

export interface PaymentServiceUpdateBody {
  code: string;
  company: string;
  reference: string;
  custom_name: string;
  service_type: string;
  list_item_id: number;
  list_item_company: number;
}

export interface PaymentServiceResponse {
  id: number;
  code: string;
  reference: string;
  custom_name: string;
  service_type: string;
  date_created: Date;
}
