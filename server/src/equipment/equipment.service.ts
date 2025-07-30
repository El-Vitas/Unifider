import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    try {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      });

      if (!equipment) {
        throw new NotFoundException('Equipment not found');
      }

      return equipment;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Error fetching equipment by ID');
    }
  }

  async findOneByName(name: string) {
    try {
      const normalizedName = name.toLowerCase().trim();
      const equipment = await this.prisma.equipment.findUnique({
        where: { name: normalizedName },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
      });
      if (!equipment) {
        throw new NotFoundException(`Equipment with name ${name} not found`);
      }

      return equipment;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching equipment by name');
    }
  }

  async findEquipmentsData() {
    try {
      const equipment = await this.prisma.equipment.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      if (!equipment || equipment.length === 0) {
        return [];
      }
      return equipment;
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw new BadGatewayException('Failed to retrieve equipment data');
    }
  }

  async createEquipment(createEquipmentDto: CreateEquipmentDto, id: string) {
    try {
      const { name, description, imageUrl } = createEquipmentDto;

      const newEquipment = await this.prisma.equipment.create({
        data: {
          name: name?.trim().toLowerCase(),
          description: description?.trim().toLowerCase(),
          imageUrl: imageUrl?.trim() || undefined,
          createdBy: id,
        },
      });

      return newEquipment;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error creating equipment');
    }
  }

  async updateEquipment(updateEquipmentDto: UpdateEquipmentDto) {
    try {
      const { id, name, description, imageUrl } = updateEquipmentDto;

      const updatedEquipment = await this.prisma.equipment.update({
        where: { id },
        data: {
          name: name?.trim().toLowerCase(),
          description: description?.trim().toLowerCase(),
          imageUrl: imageUrl?.trim() || undefined,
        },
      });

      return updatedEquipment;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error updating equipment');
    }
  }

  async deleteEquipment(id: string) {
    try {
      const deletedEquipment = await this.prisma.equipment.delete({
        where: { id },
      });
      return deletedEquipment;
    } catch (error) {
      console.error('Error deleting equipment:', error);
      throw new BadGatewayException('Failed to delete equipment');
    }
  }
}
