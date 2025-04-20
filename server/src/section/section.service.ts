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

  async findWithFiltersAndAllData(filtersDto: FiltersDto) {
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
      select: {
        id: true,
        number: true,
        imageUrl: true,
        description: true,
        instructor: true,
        capacity: true,
        timeSlots: {
          select: {
            startTime: true,
            endTime: true,
            location: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        bookings: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!sections || sections.length === 0) {
      throw new NotFoundException('No sections found');
    }

    return sections;
  }

  async findSectionBigCardDataFromUser(workshopId: string, email: string) {
    const sections = await this.prisma.section.findMany({
      where: {
        workshopId,
      },
      select: {
        id: true,
        number: true,
        imageUrl: true,
        description: true,
        instructor: true,
        capacity: true,
        timeSlots: {
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          },
        },
        bookings: {
          where: {
            user: {
              email,
            },
          },
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!sections || sections.length === 0) {
      throw new NotFoundException('No sections found');
    }

    const modifiedSections = sections.map(
      ({ bookings, _count, ...restOfSection }) => {
        const bookingsCount = _count.bookings;
        const isBooked = bookings.length > 0;

        return {
          ...restOfSection,
          isBooked,
          bookingsCount,
        };
      },
    );

    return modifiedSections;
  }
}
