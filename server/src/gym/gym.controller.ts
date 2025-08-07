import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { isUUID } from 'class-validator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { ImageUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { Express } from 'express';
import { UpdateGymDto } from './dto/update-gym.dto';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Get()
  @Permissions(permissionFactory.canRead(Resource.GYM))
  findAll() {
    return this.gymService.findGymsData();
  }

  @Get(':value')
  @Permissions(
    permissionFactory.canRead(Resource.GYM),
    permissionFactory.canRead(Resource.SCHEDULE),
    permissionFactory.canRead(Resource.BOOKING),
    permissionFactory.canRead(Resource.EQUIPMENT),
    permissionFactory.canRead(Resource.LOCATION),
  )
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.gymService.findOneById(value);
    } else {
      return await this.gymService.findOneByName(value);
    }
  }

  @Get(':gymName/equipment')
  @Permissions(
    permissionFactory.canRead(Resource.GYM),
    permissionFactory.canRead(Resource.EQUIPMENT),
  )
  async getGymEquipment(@Param('gymName') gymName: string) {
    return await this.gymService.getGymEquipment(gymName);
  }

  @Get(':gymId/schedule')
  @Permissions(
    permissionFactory.canRead(Resource.GYM),
    permissionFactory.canRead(Resource.SCHEDULE),
    permissionFactory.canRead(Resource.BOOKING),
  )
  @UseInterceptors(UserInterceptor)
  async getGymScheduleForBooking(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @User() user: UserEntity,
  ) {
    return await this.gymService.getGymScheduleForBooking(gymId, user.id);
  }

  @Post('create')
  @Permissions(
    permissionFactory.canCreate(Resource.GYM),
    permissionFactory.canCreate(Resource.SCHEDULE),
  )
  @UseInterceptors(UserInterceptor)
  async create(@Body() createGymDto: CreateGymDto, @User() user: UserEntity) {
    return this.gymService.create(createGymDto, user.id);
  }

  @Post(':gymId/image')
  @Permissions(permissionFactory.canUpdate(Resource.GYM))
  @UseInterceptors(ImageUploadInterceptor('gym-images'))
  async updateImage(
    @Param('gymId') gymId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = `/uploads/gym-images/${image.filename}`;
    return await this.gymService.updateImage(gymId, imageUrl);
  }

  @Patch(':id/edit')
  @Permissions(
    permissionFactory.canCreate(Resource.GYM),
    permissionFactory.canCreate(Resource.SCHEDULE),
  )
  async editGym(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGymDto: UpdateGymDto,
  ) {
    return await this.gymService.update(id, updateGymDto);
  }

  @Get(':id/bookings')
  @Permissions(
    permissionFactory.canRead(Resource.GYM),
    permissionFactory.canRead(Resource.SCHEDULE),
    permissionFactory.canRead(Resource.BOOKING),
  )
  async getGymBookings(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('timeBlockId') timeBlockId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      ...(dayOfWeek && { dayOfWeek: parseInt(dayOfWeek) }),
      ...(timeBlockId && { timeBlockId }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };

    return await this.gymService.getGymBookings(id, filters);
  }

  @Delete(':id/bookings/:bookingId')
  @Permissions(permissionFactory.canDelete(Resource.BOOKING))
  async cancelUserBooking(
    @Param('id', ParseUUIDPipe) gymId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return await this.gymService.cancelUserBooking(gymId, bookingId);
  }

  @Delete(':id/timeblock/:timeBlockId/booking')
  @UseInterceptors(UserInterceptor)
  @Permissions(permissionFactory.canDelete(Resource.BOOKING))
  async cancelUserBookingByTimeBlock(
    @Param('id', ParseUUIDPipe) gymId: string,
    @Param('timeBlockId', ParseUUIDPipe) timeBlockId: string,
    @User() user: UserEntity,
  ) {
    return await this.gymService.cancelUserBookingByTimeBlock(
      gymId,
      timeBlockId,
      user.id,
    );
  }

  @Post(':id/bookings/reset')
  @Permissions(permissionFactory.canDelete(Resource.BOOKING))
  async resetGymBookings(
    @Param('id', ParseUUIDPipe) gymId: string,
    @Body()
    options?: {
      dayOfWeek?: number;
      timeBlockId?: string;
      reason?: string;
    },
  ) {
    return await this.gymService.resetGymBookings(gymId, options || {});
  }

  @Post('booking/multiple')
  @Permissions(permissionFactory.canCreate(Resource.BOOKING))
  @UseInterceptors(UserInterceptor)
  async createMultipleBookings(
    @Body()
    bookingData: {
      bookings: Array<{ scheduleTimeBlockId: string; bookingDate: string }>;
    },
    @User() user: UserEntity,
  ) {
    return await this.gymService.createMultipleBookings(
      bookingData.bookings,
      user.id,
    );
  }

  @Delete('delete/:id')
  @Permissions(
    permissionFactory.canDelete(Resource.GYM),
    permissionFactory.canRead(Resource.GYM),
  )
  deleteLocation(@Param('id', ParseUUIDPipe) id: string) {
    return this.gymService.deleteGym(id);
  }
}
