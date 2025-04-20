import { Controller, Get, ParseUUIDPipe } from '@nestjs/common';
import { SectionService } from './section.service';
import {
  Param,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { FiltersDto } from './dto/filters.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  findByQuery(@Query() filtersDto: FiltersDto) {
    return this.sectionService.findWithFilters(filtersDto);
  }

  @Get('/all')
  findByQueryWithAllData(@Query() filtersDto: FiltersDto) {
    return this.sectionService.findWithFiltersAndAllData(filtersDto);
  }

  @Get('/card-info/:id')
  findSectionBigCardDataFromUser(
    @Param('id', ParseUUIDPipe) workshopId: string,
    @User() user: { email: string; role: string },
  ) {
    const email = user.email;
    return this.sectionService.findSectionBigCardDataFromUser(
      workshopId,
      email,
    );
  }
}
