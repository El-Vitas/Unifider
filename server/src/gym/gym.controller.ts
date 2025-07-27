import { Controller, Get } from '@nestjs/common';
import { GymService } from './gym.service';
import { Param } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Get()
  @Permissions(permissionFactory.canRead(Resource.GYM))
  findAll() {
    return this.gymService.findGymsData();
  }

  @Get(':value')
  @Permissions(permissionFactory.canRead(Resource.GYM))
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.gymService.findOneById(value);
    } else {
      return await this.gymService.findOneByName(value);
    }
  }
}
