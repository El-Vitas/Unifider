import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { validateTimeBlock } from '../domain/timeblock';

interface TimeBlockDto {
  startTime: string;
  endTime: string;
}

@ValidatorConstraint({ name: 'TimeBlockValidator', async: false })
export class TimeBlockValidator implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as TimeBlockDto;
    return validateTimeBlock(dto.startTime, dto.endTime);
  }

  defaultMessage(args: ValidationArguments): string {
    const dto = args.object as TimeBlockDto;
    return `Invalid time block: ${dto.startTime}-${dto.endTime}. Must match predefined schedule blocks.`;
  }
}
