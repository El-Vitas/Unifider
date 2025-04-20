import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;
}
