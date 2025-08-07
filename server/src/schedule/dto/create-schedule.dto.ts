import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
  IsBoolean,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TimeBlockValidator } from '../validators/time-block.validator';

export class CreateScheduleTimeBlockDto {
  @IsNumber()
  dayOfWeek: number;

  @IsString()
  @Validate(TimeBlockValidator)
  startTime: string;

  @IsString()
  @Validate(TimeBlockValidator)
  endTime: string;

  @IsNumber()
  capacity: number;

  @IsBoolean()
  isEnabled: boolean;
}

export class CreateScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleTimeBlockDto)
  timeBlocks: CreateScheduleTimeBlockDto[];
}
