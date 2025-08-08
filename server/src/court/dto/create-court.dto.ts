import { IsString, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';

export class CreateCourtDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  locationId: string;

  @ValidateNested()
  @Type(() => CreateScheduleDto)
  schedule: CreateScheduleDto;
}
