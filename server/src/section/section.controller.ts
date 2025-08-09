import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { FiltersDto } from './dto/filters.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
import { ImageUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { Express } from 'express';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  @Permissions(permissionFactory.canRead(Resource.SECTION))
  findByQuery(@Query() filtersDto: FiltersDto) {
    return this.sectionService.findWithFilters(filtersDto);
  }

  @Get(':id')
  @Permissions(permissionFactory.canRead(Resource.SECTION))
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.findById(id);
  }

  @Get('/all')
  @Permissions(permissionFactory.canRead(Resource.SECTION))
  findByQueryWithAllData(@Query() filtersDto: FiltersDto) {
    return this.sectionService.findWithFiltersAndAllData(filtersDto);
  }

  @Get('/workshop/:id')
  @Permissions(permissionFactory.canRead(Resource.SECTION))
  @UseInterceptors(UserInterceptor)
  findByWorkshopId(
    @Param('id', ParseUUIDPipe) workshopId: string,
    @User() user: UserEntity,
  ) {
    return this.sectionService.findByWorkshopIdWithUserData(
      workshopId,
      user.email,
    );
  }

  @Post()
  @Permissions(permissionFactory.canCreate(Resource.SECTION))
  @UseInterceptors(UserInterceptor, ImageUploadInterceptor('section-images'))
  create(
    @Body() createSectionDto: CreateSectionDto,
    @User() user: UserEntity,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sectionService.create(createSectionDto, user.id, file);
  }

  @Post('/booking')
  @Permissions(
    permissionFactory.canRead(Resource.SECTION),
    permissionFactory.canCreate(Resource.BOOKING),
  )
  @UseInterceptors(UserInterceptor)
  book(
    @Body('sectionId', ParseUUIDPipe) sectionId: string,
    @User() user: UserEntity,
  ) {
    return this.sectionService.bookSection(sectionId, user.email);
  }

  @Post('/unbooking')
  @Permissions(
    permissionFactory.canRead(Resource.SECTION),
    permissionFactory.canCreate(Resource.BOOKING),
  )
  @UseInterceptors(UserInterceptor)
  unbook(
    @Body('sectionId', ParseUUIDPipe) sectionId: string,
    @User() user: UserEntity,
  ) {
    return this.sectionService.unbookSection(sectionId, user.email);
  }

  @Put(':id')
  @Permissions(permissionFactory.canUpdate(Resource.SECTION))
  @UseInterceptors(UserInterceptor, ImageUploadInterceptor('section-images'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSectionDto: UpdateSectionDto,
    @User() user: UserEntity,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sectionService.update(id, updateSectionDto, user.id, file);
  }

  @Delete(':id')
  @Permissions(permissionFactory.canDelete(Resource.SECTION))
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.delete(id);
  }
}
