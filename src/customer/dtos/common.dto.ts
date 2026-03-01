import { IsInt, IsNotEmpty, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    @IsNotEmpty()
    page: number;
    
    @IsInt()
    @IsPositive()
    @Min(1)
    @IsNotEmpty()
    limit: number;
}