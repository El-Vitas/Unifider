import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { CreateWorkshopDto } from './dto/create-workshop.dto';

@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    try {
      const workshop = await this.prisma.workshop.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!workshop) {
        throw new BadGatewayException('Workshop not found');
      }

      return workshop;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching workshop by ID');
    }
  }

  async findOneByName(name: string) {
    try {
      name = name.toLowerCase().trim();
      const workshop = await this.prisma.workshop.findUnique({
        where: { name },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      });
      if (!workshop) {
        throw new BadGatewayException(`Workshop with name ${name} not found`);
      }
      return workshop;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching workshop by name');
    }
  }

  async findAll() {
    try {
      const workshops = await this.prisma.workshop.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          _count: {
            select: {
              sections: true,
            },
          },
        },
      });

      return workshops || [];
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching workshops');
    }
  }

  async findAllWithSections() {
    try {
      const workshops = await this.prisma.workshop.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          sections: {
            select: {
              id: true,
            },
          },
        },
      });

      return workshops.map(({ sections, ...rest }) => ({
        ...rest,
        sectionsCount: sections?.length || 0,
      }));
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching workshops with sections');
    }
  }

  async updateWorkshop(updateWorkshopDto: UpdateWorkshopDto) {
    try {
      const { id, name, description, imageUrl } = updateWorkshopDto;

      const updatedWorkshop = await this.prisma.workshop.update({
        where: { id },
        data: { name, description, imageUrl },
      });

      return updatedWorkshop;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error updating workshop');
    }
  }

  async createWorkshop(createWorkshopDto: CreateWorkshopDto, userId: string) {
    try {
      const { name, description, imageUrl } = createWorkshopDto;

      const newWorkshop = await this.prisma.workshop.create({
        data: { name, description, imageUrl, createdBy: userId },
      });

      return newWorkshop;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error creating workshop');
    }
  }

  async updateImage(workshopId: string, imageUrl: string) {
    try {
      const workshop = await this.prisma.workshop.update({
        where: { id: workshopId },
        data: { imageUrl },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      });

      return workshop;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error updating workshop image');
    }
  }

  async deleteWorkshop(id: string) {
    try {
      const workshop = await this.findOneById(id);
      await this.prisma.workshop.delete({
        where: { id: workshop.id },
      });
      return { message: 'Workshop deleted successfully' };
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error deleting workshop');
    }
  }
}
