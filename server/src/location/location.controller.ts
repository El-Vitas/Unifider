import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { isUUID } from 'class-validator';
import { CreateLocationDto } from './dto/create-location.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { User as UserEntity } from 'src/user/entities/user.entity';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';

@Controller('location')
export class LocationsController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':value')
  @Permissions(permissionFactory.canRead(Resource.LOCATION))
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.locationService.findOneById(value);
    } else {
      return await this.locationService.findOneByName(value);
    }
  }

  @Get()
  @Permissions(permissionFactory.canRead(Resource.LOCATION))
  findAll() {
    return this.locationService.findAll();
  }

  @Put('update')
  @Permissions(permissionFactory.canUpdate(Resource.LOCATION))
  updateLocation(@Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.updateLocation(updateLocationDto);
  }

  @Post('create')
  @UseInterceptors(UserInterceptor)
  @Permissions(permissionFactory.canCreate(Resource.LOCATION))
  createLocation(
    @Body() createLocationDto: CreateLocationDto,
    @User() user: UserEntity,
  ) {
    return this.locationService.createLocation(createLocationDto, user.id);
  }

  @Delete('delete/:id')
  @Permissions(
    permissionFactory.canDelete(Resource.LOCATION),
    permissionFactory.canRead(Resource.LOCATION),
  )
  deleteLocation(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.locationService.deleteLocation(id);
  }
}
