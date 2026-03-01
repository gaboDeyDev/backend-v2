import { Type } from "class-transformer";
import { IsInt, IsPositive, Min, IsNotEmpty } from "class-validator";

export class PaginationDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @Min(1)
    @IsNotEmpty()
    page: number;
    
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @Min(1)
    @IsNotEmpty()
    limit: number;
}