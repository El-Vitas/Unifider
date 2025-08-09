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
import { CourtService } from './court.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { isUUID } from 'class-validator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { ImageUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { Express } from 'express';
import { UpdateCourtDto } from './dto/update-court.dto';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Get()
  @Permissions(permissionFactory.canRead(Resource.COURT))
  findAll() {
    return this.courtService.findCourtsData();
  }

  @Get('cards-info')
  findCardsInfo() {
    return this.courtService.findCardsInfo();
  }

  @Get(':value')
  @Permissions(
    permissionFactory.canRead(Resource.COURT),
    permissionFactory.canRead(Resource.SCHEDULE),
    permissionFactory.canRead(Resource.BOOKING),
    permissionFactory.canRead(Resource.LOCATION),
  )
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.courtService.findOneById(value);
    } else {
      return await this.courtService.findOneByName(value);
    }
  }

  @Get(':courtId/schedule')
  @Permissions(
    permissionFactory.canRead(Resource.COURT),
    permissionFactory.canRead(Resource.SCHEDULE),
    permissionFactory.canRead(Resource.BOOKING),
  )
  @UseInterceptors(UserInterceptor)
  async getCourtScheduleForBooking(
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @User() user: UserEntity,
  ) {
    return await this.courtService.getCourtScheduleForBooking(courtId, user.id);
  }

  @Post('create')
  @Permissions(
    permissionFactory.canCreate(Resource.COURT),
    permissionFactory.canCreate(Resource.SCHEDULE),
  )
  @UseInterceptors(UserInterceptor)
  async create(
    @Body() createCourtDto: CreateCourtDto,
    @User() user: UserEntity,
  ) {
    return this.courtService.create(createCourtDto, user.id);
  }

  @Post(':courtId/image')
  @Permissions(permissionFactory.canUpdate(Resource.COURT))
  @UseInterceptors(ImageUploadInterceptor('court-images'))
  async updateImage(
    @Param('courtId') courtId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = `/uploads/court-images/${image.filename}`;
    return await this.courtService.updateImage(courtId, imageUrl);
  }

  @Patch(':id/edit')
  @Permissions(
    permissionFactory.canCreate(Resource.COURT),
    permissionFactory.canCreate(Resource.SCHEDULE),
  )
  async editCourt(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourtDto: UpdateCourtDto,
  ) {
    return await this.courtService.update(id, updateCourtDto);
  }

  @Get(':id/bookings')
  @Permissions(
    permissionFactory.canRead(Resource.COURT),
    permissionFactory.canRead(Resource.SCHEDULE),
    permissionFactory.canRead(Resource.BOOKING),
  )
  async getCourtBookings(
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

    return await this.courtService.getCourtBookings(id, filters);
  }

  @Delete(':id/bookings/:bookingId')
  @Permissions(permissionFactory.canDelete(Resource.BOOKING))
  async cancelUserBooking(
    @Param('id', ParseUUIDPipe) courtId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return await this.courtService.cancelUserBooking(courtId, bookingId);
  }

  @Delete(':id/timeblock/:timeBlockId/booking')
  @UseInterceptors(UserInterceptor)
  @Permissions(permissionFactory.canDelete(Resource.BOOKING))
  async cancelUserBookingByTimeBlock(
    @Param('id', ParseUUIDPipe) courtId: string,
    @Param('timeBlockId', ParseUUIDPipe) timeBlockId: string,
    @User() user: UserEntity,
  ) {
    return await this.courtService.cancelUserBookingByTimeBlock(
      courtId,
      timeBlockId,
      user.id,
    );
  }

  @Post(':id/bookings/reset')
  @Permissions(permissionFactory.canDelete(Resource.BOOKING))
  async resetCourtBookings(
    @Param('id', ParseUUIDPipe) courtId: string,
    @Body()
    options?: {
      dayOfWeek?: number;
      timeBlockId?: string;
      reason?: string;
    },
  ) {
    return await this.courtService.resetCourtBookings(courtId, options || {});
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
    return await this.courtService.createMultipleBookings(
      bookingData.bookings,
      user.id,
    );
  }

  @Delete('delete/:id')
  @Permissions(
    permissionFactory.canDelete(Resource.COURT),
    permissionFactory.canRead(Resource.COURT),
  )
  deleteCourt(@Param('id', ParseUUIDPipe) id: string) {
    return this.courtService.deleteCourt(id);
  }
}
