import { IsUUID, MinLength, IsNotEmpty } from 'class-validator';
import { CreateWorkshopDto } from './create-workshop.dto';

export class UpdateWorkshopDto extends CreateWorkshopDto {
  @IsNotEmpty()
  @MinLength(1)
  @IsUUID()
  id: string;
}
