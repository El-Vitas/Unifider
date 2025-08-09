import { IsUUID, MinLength, IsNotEmpty } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends CreateTeamDto {
  @IsNotEmpty()
  @MinLength(1)
  @IsUUID()
  id: string;
}
