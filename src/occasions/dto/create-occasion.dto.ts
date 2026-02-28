import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOccasionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;
}
