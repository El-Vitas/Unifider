import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateSectionDto {
  @IsNumber()
  number: number;

  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  workshopId: string;
}
