import { IsUUID } from 'class-validator';

export class UpdateGymImageDto {
  @IsUUID()
  gymId: string;
}
