import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
