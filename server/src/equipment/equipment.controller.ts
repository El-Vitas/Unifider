import { Controller, Get, Put } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
import { Delete, Param } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { Post, Body, UseInterceptors } from '@nestjs/common';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { User } from 'src/common/decorators/user.decorator';
import type { User as UserEntity } from 'src/user/entities/user.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { isUUID } from 'class-validator';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get(':value')
  @Permissions(permissionFactory.canRead(Resource.EQUIPMENT))
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.equipmentService.findOneById(value);
    } else {
      return await this.equipmentService.findOneByName(value);
    }
  }

  @Get()
  @Permissions(permissionFactory.canRead(Resource.EQUIPMENT))
  findAll() {
    return this.equipmentService.findEquipmentsData();
  }

  @Post('create')
  @UseInterceptors(UserInterceptor)
  @Permissions(permissionFactory.canCreate(Resource.EQUIPMENT))
  createEquipment(
    @Body() createEquipmentDto: CreateEquipmentDto,
    @User() user: UserEntity,
  ) {
    return this.equipmentService.createEquipment(createEquipmentDto, user.id);
  }

  @Put('update')
  @Permissions(permissionFactory.canUpdate(Resource.EQUIPMENT))
  updateEquipment(@Body() updateEquipmentDto: UpdateEquipmentDto) {
    return this.equipmentService.updateEquipment(updateEquipmentDto);
  }

  @Delete('delete/:id')
  @Permissions(
    permissionFactory.canDelete(Resource.EQUIPMENT),
    permissionFactory.canRead(Resource.EQUIPMENT),
  )
  deleteEquipment(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.equipmentService.deleteEquipment(id);
  }
}
