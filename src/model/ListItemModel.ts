export interface ListItemModel {
  id: number;
  name: string;
  display_name: string;
  description: string;
  code: string;
  enabled?: boolean;
  parent_catalogue_id?: number;
  catalog_type_id: number;
  date_created: Date;
  regex?: string;
  is_billable: Boolean;
}
