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
import { TeamService } from './team.service';
import { UpdateTeamDto } from './dto/update-team.dto';
import { isUUID } from 'class-validator';
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { User as UserEntity } from 'src/user/entities/user.entity';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
import { ImageUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';

@Controller('team')
export class TeamsController {
  constructor(private readonly teamService: TeamService) {}

  @Get(':value')
  @Permissions(permissionFactory.canRead(Resource.TEAM))
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.teamService.findOneById(value);
    } else {
      return await this.teamService.findOneByName(value);
    }
  }

  @Get()
  @Permissions(permissionFactory.canRead(Resource.TEAM))
  findAll() {
    return this.teamService.findAll();
  }

  @Put('update')
  @Permissions(permissionFactory.canUpdate(Resource.TEAM))
  updateTeam(@Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.updateTeam(updateTeamDto);
  }

  @Post('create')
  @UseInterceptors(UserInterceptor)
  @Permissions(permissionFactory.canCreate(Resource.TEAM))
  createTeam(@Body() createTeamDto: CreateTeamDto, @User() user: UserEntity) {
    return this.teamService.createTeam(createTeamDto, user.id);
  }

  @Post(':teamId/image')
  @Permissions(permissionFactory.canUpdate(Resource.TEAM))
  @UseInterceptors(ImageUploadInterceptor('team-images'))
  async updateImage(
    @Param('teamId') teamId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = `/uploads/team-images/${image.filename}`;
    return await this.teamService.updateImage(teamId, imageUrl);
  }

  @Delete('delete/:id')
  @Permissions(
    permissionFactory.canDelete(Resource.TEAM),
    permissionFactory.canRead(Resource.TEAM),
  )
  deleteTeam(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.deleteTeam(id);
  }
}
