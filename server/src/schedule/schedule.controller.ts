import { ScheduleService } from './schedule.service';
import { Get, Controller } from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { permissionFactory } from 'src/common/permissions/permissionFactory';
import { Resource } from 'src/common/permissions/permission.enum';
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('/default')
  @Permissions(permissionFactory.canRead(Resource.SCHEDULE))
  getDefaultTimeBlock() {
    return this.scheduleService.getDefaultTimeBlock();
  }
}
