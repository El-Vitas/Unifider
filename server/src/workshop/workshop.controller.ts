import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { isUUID } from 'class-validator';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { User as UserEntity } from 'src/user/entities/user.entity';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
import { ImageUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';

@Controller('workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get(':value')
  @Permissions(permissionFactory.canRead(Resource.WORKSHOP))
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.workshopService.findOneById(value);
    } else {
      return await this.workshopService.findOneByName(value);
    }
  }

  @Get()
  @Permissions(permissionFactory.canRead(Resource.WORKSHOP))
  findAll() {
    return this.workshopService.findAll();
  }

  @Get('detailed/with-sections')
  @Permissions(permissionFactory.canRead(Resource.WORKSHOP))
  findAllWithSections() {
    return this.workshopService.findAllWithSections();
  }

  @Put('update')
  @Permissions(permissionFactory.canUpdate(Resource.WORKSHOP))
  updateWorkshop(@Body() updateWorkshopDto: UpdateWorkshopDto) {
    return this.workshopService.updateWorkshop(updateWorkshopDto);
  }

  @Post('create')
  @UseInterceptors(UserInterceptor)
  @Permissions(permissionFactory.canCreate(Resource.WORKSHOP))
  createWorkshop(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @User() user: UserEntity,
  ) {
    return this.workshopService.createWorkshop(createWorkshopDto, user.id);
  }

  @Post(':workshopId/image')
  @Permissions(permissionFactory.canUpdate(Resource.WORKSHOP))
  @UseInterceptors(ImageUploadInterceptor('workshop-images'))
  async updateImage(
    @Param('workshopId') workshopId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = `/uploads/workshop-images/${image.filename}`;
    return await this.workshopService.updateImage(workshopId, imageUrl);
  }

  @Delete('delete/:id')
  @Permissions(
    permissionFactory.canDelete(Resource.WORKSHOP),
    permissionFactory.canRead(Resource.WORKSHOP),
  )
  deleteWorkshop(@Param('id', ParseUUIDPipe) id: string) {
    return this.workshopService.deleteWorkshop(id);
  }
}
