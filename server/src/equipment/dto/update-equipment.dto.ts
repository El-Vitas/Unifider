import { CreateEquipmentDto } from './create-equipment.dto';
import { IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class UpdateEquipmentDto extends CreateEquipmentDto {
  @IsNotEmpty()
  @MinLength(1)
  @IsUUID()
  id: string;
}
