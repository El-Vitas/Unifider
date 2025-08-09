import { IsUUID, MinLength, IsNotEmpty } from 'class-validator';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends CreateLocationDto {
  @IsNotEmpty()
  @MinLength(1)
  @IsUUID()
  id: string;
}
