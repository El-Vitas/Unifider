import { Controller, Get } from '@nestjs/common';
import { SectionService } from './section.service';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { FiltersDto } from './dto/filters.dto';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  findByQuery(@Query() filtersDto: FiltersDto) {
    return this.sectionService.findWithFilters(filtersDto);
  }
}
