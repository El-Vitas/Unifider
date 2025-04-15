import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByName(name: string) {
    const role = await this.prisma.role.findUnique({
      where: { name },
    });

    if (!role) {
      console.error('Role not found:', name);
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  async findOneById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      console.error('Role not found:', id);
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }
}
