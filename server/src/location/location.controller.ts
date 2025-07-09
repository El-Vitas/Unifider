import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { LocationService } from './location.service';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateLocationDto } from './dto/update-location.dto';
import { isUUID } from 'class-validator';
import { CreateLocationDto } from './dto/create-location.dto';
@Controller('location')
export class LocationsController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get(':value')
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.locationService.findOneById(value);
    } else {
      return await this.locationService.findOneByName(value);
    }
  }

  @Public()
  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Public()
  @Put('update')
  updateLocation(@Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.updateLocation(updateLocationDto);
  }

  @Public()
  @Post('create')
  createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.createLocation(createLocationDto);
  }
}
