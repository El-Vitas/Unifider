import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto = {
        ...createUserDto,
        fullName: createUserDto.fullName.toLowerCase().trim(),
        email: createUserDto.email.toLowerCase().trim(),
      };
      const { roleId, ...userData } = createUserDto;
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          role: {
            connect: { id: roleId },
          },
        },
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User creation failed');
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('User not found');
    }
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
