import { Injectable, NotFoundException } from '@nestjs/common';
import { FiltersDto } from './dto/filters.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async findWithFilters(filtersDto: FiltersDto) {
    const where = Object.entries(filtersDto).reduce(
      (acc: Record<string, string | number | boolean>, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value as string | number | boolean;
        }
        return acc;
      },
      {} as Record<string, string | number | boolean>,
    );

    const sections = await this.prisma.section.findMany({
      where,
    });
    if (!sections || sections.length === 0) {
      throw new NotFoundException('No sections found');
    }
    return sections;
  }
}
