import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    try {
      const location = await this.prisma.location.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      if (!location) {
        throw new BadGatewayException('Location not found');
      }

      return location;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching location by ID');
    }
  }

  async findOneByName(name: string) {
    try {
      name = name.toLowerCase().trim();
      const location = await this.prisma.location.findUnique({
        where: { name },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
      if (!location) {
        throw new BadGatewayException(`Location with name ${name} not found`);
      }
      return location;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching location by name');
    }
  }

  async findAll() {
    try {
      const locations = await this.prisma.location.findMany({
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      if (!locations || locations.length === 0) {
        throw new BadGatewayException('No locations found');
      }

      return locations;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching locations');
    }
  }

  async updateLocation(updateLocationDto: UpdateLocationDto) {
    try {
      const { id, name, description } = updateLocationDto;

      const updatedLocation = await this.prisma.location.update({
        where: { id },
        data: { name, description },
      });

      return updatedLocation;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error updating location');
    }
  }

  async createLocation(createLocationDto: CreateLocationDto, id: string) {
    try {
      const { name, description } = createLocationDto;

      const newLocation = await this.prisma.location.create({
        data: { name, description, createdBy: id },
      });

      return newLocation;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error creating location');
    }
  }

  async deleteLocation(id: string) {
    try {
      const location = await this.findOneById(id);
      await this.prisma.location.delete({
        where: { id: location.id },
      });
      return { message: 'Location deleted successfully' };
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error deleting location');
    }
  }
}
