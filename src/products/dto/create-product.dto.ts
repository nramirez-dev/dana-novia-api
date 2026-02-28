import { IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsIn(['DOP', 'USD'])
    currency: 'DOP' | 'USD';

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsArray()
    @IsString({ each: true })
    categoryIds: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    occasionIds?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}