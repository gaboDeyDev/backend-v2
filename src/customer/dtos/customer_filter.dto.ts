import { IsString, IsOptional, IsIn } from "class-validator";

export class CustomerFilterDto {
  @IsString()
  @IsOptional()
  q?: string;
  @IsIn(['id', 'names', 'lastname', 'email', 'web_validation', 'app_id'])
  @IsOptional()
  sortBy?: 'id'| 'names'| 'lastname'| 'email'| 'web_validation'| 'app_id';
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC'| 'DESC';
}