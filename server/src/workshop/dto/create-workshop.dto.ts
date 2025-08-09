import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateWorkshopDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
