export interface TagModel {
  id: number;
  code: string;
  custom_name: string;
  company: string;
  tag_number: string;
  user_id: number;
  list_item_id: number;
  created_at: Date;
  deleted_at: Date;
}

export interface TagBody {
  code: string;
  company: string;
  user_id: number;
  tag_number: string;
  custom_name: string;
  list_item_id: number;
}

export interface TagUpdateBody {
  code: string;
  company: string;
  tag_number: string;
  custom_name: string;
  list_item_id: number;
}

export interface TagResponse {
  id: number;
  code: string;
  custom_name: string;
  number: string;
  created_at: Date;
}
