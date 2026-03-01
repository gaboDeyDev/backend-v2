import { ListItemModel } from './ListItemModel';

export interface PhoneRechargeModel {
  id: number;
  name: string;
  code: string;
  operator: string;
  phone_number: string;
  user_id: number;
  list_item_id: number;
  created_at: Date;
  deleted_at: Date;
}

export interface PhoneRechargeBody {
  name: string;
  code: string;
  operator: string;
  phone_number: string;
  list_item_id: number;
  user_id: number;
}

export interface PhoneUpdateRechargeBody {
  name: string;
  code: string;
  operator: string;
  phone_number: string;
  list_item_id: number;
}

export interface PhoneRechargeResponse {
  id: number;
  name: string;
  code: string;
  operator: string;
  phone_number: string;
  list_item: ListItemModel;
  created_at: Date;
}
