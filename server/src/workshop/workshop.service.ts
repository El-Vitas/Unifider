import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const workshops = await this.prisma.workshop.findMany({});
    if (!workshops) {
      throw new NotFoundException('No workshops found');
    }
    return workshops;
  }

  async findOneById(id: string) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
    });
    if (!workshop) {
      throw new NotFoundException(`Workshop with id ${id} not found`);
    }
    return workshop;
  }

  async findAllWithExtraData() {
    const workshops = await this.prisma.workshop.findMany({
      include: {
        sections: true,
      },
    });

    if (!workshops || workshops.length === 0) {
      throw new NotFoundException('No workshops found');
    }

    return workshops.map(({ sections, ...rest }) => {
      const sectionsCount: number = Array.isArray(sections)
        ? sections.length
        : 0;

      return {
        ...rest,
        sectionsCount,
      };
    });
  }
}
