import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  createdBy: string;
}
