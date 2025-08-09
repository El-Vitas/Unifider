import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FiltersDto } from './dto/filters.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

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
    return sections || [];
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

    return sections || [];
  }

  async findByWorkshopIdWithUserData(workshopId: string, email: string) {
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
      return [];
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

  async create(
    createSectionDto: CreateSectionDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/section-images/${file.filename}` : null;

    const section = await this.prisma.section.create({
      data: {
        ...createSectionDto,
        imageUrl,
        createdBy: userId,
      },
    });

    return section;
  }

  async update(
    id: string,
    updateSectionDto: UpdateSectionDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const existingSection = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new NotFoundException('Section not found');
    }

    const imageUrl = file
      ? `/uploads/section-images/${file.filename}`
      : existingSection.imageUrl;

    const section = await this.prisma.section.update({
      where: { id },
      data: {
        ...updateSectionDto,
        imageUrl,
        updatedAt: new Date(),
      },
    });

    return section;
  }

  async delete(id: string) {
    const existingSection = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existingSection) {
      throw new NotFoundException('Section not found');
    }

    await this.prisma.section.delete({
      where: { id },
    });

    return { message: 'Section deleted successfully' };
  }

  async bookSection(sectionId: string, userEmail: string) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        bookings: {
          where: {
            user: {
              email: userEmail,
            },
          },
        },
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (section.bookings.length > 0) {
      throw new ConflictException('User already booked this section');
    }

    await this.prisma.section.update({
      where: { id: sectionId },
      data: {
        bookings: {
          create: {
            bookingDate: new Date(),
            user: {
              connect: {
                email: userEmail,
              },
            },
          },
        },
      },
    });

    return { message: 'Section booked successfully' };
  }

  async unbookSection(sectionId: string, userEmail: string) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        bookings: {
          where: {
            user: {
              email: userEmail,
            },
          },
        },
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (section.bookings.length === 0) {
      throw new ConflictException('User has not booked this section');
    }

    await this.prisma.section.update({
      where: { id: sectionId },
      data: {
        bookings: {
          delete: {
            id: section.bookings[0].id,
          },
        },
      },
    });

    return { message: 'Section unbooked successfully' };
  }
}
