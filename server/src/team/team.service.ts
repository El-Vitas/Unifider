import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    try {
      const team = await this.prisma.team.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          instructor: true,
          contact: true,
          imageUrl: true,
        },
      });

      if (!team) {
        throw new BadGatewayException('Team not found');
      }

      return team;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching team by ID');
    }
  }

  async findOneByName(name: string) {
    try {
      name = name.toLowerCase().trim();
      const team = await this.prisma.team.findUnique({
        where: { name },
        select: {
          id: true,
          name: true,
          instructor: true,
          contact: true,
          imageUrl: true,
        },
      });
      if (!team) {
        throw new BadGatewayException(`Team with name ${name} not found`);
      }
      return team;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching team by name');
    }
  }

  async findAll() {
    try {
      const teams = await this.prisma.team.findMany({
        select: {
          id: true,
          name: true,
          instructor: true,
          contact: true,
          imageUrl: true,
        },
      });

      return teams || [];
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching teams');
    }
  }

  async updateTeam(updateTeamDto: UpdateTeamDto) {
    try {
      const { id, name, instructor, contact, imageUrl } = updateTeamDto;

      const updatedTeam = await this.prisma.team.update({
        where: { id },
        data: { name, instructor, contact, imageUrl },
      });

      return updatedTeam;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error updating team');
    }
  }

  async createTeam(createTeamDto: CreateTeamDto, id: string) {
    try {
      const { name, instructor, contact, imageUrl } = createTeamDto;

      const newTeam = await this.prisma.team.create({
        data: { name, instructor, contact, imageUrl, createdBy: id },
      });

      return newTeam;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error creating team');
    }
  }

  async updateImage(teamId: string, imageUrl: string) {
    try {
      const team = await this.prisma.team.update({
        where: { id: teamId },
        data: { imageUrl },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      });

      return team;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error updating team image');
    }
  }

  async deleteTeam(id: string) {
    try {
      const team = await this.findOneById(id);
      await this.prisma.team.delete({
        where: { id: team.id },
      });
      return { message: 'Team deleted successfully' };
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error deleting team');
    }
  }
}
