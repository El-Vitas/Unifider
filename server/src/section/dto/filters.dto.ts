import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FiltersDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  workshopId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  number?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  instructor?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;
}
