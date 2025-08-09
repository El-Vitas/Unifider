import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';
export class CreateGymDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  locationId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  equipment: string[];

  @ValidateNested()
  @Type(() => CreateScheduleDto)
  schedule: CreateScheduleDto;
}
